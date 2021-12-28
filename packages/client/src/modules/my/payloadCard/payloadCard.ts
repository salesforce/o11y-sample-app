import { LightningElement, api, track } from 'lwc';
import { SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';
import { KeyValue } from '../../../interfaces/keyValue';
import { utility } from '../../../utility';
import { CardModel } from '../../models/cardModel';

export default class PayloadCard extends LightningElement {
    @track schemaName: string;
    @track payload: KeyValue[];

    @api
    header: string;

    private _model: SchematizedPayload;
    @api
    get model(): SchematizedPayload {
        return this._model;
    }
    set model(value: SchematizedPayload) {
        this._model = value;
        if (!value) {
            this.schemaName = undefined;
            this.payload = undefined;
        } else {
            this.schemaName = value.schema
                ? `${value.schema.namespace}.${value.schema.name}`
                : undefined;
            this.payload = utility.getKeyValues(value.payload);
        }
    }
}
