import { LightningElement, api } from 'lwc';
import { ComponentUtils } from '../../shared/componentUtils';

export default class ExpanderButton extends LightningElement {
    @api
    isOpen = false;

    handleToggle(customEvent: CustomEvent) {
        ComponentUtils.relayEvent(this, customEvent);
    }
}
