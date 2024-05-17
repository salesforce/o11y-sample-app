import { api, LightningElement, track } from 'lwc';

const defaultArgusDomain = 'https://monitoring.internal.salesforce.com';

export default class ArgusLink extends LightningElement {
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

    @track
    url: string;

    private _updateUrl(): void {
        if (this.query) {
            const q = encodeURIComponent(this.query);
            this.url = `${defaultArgusDomain}/argusmvp/#/viewmetricsnew?tab=expression&expression=${q}`;
        } else {
            this.url = undefined;
        }
    }

    handleClick(): void {
        window.open(this.url, '_blank');
    }
}
