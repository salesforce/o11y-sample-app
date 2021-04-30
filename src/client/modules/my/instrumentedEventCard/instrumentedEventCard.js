import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class InstrumentedEventCard extends LightningElement {
    isExpanded;
    keyValues;
    userPayload;
    eventKeyValues;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility.getFilteredKeyValues();
        const msgItems = value && utility.getKeyValues(value.msg).filter(obj => obj.key !== 'userPayload' && obj.key !== 'event');
        this.keyValues = [...topItems, ...msgItems];

        this.userPayload = value && value.msg && value.msg.userPayload;
        this.eventKeyValues = value && value.msg && utility.getKeyValues(value.msg.event);
    }

    handleToggle() {
        this.isExpanded = !this.isExpanded;
    }
}