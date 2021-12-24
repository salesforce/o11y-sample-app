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
const componentUtils_1 = require("../../shared/componentUtils");
class MetricsPlay extends lwc_1.LightningElement {
    constructor() {
        super();
        this.counterName = 'Counter name';
        this.increment = 1;
        this.hasErrorForCounter = false;
        this.isCounterTagsDisabled = true;
        this.stringTagForCounter = 'A Counter Tag';
        this.booleanTagForCounter = true;
        this.numberTagForCounter = 123;
        this.valueRecorderName = 'Value Recorder name';
        this.value = 0;
        this.hasErrorForValueRecorder = false;
        this.isValueRecorderTagsDisabled = true;
        this.stringTagForValueRecorder = 'A Value Recorder Tag';
        this.booleanTagForValueRecorder = true;
        this.numberTagForValueRecorder = 789;
        this._instr = (0, client_1.getInstrumentation)('MetricsPlay');
    }
    handleCounterNameChange(event) {
        this.counterName = event.detail.value;
    }
    handleIncrementChange(event) {
        this.increment = Number(event.detail.value);
    }
    handleHasErrorForCounterChange(event) {
        this.hasErrorForCounter = Boolean(event.detail.checked);
    }
    handleUseTagsForCounterChange(event) {
        this.isCounterTagsDisabled = !event.detail.checked;
    }
    handleStringTagForCounterChange(event) {
        this.stringTagForCounter = event.detail.value;
    }
    handleBooleanTagForCounterChange(event) {
        this.booleanTagForCounter = Boolean(event.detail.checked);
    }
    handleNumberTagForCounterChange(event) {
        this.numberTagForCounter = Number(event.detail.value);
    }
    handleValueRecorderNameChange(event) {
        this.valueRecorderName = event.detail.value;
    }
    handleValueChange(event) {
        this.value = Number(event.detail.value);
    }
    handleHasErrorForValueRecorderChange(event) {
        this.hasErrorForValueRecorder = Boolean(event.detail.checked);
    }
    handleUseTagsForValueRecorderChange(event) {
        this.isValueRecorderTagsDisabled = !event.detail.checked;
    }
    handleStringTagForValueRecorderChange(event) {
        this.stringTagForValueRecorder = event.detail.value;
    }
    handleBooleanTagForValueRecorderChange(event) {
        this.booleanTagForValueRecorder = Boolean(event.detail.checked);
    }
    handleNumberTagForValueRecorderChange(event) {
        this.numberTagForValueRecorder = Number(event.detail.value);
    }
    handleIncrementCounter() {
        this._instr.incrementCounter(this.counterName, this.increment, this.hasErrorForCounter, this.isCounterTagsDisabled ? undefined : {
            stringTag: this.stringTagForCounter,
            booleanTag: this.booleanTagForCounter,
            numberTag: this.numberTagForCounter
        });
    }
    handleTrackValue() {
        this._instr.trackValue(this.valueRecorderName, this.value, this.hasErrorForValueRecorder, this.isValueRecorderTagsDisabled ? undefined : {
            stringTag: this.stringTagForValueRecorder,
            booleanTag: this.booleanTagForValueRecorder,
            numberTag: this.numberTagForValueRecorder
        });
    }
    handleForceCollect() {
        componentUtils_1.ComponentUtils.raiseEvent(this, 'forcecollect');
    }
}
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "counterName", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "increment", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "hasErrorForCounter", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "isCounterTagsDisabled", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "stringTagForCounter", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "booleanTagForCounter", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "numberTagForCounter", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "valueRecorderName", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "value", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "hasErrorForValueRecorder", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "isValueRecorderTagsDisabled", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "stringTagForValueRecorder", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "booleanTagForValueRecorder", void 0);
__decorate([
    lwc_1.track
], MetricsPlay.prototype, "numberTagForValueRecorder", void 0);
exports.default = MetricsPlay;
