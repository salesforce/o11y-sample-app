import { LightningElement } from 'lwc';

// #LOOK: the import path is subject to change
import { registerInstrumentedApp, CoreCollector } from 'o11y/client';

import { o11ySampleSchema } from '../../../../schemas/exports/KnownSchemas';
import { ConsoleCollector } from '../../../consoleCollector';

// The sample app comes with a built-in Express webserver, that defaults to port 3002.
const apiEndpoint = 'http://localhost:3002/api/uitelemetry';

// #LOOK: 
// If using a Salesforce endpoint, you must specify a bearerToken for authorization. 
// It can be either an Oauth2 access token or a session ID. 
// If you have Salesforce running locally, go to /qa/getUserSession.jsp to get a session ID. 
// If using the webserver included in this app, leave the bearerToken empty.
const bearerToken = '';

export default class App extends LightningElement {

    labelIntro = 'Getting Started';
    labelEvents = 'Instrumenting DOM Events';
    labelErrors = 'Error Logging';
    labelActivities = 'Activity Tracking';
    labelCustom = 'Custom Logs';

    sectionIntro = 'section_intro';
    sectionEvents = 'section_events';
    sectionErrors = 'section_errors';
    sectionActivities = 'section_activities';
    sectionCustom = 'section_logs';

    isRendered = false;
    clickTrackActive = false;
    selectedSection = this.sectionIntro;
    logs = [];
    rootActivity;

    constructor() {
        super();
        this.initializeInstrumentation();
    }

    initializeInstrumentation() {
        // The top-level entity (the app) must initialize instrumentation before use.
        // Components can directly use the getInstrumentation import from 'o11y/client'.        

        // STEP 1: Register the app
        this.instrApp = registerInstrumentedApp('o11y-sample-App');

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
        if (apiEndpoint.indexOf('salesforce.com') >= 0) {
            this.overrideFetch(); // Include authorization header in the calls
            coreCollectorMode = 1; // Use multipart/form-data for Salesforce app
        }
        return new CoreCollector(
            apiEndpoint,
            this.instrApp.getSchemaType,
            coreCollectorMode
        );
    }

    collect(schema, message, logMeta) {
        const schemaId = `${schema.namespace}.${schema.name}`;

        const model = {
            seq: logMeta.sequence,
            rootId: logMeta.rootId,
            schemaId: `${schema.namespace}.${schema.name}`,
            timestamp: logMeta.timestamp,
            msg: message,
            _isActivity: this.isActivity(schemaId),
            _isError: this.isError(schemaId),
            _isInstrumentedEvent: this.isInstrumentedEvent(schemaId),
            _isO11ySample: this.isCustom(schemaId),
            _isUnknown: this.isUnknown(schemaId),
        };
        this.logs = [model, ...this.logs];
    };

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
        this.startRootActivity(event.currentTarget.value);
    }

    startRootActivity(section) {
        let label;
        switch (section) {
            case this.sectionIntro: label = this.labelIntro; break;
            case this.sectionEvents: label = this.labelEvents; break;
            case this.sectionErrors: label = this.labelErrors; break;
            case this.sectionActivities: label = this.labelActivities; break;
            case this.sectionCustom: label = this.labelCustom; break;
            default: label = 'Unknown Section'; break;
        }

        if (this.rootActivity) {
            this.rootActivity.stop();
        }
        this.rootActivity = this.instrApp.startRootActivity(label);
    }
}
