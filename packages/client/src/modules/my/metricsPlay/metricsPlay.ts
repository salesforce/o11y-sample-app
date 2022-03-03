import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { ComponentUtils } from '../../shared/componentUtils';

export default class MetricsPlay extends LightningElement {
    private readonly _instr: Instrumentation;
    @track counterName = 'My up counter';
    @track increment = 1;
    @track hasErrorForCounter = false;
    @track isCounterTagsDisabled = true;
    @track stringTagForCounter = 'A Counter Tag';
    @track booleanTagForCounter = true;
    @track numberTagForCounter = 123;

    @track valueRecorderName = 'My value recorder';
    @track vrValue = 0;
    @track hasErrorForValueRecorder = false;
    @track isValueRecorderTagsDisabled = true;
    @track stringTagForValueRecorder = 'A Value Recorder Tag';
    @track booleanTagForValueRecorder = true;
    @track numberTagForValueRecorder = 123;

    @track bucketHistogramName = 'My bucket histogram';
    @track bhValue = 0;
    @track bucketsCsv: string = undefined;
    @track hasErrorForBucketHistogram = false;
    @track isBucketHistogramTagsDisabled = true;
    @track stringTagForBucketHistogram = 'A Bucket Histogram Tag';
    @track booleanTagForBucketHistogram = true;
    @track numberTagForBucketHistogram = 123;

    constructor() {
        super();
        this._instr = getInstrumentation('MetricsPlay');
    }

    // Counter handlers
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

    // Value Recorder handlers
    handleValueRecorderNameChange(event: CustomEvent): void {
        this.valueRecorderName = event.detail.value;
    }
    handleVrValueChange(event: CustomEvent): void {
        this.vrValue = Number(event.detail.value);
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

    // Bucket Histogram handlers
    handleBucketHistogramNameChange(event: CustomEvent): void {
        this.bucketHistogramName = event.detail.value;
    }
    handleBhValueChange(event: CustomEvent): void {
        this.bhValue = Number(event.detail.value);
    }
    handleHasErrorForBucketHistogramChange(event: CustomEvent): void {
        this.hasErrorForBucketHistogram = Boolean(event.detail.checked);
    }
    handleUseTagsForBucketHistogramChange(event: CustomEvent): void {
        this.isBucketHistogramTagsDisabled = !event.detail.checked;
    }
    handleStringTagForBucketHistogramChange(event: CustomEvent): void {
        this.stringTagForBucketHistogram = event.detail.value;
    }
    handleBooleanTagForBucketHistogramChange(event: CustomEvent): void {
        this.booleanTagForBucketHistogram = Boolean(event.detail.checked);
    }
    handleNumberTagForBucketHistogramChange(event: CustomEvent): void {
        this.numberTagForBucketHistogram = Number(event.detail.value);
    }
    handleBucketsCsvChange(event: CustomEvent): void {
        this.bucketsCsv = event.detail.value;
    }

    handleIncrementCounter(): void {
        this._instr.incrementCounter(
            this.counterName,
            this.increment,
            this.hasErrorForCounter,
            this.isCounterTagsDisabled
                ? undefined
                : {
                      stringTag: this.stringTagForCounter,
                      booleanTag: this.booleanTagForCounter,
                      numberTag: this.numberTagForCounter
                  }
        );
        this.notifyMetricAdded();
    }

    handleTrackValue(): void {
        this._instr.trackValue(
            this.valueRecorderName,
            this.vrValue,
            this.hasErrorForValueRecorder,
            this.isValueRecorderTagsDisabled
                ? undefined
                : {
                      stringTag: this.stringTagForValueRecorder,
                      booleanTag: this.booleanTagForValueRecorder,
                      numberTag: this.numberTagForValueRecorder
                  }
        );
        this.notifyMetricAdded();
    }

    handleBucketValue(): void {
        const buckets: number[] = this.bucketsCsv
            ? this.bucketsCsv
                  .split(',')
                  .map((t: string) => Number.parseFloat(t))
                  .filter((n: number) => !Number.isNaN(n))
            : undefined;
        this._instr.bucketValue(
            this.bucketHistogramName,
            this.bhValue,
            buckets,
            this.hasErrorForBucketHistogram,
            this.isBucketHistogramTagsDisabled
                ? undefined
                : {
                      stringTag: this.stringTagForBucketHistogram,
                      booleanTag: this.booleanTagForBucketHistogram,
                      numberTag: this.numberTagForBucketHistogram
                  }
        );
        this.notifyMetricAdded();
    }

    notifyMetricAdded(): void {
        ComponentUtils.raiseEvent(this, 'metricadd');
    }
}
