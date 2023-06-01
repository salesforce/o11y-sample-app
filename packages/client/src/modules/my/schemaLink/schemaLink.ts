import { api, LightningElement, track } from 'lwc';
import { schemas } from '../../../../../_common/generated/schema';
import { Schema } from '../../../../../_common/interfaces/Schema';

const schemaSourceRoot =
    'https://git.soma.salesforce.com/instrumentation/o11y-schema/tree/master/ui-telemetry-schema/src/main/proto/';

export default class SchemaLink extends LightningElement {
    private _schema: string;
    @api
    get schema(): string {
        return this._schema;
    }
    set schema(value) {
        if (this._schema !== value) {
            this._schema = value;
            this._updateSelectedSchemaUrl();
        }
    }

    @track
    selectedSchemaUrl: string;

    private _updateSelectedSchemaUrl() {
        if (this._schema) {
            const cs: Schema = schemas.get(this._schema);
            const path = cs.namespace.replace('.', '/');
            const file = cs.name
                .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
                .substring(1);

            this.selectedSchemaUrl = `${schemaSourceRoot}/${path}/${file}.proto`;
        } else {
            this.selectedSchemaUrl = undefined;
        }
    }
}
