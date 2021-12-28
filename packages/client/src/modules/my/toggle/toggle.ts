import { LightningElement, api } from 'lwc';
import { ComponentUtils } from '../../shared/componentUtils';

export default class Toggle extends LightningElement {
    @api
    value = false;

    handleOff() {
        ComponentUtils.raiseEvent(this, 'toggle', false);
    }

    handleOn() {
        ComponentUtils.raiseEvent(this, 'toggle', true);
    }
}
