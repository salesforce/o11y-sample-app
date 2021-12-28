import { LightningElement } from 'lwc';

export class EventDetail<T> {
    private readonly _sender: LightningElement;
    get sender(): LightningElement {
        return this._sender;
    }

    private readonly _value: T;
    get value(): T {
        return this._value;
    }

    constructor(sender: LightningElement, value: T) {
        this._sender = sender;
        this._value = value;
    }
}
