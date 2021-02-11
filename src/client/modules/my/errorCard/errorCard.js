import { LightningElement, api } from 'lwc';

export default class ErrorCard extends LightningElement {
    callstack;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        this.callstack = value && value.msg && value.msg.stack && value.msg.stack.replace(/\n/g, '<br>');
    }
}