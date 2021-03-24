import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class InstrumentedEventCard extends LightningElement {
    keyValues;
    userSchemaName;
    userPayload;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility.getKeyValues(value).filter(obj => obj.key !== 'msg' && obj.key !== 'pagePayload' && !obj.key.startsWith('_'));
        const msgItems = value && utility.getKeyValues(value.msg).filter(obj => obj.key !== 'userPayload');
        this.keyValues = [...topItems, ...msgItems];

        if (value && value.msg.userPayload) {
            this.userSchemaName = value.msg.userPayload.schemaName;
            this.userPayload = utility.getKeyValues(value.msg.userPayload.payload);
        }
    }
}