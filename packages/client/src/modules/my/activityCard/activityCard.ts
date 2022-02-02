import { LightningElement, api, track } from 'lwc';
import { KeyValue } from '../../../interfaces/keyValue';
import { utility } from '../../../utility';
import { CardModel } from '../../models/cardModel';
import type { SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';

export default class ActivityCard extends LightningElement {
    @track keyValues: KeyValue[];
    @track userPayload: SchematizedPayload;

    private _model: CardModel;
    @api
    get model(): CardModel {
        return this._model;
    }
    set model(value: CardModel) {
        this._model = value;
        const topItems: KeyValue[] = utility.getFilteredKeyValues();
        const msgItems: KeyValue[] =
            value && utility.getKeyValues(value.msg).filter((obj) => obj.key !== 'userPayload');
        this.keyValues = [...topItems, ...msgItems];
        this.userPayload = value?.msg?.userPayload;
    }
}
