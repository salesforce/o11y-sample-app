import { CoreEnvelopeProcessingOptions } from './interfaces/CoreEnvelopeProcessingOptions';
import { LogBuilderOptions } from './interfaces/LogBuilderOptions';

export class LogBuilder {
    private readonly _lines: string[] = [];
    private readonly _jsonIndent: number;

    constructor(options?: LogBuilderOptions) {
        this._jsonIndent = options?.jsonIndent ?? 0;
    }

    private _log(type: string, ...params: unknown[]): void {
        if (!params.length) {
            this._lines.push('');
        } else {
            for (const p of params) {
                let text;
                if (typeof p === 'object') {
                    text = JSON.stringify(p, undefined, this._jsonIndent);
                } else if (p == undefined) {
                    text = 'undefined';
                } else {
                    text = (p as any).toString();
                }
                this._lines.push(`${type}: ${text}`);
            }
        }
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
    get(): string[] {
        return this._lines.splice(0);
    }

    getCoreEnvelopeProcessingOptions(): CoreEnvelopeProcessingOptions {
        return {
            logMethod: this.log.bind(this),
            warnMethod: this.warn.bind(this),
            errorMethod: this.error.bind(this)
        };
    }
}
