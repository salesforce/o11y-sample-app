import { CoreEnvelopeProcessingOptions } from './CoreEnvelopeProcessingOptions';

export interface LogBuilder {
    log(...params: unknown[]): void;
    warn(...params: unknown[]): void;
    error(...params: unknown[]): void;
    get(): unknown[];

    getCoreEnvelopeProcessingOptions(): CoreEnvelopeProcessingOptions;
}
