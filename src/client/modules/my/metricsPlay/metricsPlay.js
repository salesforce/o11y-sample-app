import { LightningElement } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { ComponentUtils } from '../../shared/componentUtils';

export default class MetricsPlay extends LightningElement {

    counterName = 'Counter name';
    increment = 1;
    hasErrorForCounter = false;
    isCounterTagsDisabled = true;
    stringTagForCounter = 'A Counter Tag';
    booleanTagForCounter = true;
    numberTagForCounter = 123;

    valueRecorderName = 'Value Recorder name';
    value = 0;
    hasErrorForValueRecorder = false;
    isValueRecorderTagsDisabled = true;
    stringTagForValueRecorder = 'A Value Recorder Tag';
    booleanTagForValueRecorder = true;
    numberTagForValueRecorder = 789;

    constructor() {
        super();
        this.instr = getInstrumentation('MetricsPlay');
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
        this.instr.incrementCounter(
            this.counterName,
            this.increment,
            this.hasErrorForCounter,
            this.isCounterTagsDisabled ? undefined : {
                stringTag: this.stringTagForCounter,
                booleanTag: this.booleanTagForCounter,
                numberTag: this.numberTagForCounter
            }
        );
    }

    handleTrackValue() {
        this.instr.trackValue(
            this.valueRecorderName,
            this.value,
            this.hasErrorForValueRecorder,
            this.isValueRecorderTagsDisabled ? undefined : {
                stringTag: this.stringTagForValueRecorder,
                booleanTag: this.booleanTagForValueRecorder,
                numberTag: this.numberTagForValueRecorder
            }
        );
    }

    handleForceCollect() {
        ComponentUtils.raiseEvent(this, 'forcecollect');
    }
}
