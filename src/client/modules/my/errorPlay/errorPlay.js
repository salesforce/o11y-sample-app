import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';

export default class ErrorPlay extends LightningElement {
    @api
    model;

    instr;

    constructor() {
        super();
        this.instr = getInstrumentation('Error Example');
    }

    handleButton1Click() {
        try {
            const emptyObject = {};
            emptyObject.nonExistentFunction();
        } catch (ex) {
            this.instr.error(ex);
        }
    }

    handleButton2Click() {
        try {
            throw new Error('This is an Error instance');
        } catch (ex) {
            this.instr.error(ex);
        }
    }

    handleButton3Click() {
        try {
            throw 'This is a string-based exception';
        } catch (ex) {
            this.instr.error(ex);
        }
    }
}
