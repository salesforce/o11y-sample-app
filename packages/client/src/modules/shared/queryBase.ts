import { api, LightningElement, track } from 'lwc';

import { setCode } from '../shared/htmlUtils';
import { schemas } from '../../../../_common/generated/schema';
import { getType } from '../../../../_common/src/protoUtil';
import { schemaUtil } from '../../../../_common/src/schemaUtil';
import { Schema } from '../../../../_common/interfaces/Schema';

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
            if (cs) {
                this.schemaName = schemaUtil.getSchemaName(cs);
                this.importName = schemaUtil.getImportName(cs);
                this.schemaType = getType(this.schemaId);
            } else {
                this.schemaName = undefined;
                this.importName = undefined;
                this.schemaType = undefined;
            }
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

    private _loggerName: string;
    @api
    get loggerName(): string {
        return this._loggerName;
    }
    set loggerName(value: string) {
        if (this._loggerName !== value) {
            this._loggerName = value;
            this.handleInputChange();
        }
    }

    private _language: string;
    @api
    get language(): string {
        return this._language;
    }
    set language(value: string) {
        if (this._language !== value) {
            this._language = value;
            this.handleInputChange();
        }
    }

    protected schemaName: string;
    protected importName: string;
    protected schemaType: protobuf.Type;

    @track
    query: string;

    private _earliest: string;
    @api
    get earliest(): string {
        return this._earliest;
    }
    set earliest(value: string) {
        this._earliest = value;
        this.updateQuery();
    }

    handleInputChange(): void {
        this.updateQuery();
    }

    renderedCallback(): void {
        setCode(this.template.querySelector('div.hljs'), this.query, '0', this.language);
    }

    protected abstract updateQuery(): void;
}
