import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';

import { schemas } from '../../../../../_common/generated/schema';
import { Schema } from '../../../../../_common/interfaces/Schema';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';
import { EventDetail } from '../../models/eventDetail';
import { setCode } from '../../shared/htmlUtils';
import type { Data } from '../schemaInput/schemaInput';
import type { ComboBoxOption } from '../../types/ComboBoxOption';

const loggerName = 'logger name';
const activityName = 'activity name';

const initialSchemaId = 'sf.instrumentation.Simple';

export default class Playground extends LightningElement {
    private _hasRendered = false;

    @track
    schemaOptions: ComboBoxOption[];

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

    renderedCallback(): void {
        if (!this._hasRendered) {
            this._hasRendered = true;
            const initialSchema = this.schemaOptions.find(
                (option) => option.value === initialSchemaId
            );
            this._selectSchema(initialSchema.value);
        }
    }

    handleSchemaChange(event: CustomEvent) {
        this._selectSchema(event.detail.value);
    }

    private _selectSchema(id: string) {
        this.selectedSchema = id;
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
} catch (ex) {
    activity.error(ex);
} finally {
    activity.stop(${schemaName}, data);
}
`.substring(1); // skip the first new line

        setCode(this.template.querySelector('.hljs') as HTMLDivElement, jsCode);
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
