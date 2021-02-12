import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class InstrumentedEventCard extends LightningElement {
    keyValues;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility.getKeyValues(value).filter(obj => obj.key !== 'msg' && !obj.key.startsWith('_'));
        const msgItems = value && utility.getKeyValues(value.msg);
        this.keyValues = [...topItems, ...msgItems];
    }
}