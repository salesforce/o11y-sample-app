export interface UiOptions {
    isEnabled: boolean;
    useNetworkOptions: boolean;
    activityName: string;
    logErrors: boolean;
    useTracing: boolean;
    sampleRate: number;
    useTracingOptions: boolean;
    traceIdEffectiveLength: number;
    useB3Headers: boolean;
    useCompactHeader: boolean;
    parentSpanId?: string;
}
