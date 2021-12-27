import { LightningElement, api, track } from 'lwc';
import { KeyValue } from '../../../interfaces/keyValue';
import { utility } from '../../../utility';
import { CardModel } from '../../models/cardModel';

export default class ErrorCard extends LightningElement {
    @track callstack: string;
    @track keyValues: KeyValue[];

    private _model: CardModel;
    @api
    get model(): CardModel {
        return this._model;
    }
    set model(value: CardModel) {
        this._model = value;
        const topItems: KeyValue[] = utility.getFilteredKeyValues();
        const msgItems: KeyValue[] = value && utility.getKeyValues(value.msg).filter(obj => obj.key !== 'stack');
        this.keyValues = [...topItems, ...msgItems];

        // TODO: Why is this not being used?
        this.callstack = value && value.msg && value.msg.stack && value.msg.stack.replace(/\n/g, '<br>');
    }
}