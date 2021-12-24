"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
const client_1 = require("o11y/client");
class ErrorPlay extends lwc_1.LightningElement {
    constructor() {
        super();
        this._instr = (0, client_1.getInstrumentation)('Error Example');
    }
    handleButton1Click() {
        try {
            const emptyObject = {};
            emptyObject.nonExistentFunction();
        }
        catch (ex) {
            this._instr.error(ex);
        }
    }
    handleButton2Click() {
        try {
            throw new Error('This is an Error instance');
        }
        catch (ex) {
            this._instr.error(ex);
        }
    }
    handleButton3Click() {
        try {
            throw 'This is a string-based exception';
        }
        catch (ex) {
            this._instr.error(ex);
        }
    }
}
exports.default = ErrorPlay;
