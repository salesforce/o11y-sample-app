import { CoreEnvelopeProcessingOptions } from './interfaces/CoreEnvelopeProcessingOptions';
import { JsonLogEntry } from './interfaces/JsonLogEntry';
import { LogBuilder } from './interfaces/LogBuilder';

export class JsonLogBuilder implements LogBuilder {
    private readonly _entries: JsonLogEntry[] = [];

    private _log(type: string, ...params: unknown[]): void {
        this._entries.push({
            type,
            items: params
        });
    }
    log(...params: unknown[]): void {
        this._log('INFO', ...params);
    }
    warn(...params: unknown[]): void {
        this._log('WARN', ...params);
    }
    error(...params: unknown[]): void {
        this._log('ERROR', ...params);
    }
    get(): JsonLogEntry[] {
        return this._entries.splice(0);
    }

    getCoreEnvelopeProcessingOptions(): CoreEnvelopeProcessingOptions {
        return {
            logMethod: this.log.bind(this),
            warnMethod: this.warn.bind(this),
            errorMethod: this.error.bind(this)
        };
    }
}
