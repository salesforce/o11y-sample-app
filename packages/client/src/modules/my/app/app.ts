import { LightningElement, track } from 'lwc';
import { registerInstrumentedApp, ConsoleCollector } from 'o11y/client';
import { CoreCollector } from 'o11y/collectors';
import { AppPayloadProvider } from '../../../appPayloadProvider';
import { PagePayloadProvider } from '../../../pagePayloadProvider';
import { NetworkOptions } from '../../models/networkOptions';
import { utility } from '../../../utility';

import {
    Activity,
    InstrumentedAppMethods,
    LogCollector,
    LogMeta,
    Schema
} from 'o11y/dist/modules/o11y/client/interfaces';
import { CoreCollector as CoreCollectorType } from 'o11y/dist/modules/o11y/collectors/collectors';
import { SchematizedData } from 'o11y/dist/modules/o11y/shared/shared/TypeDefinitions';
import { defaultApiEndpoint } from '../../shared/apiEndpoints';
import { LogModel } from '../../models/logModel';
import { UploadResult } from 'o11y/dist/modules/o11y/collectors/collectors/core-collector/interfaces/UploadResult';
import { CoreCollectorPlayOptions } from '../../../interfaces/coreCollectorOptions';
import { EventDetail } from '../../models/eventDetail';
import { UploadMode } from 'o11y/dist/modules/o11y/collectors/collectors/core-collector/UploadMode';

export default class App extends LightningElement implements LogCollector {
    @track labelIntro = 'Getting Started';
    @track labelEvents = 'Log DOM Events';
    @track labelErrors = 'Log Errors';
    @track labelActivities = 'Log Activities';
    @track labelCustom = 'Log Messages';
    @track labelIdleDetector = 'Idle Detector';
    @track labelServer = 'Core Collector';
    @track labelNetwork = 'Network Instrumentation';
    @track labelMetrics = 'Metrics';
    // If adding a new label, also add a corresponding section, and update _sectionToLabelMap

    @track sectionIntro = 'section_intro';
    @track sectionEvents = 'section_events';
    @track sectionErrors = 'section_errors';
    @track sectionActivities = 'section_activities';
    @track sectionCustom = 'section_logs';
    @track sectionIdleDetector = 'section_idle_detector';
    @track sectionServer = 'section_server';
    @track sectionNetwork = 'section_network';
    @track sectionMetrics = 'section_metrics';

    private readonly _sectionToLabelMap = new Map<string, string>()
        .set(this.sectionIntro, this.labelIntro)
        .set(this.sectionEvents, this.labelEvents)
        .set(this.sectionErrors, this.labelErrors)
        .set(this.sectionActivities, this.labelActivities)
        .set(this.sectionCustom, this.labelCustom)
        .set(this.sectionIdleDetector, this.labelIdleDetector)
        .set(this.sectionServer, this.labelServer)
        .set(this.sectionNetwork, this.labelNetwork)
        .set(this.sectionMetrics, this.labelMetrics);

    private _instrApp: InstrumentedAppMethods;
    private _fetchOrig: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    isRendered = false;
    clickTrackActive = false;
    selectedSection = this.sectionIntro;
    logs: LogModel[] = [];
    rootActivity: Activity;
    entityType = 'section';
    pagePayloadProvider: PagePayloadProvider;
    isNetworkInstrumentationEnabled = false;
    network = new NetworkOptions();
    coreCollector: CoreCollectorType;

    @track bearerToken = '';
    @track ccMsgCount: number;
    @track ccMetricCount: number;
    @track ccUploadInterval: number = utility.maxInt; // Note: Cannot use Infinity with setTimeout per MDN
    @track ccUploadMode: UploadMode = 0; // TODO: Use UploadMode.fetchBinary directly when it's exported
    @track ccUploadEndpoint: string = defaultApiEndpoint;

    environment = {
        appName: 'o11y-sample-app',
        appVersion: '2.0',
        appExperience: 'Sample',
        deviceId: 'Unknown',
        deviceModel: 'Unknown',
        sdkVersion: '238' // Keep this up-to-date with the major version
    };

    constructor() {
        super();
        this.initializeInstrumentation();
        window.addEventListener('beforeunload', () => {
            if (this.rootActivity) {
                this.rootActivity.stop();
            }
        });
    }

    initializeInstrumentation(): void {
        // The top-level entity (the app) must initialize instrumentation before use.
        // Components can directly use the getInstrumentation import from 'o11y/client'.

        // STEP 0: (Optional) Instantiate AppPayloadProvider, PagePayloadProvider
        this.pagePayloadProvider = new PagePayloadProvider(this.selectedSection, this.entityType);

        // STEP 1: Register the app
        this._instrApp = registerInstrumentedApp('o11y Sample App', {
            isProduction: false,
            appPayloadProvider: new AppPayloadProvider(),
            pagePayloadProvider: this.pagePayloadProvider
        });

        // STEP 2: Register log collectors
        this._instrApp.registerLogCollector(new ConsoleCollector());
        this._instrApp.registerLogCollector(this); // See 'collect' method
        this.coreCollector = this.getCoreCollector();
        this._updateCoreCollectorStats();
        this._instrApp.registerLogCollector(this.coreCollector);
        this._instrApp.registerLogCollector({
            // This "collector" will be run every time a collection happens, and is a good place for us to update core collector stats..
            collect: () => {
                this._updateCoreCollectorStats();
            }
        });

        // STEP 3: Register a metrics collector
        this._instrApp.registerMetricsCollector(this.coreCollector);

        // STEP 4: Activate the automatic click tracker via the following call:
        // this.instrApp.activateClickTracker();
        // For the sample app, we will leave it up to the user turn it on/off as needed

        // STEP 5: Optional: Enable network instrumentation
        // this.instrApp.networkInstrumentation(true);
        // For the sample app, we will leave it up to the user turn it on/off as needed
    }

    getCoreCollector(): CoreCollectorType {
        const ep = this.ccUploadEndpoint;
        // Create a new core collector and disable default logic to auto-upload on certain conditions
        const cc = new CoreCollector(ep, this.ccUploadMode, this.environment, {
            messagesLimit: utility.maxInt,
            metricsLimit: utility.maxInt,
            uploadFailedListener: (result: UploadResult) => {
                this._instrApp.error(
                    `Upload failed to ${ep}`,
                    result.error && result.error.toString()
                );
            }
        });
        cc.uploadInterval = this.ccUploadInterval;
        return cc;
    }

    private _updateCoreCollectorOptions(): void {
        this.coreCollector.uploadMode = this.ccUploadMode;
        this.coreCollector.uploadEndpoint = this.ccUploadEndpoint;
        this.coreCollector.uploadInterval = this.ccUploadInterval;
    }

    collect(schema: Schema, message: SchematizedData, logMeta: LogMeta): void {
        const schemaId = `${schema.namespace}.${schema.name}`;
        const model: LogModel = Object.assign({}, logMeta);
        Object.assign(model, {
            schemaId,
            msg: message,
            _isActivity: this.isActivity(schemaId),
            _isError: this.isError(schemaId),
            _isInstrumentedEvent: this.isInstrumentedEvent(schemaId),
            _isO11ySimple: this.isSimple(schemaId),
            _isO11ySample: this.isSample(schemaId),
            _isUnknown: this.isUnknown(schemaId)
        });
        this.logs = [model, ...this.logs];
    }

    getIsDisabled(): boolean {
        // As a collector
        return false;
    }

    isActivity(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.Activity';
    }

    isError(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.Error';
    }

    isInstrumentedEvent(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.InstrumentedEvent';
    }

    isSimple(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.Simple';
    }

    isSample(schemaId: string): boolean {
        return schemaId === 'sf.o11ySample.UserPayload';
    }

    isUnknown(schemaId: string): boolean {
        return (
            !this.isActivity(schemaId) &&
            !this.isError(schemaId) &&
            !this.isInstrumentedEvent(schemaId) &&
            !this.isSample(schemaId) &&
            !this.isSimple(schemaId)
        );
    }

    overrideFetch(): void {
        if (this._fetchOrig) {
            return;
        }
        this._fetchOrig = window.fetch;
        window.fetch = (input, init) => {
            init = init || {};
            const addHeaders: HeadersInit = {
                Authorization: `Bearer ${this.bearerToken}`
            };
            init.headers = Object.assign(init.headers || {}, addHeaders);
            return this._fetchOrig.call(window, input, init);
        };
    }

    restoreFetch(): void {
        if (this._fetchOrig) {
            window.fetch = this._fetchOrig;
            this._fetchOrig = undefined;
        }
    }

    handleToggleAct(): void {
        if (this.clickTrackActive) {
            this.clickTrackActive = false;
            this._instrApp.deactivateClickTracker();
        } else {
            this.clickTrackActive = true;
            this._instrApp.activateClickTracker(this._instrApp);
        }
    }

    handleClearLogs(): void {
        this.logs = [];
    }

    handleTabSelect(event: CustomEvent): void {
        const section = (this.selectedSection = (event.currentTarget as any).value);
        this.pagePayloadProvider.setEntityInfo(section, this.entityType);

        window.location.hash = section && section.substring(section.indexOf('_') + 1);
        this.startRootActivity(section);
    }

    startRootActivity(section: string): void {
        if (this.rootActivity) {
            // If rootActivity is not stopped explicitly, it will be terminated.
            this.rootActivity.stop();
        }
        const label = this._sectionToLabelMap.get(section) || 'Unknown Section';
        const isSampled = this.network.sampleRate > Math.random() * 100;
        this.rootActivity = this._instrApp.startRootActivity(label, undefined, isSampled);
    }

    handleNetworkOptionsChange(event: CustomEvent): void {
        const uiOptions = event.detail.value;

        const networkOptions = new NetworkOptions(uiOptions);
        this._instrApp.networkInstrumentation(networkOptions.getNetworkInstrumentationOptions());
        this.network = networkOptions;
        // TODO: Remove "as any" when types are fixed
        this._instrApp.log('Updated Network Options' as any);
    }

    async handleFlush(): Promise<void> {
        try {
            const result: UploadResult = await this.coreCollector.upload();
            if (!result) {
                // nothing to upload
            } else if (result.error) {
                throw result.error;
            }
            this._updateCoreCollectorStats();
        } catch (err) {
            const result: UploadResult = err as UploadResult;
            if (result.error) {
                err = result.error;
            }
            // TODO: Remove "as any" when types are fixed
            this._instrApp.error(err as any, 'Failed upload');
        }
    }

    handleMetricAdd(): void {
        this._updateCoreCollectorStats();
    }

    private _updateCoreCollectorStats(): void {
        this.ccMsgCount = this.coreCollector.messagesCount;
        this.ccMetricCount = this.coreCollector.metricsCount;
    }

    handleCoreCollectorOptionsChange(
        event: CustomEvent<EventDetail<CoreCollectorPlayOptions>>
    ): void {
        const options: CoreCollectorPlayOptions = event.detail.value;

        this.ccUploadMode = options.uploadMode;
        this.ccUploadEndpoint = options.uploadEndpoint;
        this.ccUploadInterval = options.uploadInterval;
        this.bearerToken = options.bearerToken;

        this._updateCoreCollectorOptions();

        if (this.bearerToken) {
            this.overrideFetch();
        } else {
            this.restoreFetch();
        }
    }
}
