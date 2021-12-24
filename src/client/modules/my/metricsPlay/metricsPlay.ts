import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { ComponentUtils } from '../../shared/componentUtils';

export default class MetricsPlay extends LightningElement {

    private readonly _instr: Instrumentation;
    @track counterName = 'Counter name';
    @track increment = 1;
    @track hasErrorForCounter = false;
    @track isCounterTagsDisabled = true;
    @track stringTagForCounter = 'A Counter Tag';
    @track booleanTagForCounter = true;
    @track numberTagForCounter = 123;

    @track valueRecorderName = 'Value Recorder name';
    @track value = 0;
    @track hasErrorForValueRecorder = false;
    @track isValueRecorderTagsDisabled = true;
    @track stringTagForValueRecorder = 'A Value Recorder Tag';
    @track booleanTagForValueRecorder = true;
    @track numberTagForValueRecorder = 789;

    constructor() {
        super();
        this._instr = getInstrumentation('MetricsPlay');
    }

    handleCounterNameChange(event: CustomEvent): void {
        this.counterName = event.detail.value;
    }
    handleIncrementChange(event: CustomEvent): void {
        this.increment = Number(event.detail.value);
    }
    handleHasErrorForCounterChange(event: CustomEvent): void {
        this.hasErrorForCounter = Boolean(event.detail.checked);
    }
    handleUseTagsForCounterChange(event: CustomEvent): void {
        this.isCounterTagsDisabled = !event.detail.checked;
    }
    handleStringTagForCounterChange(event: CustomEvent): void {
        this.stringTagForCounter = event.detail.value;
    }
    handleBooleanTagForCounterChange(event: CustomEvent): void {
        this.booleanTagForCounter = Boolean(event.detail.checked);
    }
    handleNumberTagForCounterChange(event: CustomEvent): void {
        this.numberTagForCounter = Number(event.detail.value);
    }

    handleValueRecorderNameChange(event: CustomEvent): void {
        this.valueRecorderName = event.detail.value;
    }
    handleValueChange(event: CustomEvent): void {
        this.value = Number(event.detail.value);
    }
    handleHasErrorForValueRecorderChange(event: CustomEvent): void {
        this.hasErrorForValueRecorder = Boolean(event.detail.checked);
    }
    handleUseTagsForValueRecorderChange(event: CustomEvent): void {
        this.isValueRecorderTagsDisabled = !event.detail.checked;
    }
    handleStringTagForValueRecorderChange(event: CustomEvent): void {
        this.stringTagForValueRecorder = event.detail.value;
    }
    handleBooleanTagForValueRecorderChange(event: CustomEvent): void {
        this.booleanTagForValueRecorder = Boolean(event.detail.checked);
    }
    handleNumberTagForValueRecorderChange(event: CustomEvent): void {
        this.numberTagForValueRecorder = Number(event.detail.value);
    }

    handleIncrementCounter(): void {
        this._instr.incrementCounter(
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

    handleTrackValue(): void {
        this._instr.trackValue(
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

    handleForceCollect(): void {
        ComponentUtils.raiseEvent(this, 'forcecollect');
    }
}
