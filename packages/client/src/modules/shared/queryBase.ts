import { api, LightningElement, track } from 'lwc';

import { setCode } from '../shared/htmlUtils';
import { schemas } from '../../../../_common/generated/schema';
import { getType } from '../../../../_common/src/protoUtil';
import { schemaUtil } from '../../../../_common/src/schemaUtil';
import { Schema } from '../../../../_common/interfaces/Schema';
import type { SplunkType } from '../types/Shared';

export default abstract class QueryBase extends LightningElement {
    private _schemaId: string;
    @api
    get schemaId(): string {
        return this._schemaId;
    }
    set schemaId(value: string) {
        if (this._schemaId !== value) {
            this._schemaId = value;

            const cs: Schema = schemas.get(this.schemaId);
            this.schemaName = schemaUtil.getSchemaName(cs);
            this.importName = schemaUtil.getImportName(cs);

            this.schemaType = getType(this.schemaId);
            this.handleInputChange();
        }
    }

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

    private _loggerAppName: string;
    @api
    get loggerAppName(): string {
        return this._loggerAppName;
    }
    set loggerAppName(value: string) {
        if (this._loggerAppName !== value) {
            this._loggerAppName = value;
            this.handleInputChange();
        }
    }

    protected schemaName: string;
    protected importName: string;
    protected schemaType: protobuf.Type;

    get defaultIndex(): string {
        return this.splunkType === 'preprod' ? 'prod' : 'prod' ? 'coreprod' : undefined;
    }

    @track
    query: string;

    @track
    linkHref: string;

    handleInputChange(): void {
        this.updateQuery();
    }

    renderedCallback(): void {
        setCode(this.template.querySelector('div.hljs'), this.query, '0');
    }

    protected updateQuery(): void {
        let query = this.getQuery(this.defaultIndex, this.schemaId, this.loggerAppName);
        if (this.query !== query) {
            if (query) {
                // Get rid of leading whitespace
                query = query.replace(/(?<=\r\n|\n|\r)(^\s+)/gm, ' ').trim();
            }
            this.query = query;
        }
    }

    protected abstract getQuery(index: string, schemaId: string, loggerAppName: string): string;
}
