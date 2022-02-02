import { LightningElement, api, track } from 'lwc';
import { KeyValue } from '../../../interfaces/keyValue';
import { utility } from '../../../utility';
import { CardModel } from '../../models/cardModel';
import type { SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';

export default class ErrorCard extends LightningElement {
    @track callstack: string;
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
            value &&
            utility
                .getKeyValues(value.msg)
                .filter((obj) => obj.key !== 'userPayload' && obj.key !== 'stack');
        this.keyValues = [...topItems, ...msgItems];
        this.userPayload = value?.msg?.userPayload;

        // TODO: Why is this not being used?
        this.callstack =
            value && value.msg && value.msg.stack && value.msg.stack.replace(/\n/g, '<br>');
    }
}
