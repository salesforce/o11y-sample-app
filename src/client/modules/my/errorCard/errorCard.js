import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class ErrorCard extends LightningElement {
    callstack;
    keyValues;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility.getFilteredKeyValues();
        const msgItems = value && utility.getKeyValues(value.msg).filter(obj => obj.key !== 'stack');
        this.keyValues = [...topItems, ...msgItems];

        this.callstack = value && value.msg && value.msg.stack && value.msg.stack.replace(/\n/g, '<br>');
    }
}