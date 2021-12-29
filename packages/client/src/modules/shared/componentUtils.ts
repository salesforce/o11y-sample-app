import { LightningElement } from 'lwc';
import { EventDetail } from '../models/eventDetail';

export class ComponentUtils {
    static raiseEvent(
        component: LightningElement,
        eventName: string,
        value?: unknown,
        originalComponent?: LightningElement
    ) {
        // console.debug('Event raised (by, type, detail)', component, eventName, detail);
        const ce = new CustomEvent(eventName, {
            detail: new EventDetail(originalComponent || component, value)
        });
        component.dispatchEvent(ce);
    }

    static relayEvent(component: LightningElement, event: CustomEvent) {
        if (event.detail instanceof EventDetail) {
            this.raiseEvent(component, event.type, event.detail.value, event.detail.sender);
        } else {
            this.raiseEvent(component, event.type, event.detail);
        }
    }
}
