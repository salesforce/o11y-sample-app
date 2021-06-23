import { LightningElement } from 'lwc';
import { registerInstrumentedApp, ConsoleCollector, CoreCollector } from 'o11y/client';
import { AppPayloadProvider } from '../../../appPayloadProvider';
import { PagePayloadProvider } from '../../../pagePayloadProvider';

// #LOOK: 
// The sample app comes with a built-in Express webserver, that defaults to port 3002.
// You can set this to the salesforce endpoint in the form:
// {ServerUrl}/services/data/{API version}/connect/proxy/ui-telemetry
// Example: const apiEndpoint = 'https://{HOSTNAME}/services/data/v52.0/connect/proxy/ui-telemetry';
const apiEndpoint = 'http://localhost:3002/api/uitelemetry';

// #LOOK: 
// If using a Salesforce endpoint, you must specify a bearerToken for authorization. 
// It can be either an Oauth2 access token or a session ID. 
// If you have Salesforce running locally, go to /qa/getUserSession.jsp to get a session ID. 
// If using the webserver included in this app, leave the bearerToken empty.
const bearerToken = '';

// #LOOK:
// Salesforce server end points typically enforce CORS and CSP. To use the sample app with a Salesforce endpoint,
// you may need to configure or bypass CORS and CSP. You have a couple of options:
//
// 1. Configure CORS on the server (https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/extend_code_cors.htm#)
//    1.1. From Setup, enter CORS in the Quick Find box, then select CORS.
//    1.2. Select New
//    1.3. Enter the origin URL pattern. If you're using the defaults, you can set it to "http://localhost:3001". 
//         You may not be able to set a CORS entry without https. In this case, and assuming your machine is 
//         in the internal Salesforce network, you can use the FQDN as follows: "https://YOURMACHINE.internal.salesforce.com:3001".
//
// 2. Another options is to disable CORS on the browser with the help of certain browser extensions. 
//    DISCLAIMER: These extensions are not endorsed by Salesforce and you are using them at your own risk.
//    2.1. Cross Domain - CORS: https://chrome.google.com/webstore/detail/cross-domain-cors/mjhpgnbimicffchbodmgfnemoghjakai/related
//    2.2. Disable Content-Security-Policy: https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden/related

export default class App extends LightningElement {

    labelIntro = 'Getting Started';
    labelEvents = 'Instrumenting DOM Events';
    labelErrors = 'Error Logging';
    labelActivities = 'Activity Tracking';
    labelCustom = 'Custom Logs';
    labelIdleDetector = 'Idle Detector';
    labelServer = 'Server Side';
    // If adding a new label and a corrsponding section, update this.startRootActivity

    sectionIntro = 'section_intro';
    sectionEvents = 'section_events';
    sectionErrors = 'section_errors';
    sectionActivities = 'section_activities';
    sectionCustom = 'section_logs';
    sectionIdleDetector = 'section_idle_detector';
    sectionServer = 'section_server';

    sectionToLabelMap = new Map()
        .set(this.sectionIntro, this.labelIntro)
        .set(this.sectionEvents, this.labelEvents)
        .set(this.sectionErrors, this.labelErrors)
        .set(this.sectionActivities, this.labelActivities)
        .set(this.sectionCustom, this.labelCustom)
        .set(this.sectionIdleDetector, this.labelIdleDetector)
        .set(this.sectionServer, this.labelServer);

    isRendered = false;
    clickTrackActive = false;
    selectedSection = this.sectionIntro;
    logs = [];
    rootActivity;
    entityType = 'section';
    pagePayloadProvider;

    // Try to keep these values in sync with values from package.json
    environment = {
        appName: 'o11y-sample-app',
        appVersion: '1.0',
        appExperience: 'Sample Experience',
        deviceId: 'Unknown Device ID',
        deviceModel: 'Unknown Device Model',
        sdkVersion: 'o11y=0.074;o11ySchema=1.5.0'
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

    initializeInstrumentation() {
        // The top-level entity (the app) must initialize instrumentation before use.
        // Components can directly use the getInstrumentation import from 'o11y/client'.        
        
        // STEP 0: (Optional) Instantiate AppPayloadProvider, PagePayloadProvider
        this.pagePayloadProvider = new PagePayloadProvider(this.selectedSection, this.entityType);

        // STEP 1: Register the app
        this.instrApp = registerInstrumentedApp('o11y Sample App', {
            isProduction: false,
            appPayloadProvider: new AppPayloadProvider(),
            pagePayloadProvider: this.pagePayloadProvider
        });

        // STEP 2: Register log collectors
        this.instrApp.registerLogCollector(new ConsoleCollector());
        this.instrApp.registerLogCollector(this);   // See 'collect' method
        const coreCollector = this.getCoreCollector();
        this.instrApp.registerLogCollector(coreCollector);

        // STEP 3: Register a metrics collector
        this.instrApp.registerMetricsCollector(coreCollector);

        // STEP 4: Activate the automatic click tracker via the following call:
        // this.instrApp.activateClickTracker();
        // For the sample app, we will leave it up to the user turn it on/off as needed
    }

    getCoreCollector() {
        let coreCollectorMode = 0; // Use application/octet-stream by default
        // #LOOK:
        // If the endpoint requires auth header, you may need to update the check below
        if (apiEndpoint.indexOf('.salesforce.com') >= 0 || apiEndpoint.indexOf('.force.com') >= 0) {
            this.overrideFetch(); // Include authorization header in the calls
            coreCollectorMode = 1; // Use multipart/form-data for Salesforce app
        }
        return new CoreCollector(apiEndpoint, coreCollectorMode, this.environment);
    }

    collect(schema, message, logMeta) {
        const schemaId = `${schema.namespace}.${schema.name}`;
        const model = Object.assign({}, logMeta);
        Object.assign(model, {
            schemaId,
            msg: message,
            _isActivity: this.isActivity(schemaId),
            _isError: this.isError(schemaId),
            _isInstrumentedEvent: this.isInstrumentedEvent(schemaId),
            _isO11ySample: this.isCustom(schemaId),
            _isUnknown: this.isUnknown(schemaId),
        });
        this.logs = [model, ...this.logs];
    };

    getIsDisabled() {
        // As a collector
        return false;
    }

    isActivity(schemaId) {
        return schemaId === 'sf.instrumentation.Activity';
    }

    isError(schemaId) {
        return schemaId === 'sf.instrumentation.Error';
    }

    isInstrumentedEvent(schemaId) {
        return schemaId === 'sf.instrumentation.InstrumentedEvent';
    }

    isCustom(schemaId) {
        return schemaId === 'sf.instrumentation.O11ySample';
    }

    isUnknown(schemaId) {
        return !this.isActivity(schemaId) && !this.isError(schemaId) && !this.isInstrumentedEvent(schemaId) && !this.isCustom(schemaId);
    }

    overrideFetch() {
        const addHeaders = {
            Authorization: `Bearer ${bearerToken}`
        };
        const fetchOrig = window.fetch;
        window.fetch = function (input, init) {
            console.log('Fetch');
            if (input === apiEndpoint) {
                init = init || {};
                init.headers = Object.assign(init.headers || {}, addHeaders);
            }
            return fetchOrig.call(this, input, init);
        };
    }

    handleToggleAct() {
        if (this.clickTrackActive) {
            this.clickTrackActive = false;
            this.instrApp.deactivateClickTracker();
        } else {
            this.clickTrackActive = true;
            this.instrApp.activateClickTracker();
        }
    }

    handleClearLogs() {
        this.logs = [];
    }

    handleTabSelect(event) {
        const section = this.selectedSection = event.currentTarget.value;
        this.pagePayloadProvider.setEntityInfo(section, this.entityType);

        window.location.hash = section && section.substring(section.indexOf('_') + 1);
        this.startRootActivity(section);
    }

    startRootActivity(section) {
        if (this.rootActivity) {
            // If rootActivity is not stopped explicitly, it will be terminated.
            this.rootActivity.stop();
        }
        const label = this.sectionToLabelMap.get(section) || 'Unknown Section';
        this.rootActivity = this.instrApp.startRootActivity(label);
    }
}
