"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDetail = void 0;
class EventDetail {
    constructor(sender, value) {
        this._sender = sender;
        this._value = value;
    }
    get sender() {
        return this._sender;
    }
    get value() {
        return this._value;
    }
}
exports.EventDetail = EventDetail;
