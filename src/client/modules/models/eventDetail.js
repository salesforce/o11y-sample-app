export class EventDetail {
    get sender() {
        return this._sender;
    }

    get value() {
        return this._value;
    }

    constructor(sender, value) {
        this._sender = sender;
        this._value = value;
    }
}