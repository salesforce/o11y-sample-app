export interface CoreEnvelopeProcessingOptions {
    logMethod?: (...params: unknown[]) => void;
    warnMethod?: (...params: unknown[]) => void;
    errorMethod?: (...params: unknown[]) => void;
    maxBundlesToProcess?: number;
    maxMessagesPerBundleToProcess?: number;
    maxMetricsPerTypeToProcess?: number;
    maxTagsPerMetric?: number;
}
