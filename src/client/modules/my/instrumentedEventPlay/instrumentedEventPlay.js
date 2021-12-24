"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
const client_1 = require("o11y/client");
const sf_o11ySample_1 = require("o11y_schema/sf_o11ySample");
class InstrumentedEventPlay extends lwc_1.LightningElement {
    constructor() {
        super();
        this._instr = (0, client_1.getInstrumentation)('InstrumentedEvent Play');
    }
    updateDivColor(div, colorValue) {
        const hexColorString = `#${colorValue.toString(16).padStart(6, '0')}`;
        if (div.style.backgroundColor !== hexColorString) {
            div.style.backgroundColor = hexColorString;
        }
    }
    notifyAct(text) {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, the click will be logged once execution resumes.`);
    }
    notifyNoAct(text) {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, it will ignore the event which the handler will log explicitly.`);
    }
    handleAnchorClick(event) {
        this.notifyAct('anchor');
        event.preventDefault();
    }
    handleAnchorLogClick(event) {
        this.notifyNoAct('anchor');
        event.preventDefault();
        this.logEvent(event);
    }
    handleInputClick() {
        this.notifyAct('input');
    }
    handleInputLogClick(event) {
        this.notifyNoAct('input');
        this.logEvent(event);
    }
    handleButtonClick() {
        this.notifyAct('button');
    }
    handleButtonLogClick(event) {
        this.notifyNoAct('button');
        this.logEvent(event);
    }
    handleLwcButtonClick() {
        this.notifyAct('lightning-button');
    }
    handleLwcButtonLogClick(event) {
        this.notifyNoAct('lightning-button');
        this.logEvent(event);
    }
    handleDivClick(event) {
        this.updateDivColor(event.target, this.newColor());
    }
    handleDivLogClick(event) {
        this.updateDivColor(event.target, this.newColor());
        this.logEvent(event);
    }
    handleToggleActClick() {
        this.dispatchEvent(new CustomEvent('toggleact'));
    }
    newColor() {
        return Math.floor(Math.random() * 0x1000000);
    }
    logEvent(event) {
        const actualColor = window.getComputedStyle(event.target).backgroundColor;
        // Convert actualColor text, which comes back in the form of "rgb(x, y, z)" or "rgba(x, y, z, a)", into an actual value.
        const colorValue = actualColor.substring(actualColor.indexOf('(') + 1, actualColor.indexOf(')'))
            .split(', ')
            .slice(0, 3)
            .map(s => parseInt(s))
            .reduce((a, b) => a * 256 + b);
        this._instr.domEvent(event, this, sf_o11ySample_1.userPayloadSchema, {
            string: actualColor,
            uint32: colorValue
        });
    }
}
__decorate([
    lwc_1.api
], InstrumentedEventPlay.prototype, "isActActive", void 0);
exports.default = InstrumentedEventPlay;
