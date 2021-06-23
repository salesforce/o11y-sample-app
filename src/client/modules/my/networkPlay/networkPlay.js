import { LightningElement, api } from 'lwc';
import { ComponentUtils } from '../../shared/componentUtils';

export default class NetworkPlay extends LightningElement {
    @api
    isEnabled;

    handleToggleClick() {
        ComponentUtils.raiseEvent(this, 'toggle', !this.isEnabled);
    }
}