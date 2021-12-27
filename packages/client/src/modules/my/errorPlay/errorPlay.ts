import { LightningElement } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';

export default class ErrorPlay extends LightningElement {
    private readonly _instr: Instrumentation;

    constructor() {
        super();
        this._instr = getInstrumentation('Error Example');
    }

    handleButton1Click(): void {
        try {
            const emptyObject = {};
            (emptyObject as any).nonExistentFunction();
        } catch (ex) {
            this._instr.error(ex as Error);
        }
    }

    handleButton2Click(): void {
        try {
            throw new Error('This is an Error instance');
        } catch (ex) {
            this._instr.error(ex as Error);
        }
    }

    handleButton3Click(): void {
        try {
            throw 'This is a string-based exception';
        } catch (ex) {
            this._instr.error(ex as string);
        }
    }
}
