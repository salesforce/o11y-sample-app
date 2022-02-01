import { LightningElement, api, track } from 'lwc';
import { CoreCollectorPlayOptions } from '../../../interfaces/coreCollectorOptions';
import { utility } from '../../../utility';
import { ComponentUtils } from '../../shared/componentUtils';
import { endpoints } from '../../shared/endpoints';
import { UploadMode } from 'o11y/dist/modules/o11y/collectors/collectors/core-collector/UploadMode';

// These values must match the corresponding values in the HTML.
const minInterval = 10;
const maxInterval = utility.maxInt;

export default class CoreCollectorPlay extends LightningElement {
    @track readonly qaGetSessionUrl = endpoints.getCoreQaGetSessionEndpoint(false);
    @track readonly qaGetSessionUrlSecure = endpoints.getCoreQaGetSessionEndpoint(true);

    readonly uploadModeOptions: { label: string; value: UploadMode }[] = [
        { label: 'None', value: 2 }, // TODO: UploadMode.noUpload
        { label: 'Binary (required for sample app server)', value: 0 }, // TODO: UploadMode.fetchBinary
        { label: 'File (required for Core app server)', value: 1 } // TODO: UploadMode.fetchFile
    ];

    @track
    readonly uploadEndpointOptions: { label: string; value: string }[] = [
        { label: 'Sample App Endpoint', value: endpoints.sampleTelemetryEndpoint },
        {
            label: 'Sample App Endpoint (returns server logs as text)',
            value: endpoints.sampleTelemetryEndpointWithTextReturn
        },
        {
            label: 'Sample App Endpoint (returns server logs as JSON)',
            value: endpoints.sampleTelemetryEndpointWithJsonReturn
        },
        { label: 'Local Core (HTTP)', value: endpoints.getCoreTelemetryEndpoint(false) },
        { label: 'Local Core (HTTPS)', value: endpoints.getCoreTelemetryEndpoint(true) }
    ];

    @api uploadMode: number;
    handleUploadModeChange(event: CustomEvent): void {
        const options: CoreCollectorPlayOptions = this._getCurrentOptions();
        options.uploadMode = utility.asNumber(event.detail.value);
        this._notifyOptions(options);
    }

    @api uploadInterval: number;
    private _handlUploadIntervalChange(interval: string | number): void {
        const value = utility.asNumber(interval);
        if (value < minInterval || value > maxInterval) {
            // Do nothing
            return;
        }
        const options: CoreCollectorPlayOptions = this._getCurrentOptions();
        options.uploadInterval = value;
        this._notifyOptions(options);
    }
    handleUploadIntervalChange(event: CustomEvent): void {
        this._handlUploadIntervalChange(event.detail.value);
    }
    handleMaxIntervalClick(): void {
        this._handlUploadIntervalChange(utility.maxInt);
    }
    handleOneSecondIntervalClick(): void {
        this._handlUploadIntervalChange(1000);
    }
    handleOneMinuteIntervalClick(): void {
        this._handlUploadIntervalChange(60000);
    }
    handleDefaultIntervalClick(): void {
        this._handlUploadIntervalChange(undefined);
    }

    @api uploadEndpoint: string;
    handleUploadEndpointChange(event: CustomEvent): void {
        const options: CoreCollectorPlayOptions = this._getCurrentOptions();
        options.uploadEndpoint = event.detail.value;
        this._notifyOptions(options);
    }

    private _handleBearerTokenChange(token: string): void {
        const options: CoreCollectorPlayOptions = this._getCurrentOptions();
        options.bearerToken = token;
        this._notifyOptions(options);
    }

    @api bearerToken: string;
    handleBearerTokenChange(event: CustomEvent): void {
        this._handleBearerTokenChange(event.detail.value);
    }

    handleClearClick(): void {
        this._handleBearerTokenChange('');
    }

    private _getCurrentOptions(): CoreCollectorPlayOptions {
        return {
            uploadMode: this.uploadMode,
            uploadInterval: this.uploadInterval,
            uploadEndpoint: this.uploadEndpoint,
            bearerToken: this.bearerToken
        };
    }

    private _notifyOptions(options: CoreCollectorPlayOptions): void {
        ComponentUtils.raiseEvent(this, 'optionschange', options);
    }
}
