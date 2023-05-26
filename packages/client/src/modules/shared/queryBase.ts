import { api, LightningElement, track } from 'lwc';

import { setCode } from '../shared/htmlUtils';
import { schemas } from '../../../../_common/generated/schema';
import { getType } from '../../../../_common/src/protoUtil';
import { schemaUtil } from '../../../../_common/src/schemaUtil';
import { Schema } from '../../../../_common/interfaces/Schema';

type SplunkType = 'preprod' | 'prod';

const splunkHosts = {
    preprod: 'https://splunk-web-preprod.log-analytics.monitoring.aws-esvc1-useast2.aws.sfdc.is',
    prod: 'https://splunk-web.log-analytics.monitoring.aws-esvc1-useast2.aws.sfdc.is'
};

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
        this.handleInputChange();
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

    private _oldQuery: string;

    setQuery(value: string) {
        if (this.query !== value) {
            this._oldQuery = this.query;
            this.query = value;
            this._setLinkHref();
        }
    }

    abstract handleInputChange(): void;

    renderedCallback(): void {
        setCode(this.template.querySelector('div.hljs'), this.query, true);
    }

    private _setLinkHref(): void {
        const splunkHost = splunkHosts[this.splunkType];
        if (splunkHost && this.query) {
            const q = encodeURIComponent(this.query);
            this.linkHref = `https://${splunkHost}/en-US/app/search/search?q=${q}`;
        } else {
            this.linkHref = undefined;
        }
    }
}
