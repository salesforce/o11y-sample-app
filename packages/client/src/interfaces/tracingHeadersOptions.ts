export interface TracingHeadersOptions {
    useB3Headers: boolean;
    useCompactHeader: boolean;
    traceIdEffectiveLength: number;
    parentSpanId: string;
}
