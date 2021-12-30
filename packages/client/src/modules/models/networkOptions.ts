import { TracingHeadersOptions } from 'o11y/dist/modules/o11y/client/interfaces';
import { NetworkInstrumentationOptions } from '../../interfaces/networkInstrumentationOptions';
import { UiOptions } from '../../interfaces/uiOptions';

export class NetworkOptions implements UiOptions, TracingHeadersOptions {
    isEnabled: boolean;
    useNetworkOptions: boolean;
    activityName: string;
    isActivityNameDisabled: boolean;
    logErrors: boolean;
    isLogErrorsDisabled: boolean;
    useTracing: boolean;
    isUseTracingDisabled: boolean;
    sampleRate: number;
    isSampleRateDisabled: boolean;
    useTracingOptions: boolean;
    isUseTracingOptionsDisabled: boolean;
    traceIdEffectiveLength: number;
    isTraceIdEffectiveLengthDisabled: boolean;
    useB3Headers: boolean;
    isUseB3HeadersDisabled: boolean;
    useCompactHeader: boolean;
    isUseCompactHeaderDisabled: boolean;
    parentSpanId: string;
    isParentSpanIdDisabled: boolean;

    constructor(uiOptions?: UiOptions) {
        if (!uiOptions) {
            this.reset();
        } else {
            this.setOptions(uiOptions);
        }
    }

    reset(): void {
        // These are the defaults per documentation
        this.setOptions({
            isEnabled: false,
            useNetworkOptions: false,
            activityName: undefined,
            logErrors: true,
            useTracing: true,
            sampleRate: undefined,
            useTracingOptions: false,
            traceIdEffectiveLength: undefined,
            useB3Headers: false,
            useCompactHeader: false,
            parentSpanId: undefined
        });
    }

    getNetworkInstrumentationOptions(): NetworkInstrumentationOptions | boolean {
        return this.isEnabled
            ? this.useNetworkOptions
                ? {
                      logErrors: this.logErrors,
                      activityName: this.activityName,
                      useTracing: this.useTracing,
                      tracingHeadersOptions: this.useTracingOptions
                          ? {
                                useB3Headers: this.useB3Headers,
                                useCompactHeader: this.useCompactHeader,
                                traceIdEffectiveLength: this.traceIdEffectiveLength,
                                parentSpanId: this.parentSpanId
                            }
                          : undefined
                  }
                : true
            : false;
    }

    setOptions(uiOptions: UiOptions): void {
        this.isEnabled = uiOptions.isEnabled;
        this.useNetworkOptions = uiOptions.useNetworkOptions;
        this.activityName = uiOptions.activityName;
        this.logErrors = uiOptions.logErrors;
        this.useTracing = uiOptions.useTracing;
        this.sampleRate = uiOptions.sampleRate;
        this.useTracingOptions = uiOptions.useTracingOptions;
        this.traceIdEffectiveLength = uiOptions.traceIdEffectiveLength;
        this.useB3Headers = uiOptions.useB3Headers;
        this.useCompactHeader = uiOptions.useCompactHeader;
        this._configureUi(this.useNetworkOptions);
    }

    _configureUi(isEnabled: boolean): void {
        let disabled = !isEnabled;
        this.isSampleRateDisabled = false;
        this.isActivityNameDisabled = disabled;
        this.isLogErrorsDisabled = disabled;
        this.isUseTracingDisabled = disabled;
        this.isUseTracingOptionsDisabled = disabled;

        disabled = !(isEnabled && this.useTracing && this.useTracingOptions);
        this.isTraceIdEffectiveLengthDisabled = disabled;
        this.isUseB3HeadersDisabled = disabled;
        this.isUseCompactHeaderDisabled = disabled;
        this.isParentSpanIdDisabled = disabled;
    }
}
