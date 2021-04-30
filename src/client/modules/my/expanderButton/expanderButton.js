import { LightningElement, api } from 'lwc';
import { ComponentUtils } from '../../shared/componentUtils';

export default class ExpanderButton extends LightningElement {
    @api
    isOpen = false;

    handleToggle(customEvent) {
        ComponentUtils.relayEvent(this, customEvent);
    }
}
