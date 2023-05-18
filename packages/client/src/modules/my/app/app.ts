import { LightningElement, track } from 'lwc';
import { registerInstrumentedApp, ConsoleCollector } from 'o11y/client';
import { CoreCollector } from 'o11y/collectors';
import { webVitals } from 'o11y/web_vitals';
import { AppPayloadProvider } from '../../../appPayloadProvider';
import { PagePayloadProvider } from '../../../pagePayloadProvider';
import { NetworkOptions } from '../../models/networkOptions';
import { utility } from '../../../utility';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';

import {
    Activity,
    InstrumentedAppMethods,
    LogCollector,
    LogMeta,
    Schema
} from 'o11y/dist/modules/o11y/client/interfaces';
import { CoreCollector as CoreCollectorType } from 'o11y/dist/modules/o11y/collectors/collectors';
import { SchematizedData } from 'o11y/dist/modules/o11y/shared/shared/TypeDefinitions';
import { endpoints } from '../../shared/endpoints';
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
    @track labelLogAccumulation = 'Log Accumulation';
    @track labelUtilities = 'Utilities';
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
    @track sectionLogAccumulation = 'section_log_accumulation';
    @track sectionUtilities = 'section_utilities';

    private readonly _sectionToLabelMap = new Map<string, string>()
        .set(this.sectionIntro, this.labelIntro)
        .set(this.sectionEvents, this.labelEvents)
        .set(this.sectionErrors, this.labelErrors)
        .set(this.sectionActivities, this.labelActivities)
        .set(this.sectionCustom, this.labelCustom)
        .set(this.sectionIdleDetector, this.labelIdleDetector)
        .set(this.sectionServer, this.labelServer)
        .set(this.sectionNetwork, this.labelNetwork)
        .set(this.sectionMetrics, this.labelMetrics)
        .set(this.sectionLogAccumulation, this.labelLogAccumulation)
        .set(this.sectionUtilities, this.labelUtilities);

    private readonly _entityType = 'section';
    private _instrApp: InstrumentedAppMethods;
    private _fetchOrig: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    private _rootActivity: Activity;
    private _pagePayloadProvider: PagePayloadProvider;
    private _coreCollector: CoreCollectorType;

    @track clickTrackActive = false;
    @track selectedSection = this.sectionIntro;
    @track logs: LogModel[] = [];
    @track network = new NetworkOptions();
    @track bearerToken = '';
    @track ccMsgCount: number;
    @track ccMetricCount: number;
    @track ccUploadInterval: number = utility.maxInt; // Note: Cannot use Infinity with setTimeout per MDN
    @track ccUploadMode: UploadMode = 0; // TODO: Use UploadMode.fetchBinary directly when it's exported
    @track ccUploadEndpoint: string = endpoints.sampleTelemetryEndpoint;
    @track showCoreCollectorStats: boolean;

    @track readonly environment = {
        appName: 'o11y-sample-app',
        appVersion: '0.0', // Keep this up-to-date with minor build in package.json
        appExperience: 'Sample',
        deviceId: 'Unknown',
        deviceModel: 'Unknown',
        sdkVersion: '246' // Keep this up-to-date with the major version
    };

    constructor() {
        super();
        this._initializeInstrumentation();
        window.addEventListener('beforeunload', () => {
            if (this._rootActivity) {
                this._rootActivity.stop();
            }
        });
    }

    private _initializeInstrumentation(): void {
        // The top-level entity (the app) must initialize instrumentation before use.
        // Components can directly use the getInstrumentation import from 'o11y/client'.

        // STEP 0: (Optional) Instantiate AppPayloadProvider, PagePayloadProvider
        this._pagePayloadProvider = new PagePayloadProvider(this.selectedSection, this._entityType);

        // STEP 1: Register the app
        this._instrApp = registerInstrumentedApp('o11y Sample App', {
            isProduction: false,
            appPayloadProvider: new AppPayloadProvider(),
            pagePayloadProvider: this._pagePayloadProvider
        });
        webVitals.activate(this._instrApp);

        // STEP 2: Register log collectors
        this._instrApp.registerLogCollector(new ConsoleCollector());
        this._instrApp.registerLogCollector(this); // See 'collect' method
        this._coreCollector = this._getCoreCollector();
        this._updateShowCoreCollectorStats();
        this._updateCoreCollectorStats();
        this._instrApp.registerLogCollector(this._coreCollector);
        this._instrApp.registerLogCollector({
            // This "collector" will be run every time a collection happens,
            // and is a good place for us to update core collector stats.
            collect: () => {
                this._updateCoreCollectorStats();
            }
        });

        // STEP 3: Register a metrics collector
        this._instrApp.registerMetricsCollector(this._coreCollector);

        // STEP 4: Activate the automatic click tracker via the following call:
        // this.instrApp.activateClickTracker();
        // For the sample app, we will leave it up to the user turn it on/off as needed

        // STEP 5: Optional: Enable network instrumentation
        // this.instrApp.networkInstrumentation(true);
        // For the sample app, we will leave it up to the user turn it on/off as needed
    }

    private _getCoreCollector(): CoreCollectorType {
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

    private _updateShowCoreCollectorStats(): void {
        // We don't know when the core collector has automatically uploaded and therefore has
        // modified the collector stats without notice. Therefore, we only choose to show
        // the stats for max values.
        const before = this.showCoreCollectorStats;
        this.showCoreCollectorStats = this._coreCollector.uploadInterval === utility.maxInt;

        // Return true if we started showing collector stats.
        if (!before && this.showCoreCollectorStats) {
            // If the value has changed and we're showing stats, make sure they're up-to-date.
            this._updateCoreCollectorStats();
        }
    }

    collect(schema: Schema, message: SchematizedData, logMeta: LogMeta): void {
        const schemaId = `${schema.namespace}.${schema.name}`;
        const model: LogModel = Object.assign({}, logMeta);
        Object.assign(model, {
            schemaId,
            msg: message,
            _isActivity: schemaUtil.isActivity(schemaId),
            _isError: schemaUtil.isError(schemaId),
            _isInstrumentedEvent: schemaUtil.isInstrumentedEvent(schemaId),
            _isO11ySimple: schemaUtil.isSimple(schemaId),
            _isO11ySample: schemaUtil.isSample(schemaId),
            _isUnknown: schemaUtil.isUnknown(schemaId)
        });
        this.logs = [model, ...this.logs];
    }

    private _overrideFetch(): void {
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

    private _restoreFetch(): void {
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
            this._instrApp.activateClickTracker();
        }
    }

    handleClearLogs(): void {
        this.logs = [];
    }

    handleTabSelect(event: CustomEvent): void {
        const section = (this.selectedSection = (event.currentTarget as any).value);
        this._pagePayloadProvider.setEntityInfo(section, this._entityType);

        window.location.hash = section && section.substring(section.indexOf('_') + 1);
        this._startRootActivity(section);
    }

    private _startRootActivity(section: string): void {
        if (this._rootActivity) {
            // If rootActivity is not stopped explicitly, it will be terminated.
            this._rootActivity.stop();
        }
        const label = this._sectionToLabelMap.get(section) || 'Unknown Section';
        const isSampled = this.network.sampleRate > Math.random() * 100;
        this._rootActivity = this._instrApp.startRootActivity(label, undefined, isSampled);
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
            const result: UploadResult = await this._coreCollector.upload();
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
        this.ccMsgCount = this._coreCollector.messagesCount;
        this.ccMetricCount = this._coreCollector.metricsCount;
    }

    handleCoreCollectorOptionsChange(
        event: CustomEvent<EventDetail<CoreCollectorPlayOptions>>
    ): void {
        const options: CoreCollectorPlayOptions = event.detail.value;

        this._coreCollector.uploadMode = this.ccUploadMode = options.uploadMode;
        this._coreCollector.uploadEndpoint = this.ccUploadEndpoint = options.uploadEndpoint;
        this._coreCollector.uploadInterval = this.ccUploadInterval = options.uploadInterval;
        this._updateShowCoreCollectorStats();

        this.bearerToken = options.bearerToken;
        if (this.bearerToken) {
            this._overrideFetch();
        } else {
            this._restoreFetch();
        }
    }

    handlePromptRequest() {
        this._instrApp.promptLogCollection('Prompt Requested');
    }
}
