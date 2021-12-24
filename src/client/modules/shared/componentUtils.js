"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentUtils = void 0;
const eventDetail_1 = require("../models/eventDetail");
class ComponentUtils {
    static raiseEvent(component, eventName, value, originalComponent) {
        // console.debug('Event raised (by, type, detail)', component, eventName, detail);
        const ce = new CustomEvent(eventName, { detail: new eventDetail_1.EventDetail(originalComponent || component, value) });
        component.dispatchEvent(ce);
    }
    static relayEvent(component, event) {
        if (event.detail instanceof eventDetail_1.EventDetail) {
            this.raiseEvent(component, event.type, event.detail.value, event.detail.sender);
        }
        else {
            this.raiseEvent(component, event.type, event.detail);
        }
    }
}
exports.ComponentUtils = ComponentUtils;
