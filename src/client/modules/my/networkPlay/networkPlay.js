"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
const client_1 = require("o11y/client");
const apiEndpoints_1 = require("../../shared/apiEndpoints");
const componentUtils_1 = require("../../shared/componentUtils");
class NetworkPlay extends lwc_1.LightningElement {
    constructor() {
        super();
        this.lastResponse = undefined;
        this.testUrl = apiEndpoints_1.isoDateEndpoint;
        this._instr = (0, client_1.getInstrumentation)('Network Instrumentation');
    }
    handleToggleClick() {
        const options = this.getCurrentOptions();
        options.isEnabled = !this.isEnabled;
        this.notifyOptions(options);
    }
    handleUseNetworkOptionsChange(event) {
        const options = this.getCurrentOptions();
        options.useNetworkOptions = event.detail.checked;
        this.notifyOptions(options);
    }
    handleActivityNameChange(event) {
        const options = this.getCurrentOptions();
        options.activityName = event.detail.value;
        this.notifyOptions(options);
    }
    handleLogErrorsChange(event) {
        const options = this.getCurrentOptions();
        options.logErrors = event.detail.checked;
        this.notifyOptions(options);
    }
    handleUseTracingChange(event) {
        const options = this.getCurrentOptions();
        options.useTracing = event.detail.checked;
        this.notifyOptions(options);
    }
    handleSampleRateChange(event) {
        const options = this.getCurrentOptions();
        options.sampleRate = event.detail.value;
        this.notifyOptions(options);
    }
    handleUseTracingOptionsChange(event) {
        const options = this.getCurrentOptions();
        options.useTracingOptions = event.detail.checked;
        this.notifyOptions(options);
    }
    handleTraceIdEffectiveLengthChange(event) {
        const options = this.getCurrentOptions();
        options.traceIdEffectiveLength = event.detail.value;
        this.notifyOptions(options);
    }
    handleUseB3HeadersChange(event) {
        const options = this.getCurrentOptions();
        options.useB3Headers = event.detail.checked;
        this.notifyOptions(options);
    }
    handleUseCompactHeaderChange(event) {
        const options = this.getCurrentOptions();
        options.useCompactHeader = event.detail.checked;
        this.notifyOptions(options);
    }
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
            sampleRate: this.sampleRate,
            useTracingOptions: this.useTracingOptions,
            traceIdEffectiveLength: this.traceIdEffectiveLength,
            useB3Headers: this.useB3Headers,
            useCompactHeader: this.useCompactHeader,
            parentSpanId: this.parentSpanId
        };
    }
    notifyOptions(options) {
        componentUtils_1.ComponentUtils.raiseEvent(this, 'optionschange', options);
    }
    handleTestUrlChange(event) {
        this.testUrl = event.detail.value;
    }
    handleFetchCall() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fetch(this.testUrl);
                this.lastResponse = yield resp.text();
            }
            catch (err) {
                this._instr.error(err);
                this.lastResponse = '<error>';
            }
        });
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
__decorate([
    lwc_1.track
], NetworkPlay.prototype, "lastResponse", void 0);
__decorate([
    lwc_1.track
], NetworkPlay.prototype, "testUrl", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isEnabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "useNetworkOptions", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "activityName", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isActivityNameDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "logErrors", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isLogErrorsDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "useTracing", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isUseTracingDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "sampleRate", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isSampleRateDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "useTracingOptions", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isUseTracingOptionsDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "traceIdEffectiveLength", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isTraceIdEffectiveLengthDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "useB3Headers", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isUseB3HeadersDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "useCompactHeader", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isUseCompactHeaderDisabled", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "parentSpanId", void 0);
__decorate([
    lwc_1.api
], NetworkPlay.prototype, "isParentSpanIdDisabled", void 0);
exports.default = NetworkPlay;
