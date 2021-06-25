import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { isoDateEndpoint } from '../../shared/apiEndpoints';
import { ComponentUtils } from '../../shared/componentUtils';

export default class NetworkPlay extends LightningElement {
    lastResponse;
    testUrl;

    constructor() {
        super();
        this.lastResponse = undefined;
        this.testUrl = isoDateEndpoint;
        this.instr = getInstrumentation('Network Instrumentation');
    }

    @api
    isEnabled;
    handleToggleClick() {
        const options = this.getCurrentOptions();
        options.isEnabled = !this.isEnabled;
        this.notifyOptions(options);
    }

    @api
    useNetworkOptions;
    handleUseNetworkOptionsChange(event) {
        const options = this.getCurrentOptions();
        options.useNetworkOptions = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    activityName;
    @api
    isActivityNameDisabled;
    handleActivityNameChange(event) {
        const options = this.getCurrentOptions();
        options.activityName = event.detail.value;
        this.notifyOptions(options);
    }

    @api
    logErrors;
    @api
    isLogErrorsDisabled;
    handleLogErrorsChange(event) {
        const options = this.getCurrentOptions();
        options.logErrors = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    useTracing;
    @api
    isUseTracingDisabled;
    handleUseTracingChange(event) {
        const options = this.getCurrentOptions();
        options.useTracing = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    useTracingOptions;
    @api
    isUseTracingOptionsDisabled;
    handleUseTracingOptionsChange(event) {
        const options = this.getCurrentOptions();
        options.useTracingOptions = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    traceIdEffectiveLength;
    @api
    isTraceIdEffectiveLengthDisabled;
    handleTraceIdEffectiveLengthChange(event) {
        const options = this.getCurrentOptions();
        options.traceIdEffectiveLength = event.detail.value;
        this.notifyOptions(options);
    }

    @api
    useB3Headers;
    @api
    isUseB3HeadersDisabled;
    handleUseB3HeadersChange(event) {
        const options = this.getCurrentOptions();
        options.useB3Headers = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    useCompactHeader;
    @api
    isUseCompactHeaderDisabled;
    handleUseCompactHeaderChange(event) {
        const options = this.getCurrentOptions();
        options.useCompactHeader = event.detail.checked;
        this.notifyOptions(options);
    }

    @api
    parentSpanId;
    @api
    isParentSpanIdDisabled;
    handleParentSpanIdChange(event) {
        const options = this.getCurrentOptions();
        options.parentSpanId = event.detail.value;
        this.notifyOptions(options);
    }

    getCurrentOptions() {
        return {
            isEnabled: this.isEnabled,
            useNetworkOptions: this.useNetworkOptions,
            activityName: this.activityName,
            logErrors: this.logErrors,
            useTracing: this.useTracing,
            useTracingOptions: this.useTracingOptions,
            traceIdEffectiveLength: this.traceIdEffectiveLength,
            useB3Headers: this.useB3Headers,
            useCompactHeader: this.useCompactHeader,
            parentSpanId: this.parentSpanId
        };
    }

    notifyOptions(options) {
        ComponentUtils.raiseEvent(this, 'optionschange', options);
    }

    handleTestUrlChange(event) {
        this.testUrl = event.detail.value;
    }

    async handleFetchCall() {
        try {
            const resp = await fetch(this.testUrl);
            this.lastResponse = await resp.text();
        } catch (err) {
            this.instr.error(err);
            this.lastResponse = '<error>';
        }
    }

    handleXhrCall() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => {
            this.instr.error('XHR error');
            this.lastResponse = '<error>';
        });
        xhr.addEventListener('abort', () => {
            this.instr.error('XHR abort');
            this.lastResponse = '<abort>';
        });
        xhr.addEventListener('load', () => {
            this.lastResponse = xhr.responseText;
        });
        xhr.open('GET', this.testUrl);
        xhr.send();
    }
}