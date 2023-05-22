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
        this._schemaId = value;

        const cs: Schema = schemas.get(this.schemaId);
        this.schemaName = schemaUtil.getSchemaName(cs);
        this.importName = schemaUtil.getImportName(cs);

        this.schemaType = getType(this.schemaId);
        this.handleSchemaChange();
    }

    protected schemaName: string;
    protected importName: string;
    protected schemaType: protobuf.Type;

    @track
    query: string;

    private _oldQuery: string;

    setQuery(value: string) {
        if (this.query !== value) {
            this._oldQuery = this.query;
            this.query = value;
        }
    }

    abstract handleSchemaChange(): void;

    renderedCallback(): void {
        if (this.query !== this._oldQuery) {
            setCode(this.template.querySelector('div.hljs'), this.query, true);
        }
    }
}
