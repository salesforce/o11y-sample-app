import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class PayloadCard extends LightningElement {
    schemaName;
    payload;

    @api
    header;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        if (!value) {
            this.schemaName = undefined;
            this.payload = undefined;
        } else {
            this.schemaName = value.schema ? `${value.schema.namespace}.${value.schema.name}` : undefined;
            this.payload = utility.getKeyValues(value.payload);
        }
    }
}
