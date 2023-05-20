import { LightningElement, track } from 'lwc';
import { schemas } from '../../../../../_common/generated/schema';
import { getType } from '../../../../../_common/src/protoUtil';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';
import type { Data } from '../schemaInput/schemaInput';
import { EventDetail } from '../../models/eventDetail';
import { getInstrumentation } from 'o11y/client';
import { Schema } from '../../../../../_common/interfaces/Schema';

type ComboBoxOption = {
    label: string;
    value: string;
};

const loggerName = 'logger name';
const activityName = 'activity name';

export default class Playground extends LightningElement {
    @track
    schemaOptions: ComboBoxOption[];

    @track
    names: string;

    @track
    selectedSchema: string;

    currentSchema: Schema;
    data: Data;

    constructor() {
        super();
        this.schemaOptions = Array.from(schemas.keys())
            .filter((name) => !schemaUtil.isInternal(name))
            .map((name) => ({
                label: name,
                value: name
            }));
    }

    handleSchemaChange(event: CustomEvent) {
        this.selectedSchema = event.detail.value;
        this.currentSchema = schemas.get(this.selectedSchema);
    }

    handleDataChange(event: CustomEvent<EventDetail<Data>>) {
        const cs = this.currentSchema;
        const schemaName = schemaUtil.getSchemaName(cs);
        const importName = schemaUtil.getImportName(cs);

        this.data = event.detail.value;
        const json = JSON.stringify(this.data, undefined, 4);
        const jsCode = `
import { getInstrumentation } from 'o11y';

import { ${schemaName} } from '${importName}';

const instr = getInstrumentation('${loggerName}');

const data = ${json};
instr.log(${schemaName}, data);

// Alternatively, use instr.activity() or instr.activityAsync()
const activity = instr.startActivity('${activityName}');
try {
    // your code here
} finally {
    activity.stop(${schemaName}, data);
}
`;

        const div = this.template.querySelector('.hljs') as HTMLDivElement;
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.appendChild(code);
        // skip the first new line
        code.innerHTML = this._escape(jsCode.substring(1));
        div.replaceChildren(pre);

        // @ts-ignore
        globalThis.hljs?.highlightElement(code);
    }

    _escape(htmlStr: string): string {
        return htmlStr
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    handleLog() {
        const instr = getInstrumentation(loggerName);
        try {
            instr.log(this.currentSchema, this.data);
        } catch (ex) {
            instr.error(ex, 'Check value types.');
        }
    }

    handleActivity() {
        const instr = getInstrumentation(loggerName);
        const act = instr.startActivity(activityName);
        try {
            act.stop(this.currentSchema, this.data);
        } catch (ex) {
            instr.error(ex, 'Check value types.');
        }
    }
}
