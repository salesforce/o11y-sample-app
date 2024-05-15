import { api } from 'lwc';

import type { SplunkType } from '../types/Shared';
import QueryBase from './queryBase';

export default abstract class SplunkQueryBase extends QueryBase {
    private _splunkType: SplunkType;
    @api
    get splunkType(): SplunkType {
        return this._splunkType;
    }
    set splunkType(value: SplunkType) {
        if (this._splunkType !== value) {
            this._splunkType = value;
            this.handleInputChange();
        }
    }

    get defaultIndex(): string {
        return this.splunkType === 'preprod' ? 'prod' : 'prod' ? 'coreprod' : undefined;
    }

    protected updateQuery(): void {
        let query = this.getQuery(this.defaultIndex, this.schemaId, this.loggerAppName);
        if (query) {
            // Get rid of leading whitespace
            query = query.replace(/(?<=\r\n|\n|\r)(^\s+)/gm, ' ').trim();
        }
        if (this.query !== query) {
            this.query = query;
        }
    }

    protected abstract getQuery(index: string, schemaId: string, loggerAppName: string): string;
}
