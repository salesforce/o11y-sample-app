import { LightningElement, api, track } from 'lwc';
import { utility } from '../../../utility';
import { KeyValue } from '../../../interfaces/keyValue';
import { CardModel } from '../../models/cardModel';

export default class UnknownCard extends LightningElement {
    @track keyValues: KeyValue[];

    private _model: CardModel;
    @api
    get model(): CardModel {
        return this._model;
    }
    set model(value: CardModel) {
        this._model = value;
        const topItems: KeyValue[] = utility.getFilteredKeyValues();
        const msgItems: KeyValue[] = value && utility.getKeyValues(value.msg);
        this.keyValues = [...topItems, ...msgItems];
    }
}
