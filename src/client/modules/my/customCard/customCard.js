import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class CustomCard extends LightningElement {
    keyValues;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility.getFilteredKeyValues();
        const msgItems = value && utility.getKeyValues(value.msg);
        this.keyValues = [...topItems, ...msgItems];
    }
}