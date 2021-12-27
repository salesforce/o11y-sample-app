import { LightningElement, api, track } from 'lwc';
import { KeyValue } from '../../../interfaces/keyValue';
import { utility } from '../../../utility';
import { CardModel } from '../../models/cardModel';
import { SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';

export default class InstrumentedEventCard extends LightningElement {
    @track isExpanded: boolean;
    @track keyValues: KeyValue[];
    @track userPayload: SchematizedPayload;
    @track eventKeyValues: KeyValue[];

    private _model: CardModel;
    @api
    get model(): CardModel {
        return this._model;
    }
    set model(value: CardModel) {
        this._model = value;
        const topItems: KeyValue[] = utility.getFilteredKeyValues();
        const msgItems: KeyValue[] = value && utility.getKeyValues(value.msg).filter(obj => obj.key !== 'userPayload' && obj.key !== 'event');
        this.keyValues = [...topItems, ...msgItems];

        this.userPayload = value && value.msg && value.msg.userPayload;
        this.eventKeyValues = value && value.msg && utility.getKeyValues(value.msg.event);
    }

    handleToggle(): void {
        this.isExpanded = !this.isExpanded;
    }
}