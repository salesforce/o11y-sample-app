import { LightningElement, api, track } from 'lwc';
import { CoreCollectorPlayOptions } from '../../../interfaces/coreCollectorOptions';
import { utility } from '../../../utility';
import { ComponentUtils } from '../../shared/componentUtils';
import {
    sampleApiEndpoint,
    coreApiEndpoint,
    coreApiEndpointSecure
} from '../../shared/apiEndpoints';
import { UploadMode } from 'o11y/dist/modules/o11y/collectors/collectors/core-collector/UploadMode';

export default class CoreCollectorPlay extends LightningElement {
    @api uploadMode: number;
    private _handleUploadModeChange(uploadMode: UploadMode) {
        const options: CoreCollectorPlayOptions = this.getCurrentOptions();
        options.uploadMode = uploadMode;
        this.notifyOptions(options);
    }
    handleUploadModeChange(event: CustomEvent): void {
        this._handleUploadModeChange(utility.asNumber(event.detail.value));
    }

    @api uploadInterval: number;
    private _handlUploadIntervalChange(interval: string | number): void {
        const options: CoreCollectorPlayOptions = this.getCurrentOptions();
        options.uploadInterval = utility.asNumber(interval);
        this.notifyOptions(options);
    }
    handleUploadIntervalChange(event: CustomEvent): void {
        this._handlUploadIntervalChange(event.detail.value);
    }

    @api uploadEndpoint: string;
    private _handleUploadEndpointChange(endpoint: string): void {
        const options: CoreCollectorPlayOptions = this.getCurrentOptions();
        options.uploadEndpoint = endpoint;
        this.notifyOptions(options);
    }
    handleUploadEndpointChange(event: CustomEvent): void {
        this._handleUploadEndpointChange(event.detail.value);
    }

    @api bearerToken: string;
    handleBearerTokenChange(event: CustomEvent): void {
        const options: CoreCollectorPlayOptions = this.getCurrentOptions();
        options.bearerToken = event.detail.value;
        this.notifyOptions(options);
    }

    handleO11ySampleClick(): void {
        this._handleUploadEndpointChange(sampleApiEndpoint);
    }

    handleHttpCoreClick(): void {
        this._handleUploadEndpointChange(coreApiEndpoint);
    }

    handleHttpsCoreClick(): void {
        this._handleUploadEndpointChange(coreApiEndpointSecure);
    }

    handleNoUploadClick(): void {
        this._handleUploadModeChange(2); // TODO: UploadMode.noUpload
    }

    handleBinaryUploadClick(): void {
        this._handleUploadModeChange(0); // TODO: UploadMode.fetchBinary
    }

    handleFileUploadClick(): void {
        this._handleUploadModeChange(1); // TODO: UploadMode.fetchFile
    }

    handleMaxIntervalClick(): void {
        this._handlUploadIntervalChange(utility.maxInt);
    }

    getCurrentOptions(): CoreCollectorPlayOptions {
        return {
            uploadMode: this.uploadMode,
            uploadInterval: this.uploadInterval,
            uploadEndpoint: this.uploadEndpoint,
            bearerToken: this.bearerToken
        };
    }

    notifyOptions(options: CoreCollectorPlayOptions): void {
        ComponentUtils.raiseEvent(this, 'optionschange', options);
    }
}
