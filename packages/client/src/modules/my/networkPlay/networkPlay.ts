import { LightningElement, api, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { UiOptions } from '../../../interfaces/uiOptions';
import { isoDateEndpoint } from '../../shared/apiEndpoints';
import { ComponentUtils } from '../../shared/componentUtils';

export default class NetworkPlay extends LightningElement {
    @track lastResponse: string;
    @track testUrl: string;

    private readonly _instr: Instrumentation;

    constructor() {
        super();
        this.lastResponse = undefined;
        this.testUrl = isoDateEndpoint;
        this._instr = getInstrumentation('Network Instrumentation');
    }

    @api
    isEnabled: boolean;
    handleToggleClick(): void {
        const options: UiOptions = this.getCurrentOptions();
        options.isEnabled = !this.isEnabled;
        this.notifyOptions(options);
    }

    @api
    useNetworkOptions: boolean;
    handleUseNetworkOptionsChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.useNetworkOptions = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    activityName: string;
    @api
    isActivityNameDisabled: boolean;
    handleActivityNameChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.activityName = event.detail.value;
        this.notifyOptions(options);
    }

    @api
    logErrors: boolean;
    @api
    isLogErrorsDisabled: boolean;
    handleLogErrorsChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.logErrors = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    useTracing: boolean;
    @api
    isUseTracingDisabled: boolean;
    handleUseTracingChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.useTracing = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    sampleRate: number;
    @api
    isSampleRateDisabled: boolean;
    handleSampleRateChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.sampleRate = event.detail.value;
        this.notifyOptions(options);
    }

    @api
    useTracingOptions: boolean;
    @api
    isUseTracingOptionsDisabled: boolean;
    handleUseTracingOptionsChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.useTracingOptions = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    traceIdEffectiveLength: number;
    @api
    isTraceIdEffectiveLengthDisabled: boolean;
    handleTraceIdEffectiveLengthChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.traceIdEffectiveLength = event.detail.value;
        this.notifyOptions(options);
    }

    @api
    useB3Headers: boolean;
    @api
    isUseB3HeadersDisabled: boolean;
    handleUseB3HeadersChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.useB3Headers = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    useCompactHeader: boolean;
    @api
    isUseCompactHeaderDisabled: boolean;
    handleUseCompactHeaderChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.useCompactHeader = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    parentSpanId: string;
    @api
    isParentSpanIdDisabled: boolean;
    handleParentSpanIdChange(event: CustomEvent): void {
        const options: UiOptions = this.getCurrentOptions();
        options.parentSpanId = event.detail.value;
        this.notifyOptions(options);
    }

    getCurrentOptions(): UiOptions {
        return {
            isEnabled: this.isEnabled,
            useNetworkOptions: this.useNetworkOptions,
            activityName: this.activityName,
            logErrors: this.logErrors,
            useTracing: this.useTracing,
            sampleRate: this.sampleRate,
            useTracingOptions: this.useTracingOptions,
            traceIdEffectiveLength: this.traceIdEffectiveLength,
            useB3Headers: this.useB3Headers,
            useCompactHeader: this.useCompactHeader,
            parentSpanId: this.parentSpanId
        };
    }

    notifyOptions(options: UiOptions): void {
        ComponentUtils.raiseEvent(this, 'optionschange', options);
    }

    handleTestUrlChange(event: CustomEvent): void {
        this.testUrl = event.detail.value;
    }

    async handleFetchCall() {
        try {
            const resp: globalThis.Response = await fetch(this.testUrl);
            this.lastResponse = await resp.text();
        } catch (err) {
            this._instr.error(err as Error);
            this.lastResponse = '<error>';
        }
    }

    handleXhrCall() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => {
            this._instr.error('XHR error');
            this.lastResponse = '<error>';
        });
        xhr.addEventListener('abort', () => {
            this._instr.error('XHR abort');
            this.lastResponse = '<abort>';
        });
        xhr.addEventListener('load', () => {
            this.lastResponse = xhr.responseText;
        });
        xhr.open('GET', this.testUrl);
        xhr.send();
    }
}
