import { api, LightningElement, track } from 'lwc';
import type { SplunkType } from '../../types/Shared';

const splunkHosts = {
    preprod: 'https://splunk-web-preprod.log-analytics.monitoring.aws-esvc1-useast2.aws.sfdc.is',
    prod: 'https://splunk-web.log-analytics.monitoring.aws-esvc1-useast2.aws.sfdc.is'
};

export default class SplunkLink extends LightningElement {
    @api
    splunkType: SplunkType;

    private _query: string;
    @api
    get query(): string {
        return this._query;
    }
    set query(value: string) {
        if (this._query !== value) {
            this._query = value;
            this._updateUrl();
        }
    }
    private _tab: string;

    @api
    get tab(): string {
        return this._tab;
    }
    set tab(value: string) {
        if (this._tab !== value) {
            this._tab = value;
            this._updateUrl();
        }
    }

    @track
    url: string;

    private _updateUrl(): void {
        const splunkHost = splunkHosts[this.splunkType];
        if (splunkHost && this.query) {
            const q = encodeURIComponent(this.query);
            this.url = `${splunkHost}/en-US/app/search/search?q=${q}`;
            if (this.tab) {
                switch (this.tab) {
                    case 'visualization':
                        this.url +=
                            '&display.page.search.tab=visualizations&display.general.type=visualizations';
                        break;
                    default:
                        throw new Error('Unsupported tab value');
                }
            }
        } else {
            this.url = undefined;
        }
    }

    handleClick(): void {
        window.open(this.url, '_blank');
    }
}
