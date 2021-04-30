import { EventDetail } from '../models/eventDetail';

export class ComponentUtils {
    static raiseEvent(component, eventName, value, originalComponent) {
        // console.debug('Event raised (by, type, detail)', component, eventName, detail);
        const ce = new CustomEvent(eventName, { detail: new EventDetail(originalComponent || component, value) });
        component.dispatchEvent(ce);
    }

    static relayEvent(component, event) {
        if (event.detail instanceof EventDetail) {
            this.raiseEvent(component, event.type, event.detail.value, event.detail.sender);
        } else {
            this.raiseEvent(component, event.type, event.detail);
        }
    }
}
