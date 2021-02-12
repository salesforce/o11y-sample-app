import { LightningElement, api } from 'lwc';
import { utility } from '../../../utility';

export default class InstrumentedEventCard extends LightningElement {
    keyValues;
    userSchemaName;
    userPayload;
    pageSchemaName;
    pagePayload;

    _model;
    @api
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility.getKeyValues(value).filter(obj => obj.key !== 'msg' && !obj.key.startsWith('_'));
        const msgItems = value && utility.getKeyValues(value.msg).filter(obj => obj.key !== 'userPayload' && obj.key !== 'pagePayload');
        this.keyValues = [...topItems, ...msgItems];

        if (value) {
            if (value.msg.userPayload) {
                this.userSchemaName = value.msg.userPayload.schemaName;
                this.userPayload = utility.getKeyValues(value.msg.userPayload.payload);
            }
            if (value.msg.pagePayload) {
                this.pageSchemaName = value.msg.pagePayload.schemaName;
                this.pagePayload = utility.getKeyValues(value.msg.pagePayload.payload);
            }
        }
    }
}