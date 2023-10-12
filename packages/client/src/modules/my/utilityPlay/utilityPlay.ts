import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';

import { endpoints } from '../../shared/endpoints';
import { base64BinToCSV } from '../../../../../_common/src/arrayUtil';

export default class UtilityPlay extends LightningElement {
    private readonly _instr: Instrumentation;

    @track base64Text = '';
    @track csvText = '';
    @track lastResponse: string;
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

    @track uploadEndpoint: string = endpoints.sampleCsvEndpointWithTextReturn;
    handleUploadEndpointChange(event: CustomEvent): void {
        this.uploadEndpoint = event.detail.value;
    }

    handleBase64TextChange(event: CustomEvent) {
        // const name = (event.target as HTMLTextAreaElement).name;
        let base64 = event.detail.value;
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
            this.errorMsg =
                'Failed to convert base64 to CSV - remove any quotes if any. ' +
                (err as any)?.message?.toString();
        }
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
        } catch (err) {
            this._instr.error(err as Error);
            this.lastResponse = err?.toString() ?? '<ERROR>';
        }
    }
}
