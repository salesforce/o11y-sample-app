import { LightningElement, track } from 'lwc';
import { schemas } from '../../../../../_common/generated/schema';
import { getType } from '../../../../../_common/src/protoUtil';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';
import type { Data } from '../schemaInput/schemaInput';
import { EventDetail } from '../../models/eventDetail';

type ComboBoxOption = {
    label: string;
    value: string;
};

export default class Utility extends LightningElement {
    @track
    schemaOptions: ComboBoxOption[];

    @track
    names: string;

    @track
    selectedSchema: string;

    constructor() {
        super();
        this.schemaOptions = Array.from(schemas.keys())
            .filter((name) => !schemaUtil.isInternal(name))
            .map((name) => ({
                label: name,
                value: name
            }));

        // @ts-ignore
        window.type = getType('sf.o11ySample.UserPayload');
    }

    handleSchemaChange(event: CustomEvent) {
        this.selectedSchema = event.detail.value;
    }

    handleDataChange(event: CustomEvent<EventDetail<Data>>) {
        const json = JSON.stringify(event.detail.value, undefined, 4);
        const schema = schemas.get(this.selectedSchema);
        const schemaName = `${schema.name[0].toLowerCase()}${schema.name.substring(1)}Schema`;
        const moduleName = schema.namespace.replace(/\./g, '_');

        const jsCode = `
import { getInstrumentation } from 'o11y';

import { ${schemaName} } from 'o11y_schema/${moduleName}';

const instr = getInstrumentation('logger name');

const data = ${json};
instr.log(${schemaName}, data);

// Alternatively, use instr.activity() or instr.activityAsync()
const activity = instr.startActivity('activity name');
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
}
