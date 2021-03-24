import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class VisualCollector extends LightningElement {
    keyValues;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        this.keyValues = utility.getKeyValues(value && value.pagePayload);
    }
}
