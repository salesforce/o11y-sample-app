import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';

import { endpoints } from '../../shared/endpoints';
import { base64BinToCSV } from '../../../../../_common/src/arrayUtil';

export default class UtilityPlay extends LightningElement {
    private readonly _instr: Instrumentation;
    private jv: HTMLElement;

    @track base64Text = '';
    @track csvText = '';
    @track lastResponse: string;
    @track showJsonResponse = true;
    @track expandAll = true;
    @track errorMsg: string;
    @track
    readonly uploadEndpointOptions: { label: string; value: string }[] = [
        {
            label: 'Sample CSV Endpoint (returns server logs as text)',
            value: endpoints.sampleCsvEndpointWithTextReturn
        },
        {
            label: 'Sample CSV Endpoint (returns server logs as JSON)',
            value: endpoints.sampleCsvEndpointWithJsonReturn
        }
    ];

    constructor() {
        super();
        this.lastResponse = undefined;
        this._instr = getInstrumentation('Utility');
    }

    @track uploadEndpoint: string = endpoints.sampleCsvEndpointWithJsonReturn;
    handleUploadEndpointChange(event: CustomEvent): void {
        this.uploadEndpoint = event.detail.value;
        this.showJsonResponse = this.uploadEndpoint === endpoints.sampleCsvEndpointWithJsonReturn;
    }

    private _setBase64Text(base64: string): void {
        try {
            if (
                (base64.startsWith("'") && base64.endsWith("'")) ||
                (base64.startsWith('"') && base64.endsWith('"'))
            ) {
                // Remove any quotes
                base64 = base64.substring(1, base64.length - 1);
            }
            this.base64Text = base64;
            this.csvText = base64BinToCSV(base64);
            this.errorMsg = undefined;
        } catch (err) {
            this.errorMsg = 'Failed to convert base64 to CSV' + (err as any)?.message?.toString();
        }
    }

    handleBase64TextChange(event: CustomEvent) {
        // const name = (event.target as HTMLTextAreaElement).name;
        this._setBase64Text(event.detail.value);
    }

    async handleUploadCall() {
        try {
            const resp: globalThis.Response = await fetch(this.uploadEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: this.csvText
            });
            this.lastResponse = await resp.text();

            this.jv = document.createElement('json-viewer');
            this.jv.setAttribute('data', this.lastResponse);

            this._useJsonViewer(this.showJsonResponse);
        } catch (err) {
            this._instr.error(err as Error);
            this.lastResponse = err?.toString() ?? '<ERROR>';
        }
    }

    private _useJsonViewer(show: boolean): void {
        const div = this.template.querySelector('.json-viewer-host') as HTMLDivElement;
        if (div) {
            if (show) {
                if (this.jv) {
                    if (div.firstChild) {
                        div.replaceChild(this.jv, div.firstChild);
                    } else {
                        div.appendChild(this.jv);
                    }
                }
            } else {
                if (div.firstChild) {
                    div.removeChild(div.firstChild);
                }
            }
        }
    }

    handleToggleClick(): void {
        this.showJsonResponse = !this.showJsonResponse;
    }

    renderedCallback(): void {
        this._useJsonViewer(this.showJsonResponse);
    }

    handleExpandAllClick(): void {
        (this.jv as any)?.expandAll();
    }

    handleCollapseAllClick(): void {
        (this.jv as any)?.collapseAll();
    }

    handleClear(): void {
        this._setBase64Text('');
    }
}
