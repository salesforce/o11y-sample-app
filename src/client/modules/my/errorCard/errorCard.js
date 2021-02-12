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
        const topItems = utility.getKeyValues(value).filter(obj => obj.key !== 'msg' && !obj.key.startsWith('_'));
        const msgItems = utility.getKeyValues(value.msg).filter(obj => obj.key !== 'stack');
        this.keyValues = [...topItems, ...msgItems];

        this.callstack = value && value.msg && value.msg.stack && value.msg.stack.replace(/\n/g, '<br>');
    }
}