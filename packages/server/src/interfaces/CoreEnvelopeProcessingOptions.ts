export interface CoreEnvelopeProcessingOptions {
    logMethod?: (...params: unknown[]) => void;
    warnMethod?: (...params: unknown[]) => void;
    errorMethod?: (...params: unknown[]) => void;
}
