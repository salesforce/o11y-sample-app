import { LightningElement } from 'lwc';

// #LOOK: the import path is subject to change
import { registerInstrumentedApp, CoreCollector } from 'o11y/client';

import { ollySampleSchema } from '../../../../schemas/exports/KnownSchemas';
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
    selectedNav = 'getting_started';
    logs = [];

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

        // STEP 4: Activate the automatic click tracker
        this.toggleClickTracker();
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
            schemaId: `${schema.namespace}.${schema.name}`,
            timestamp: logMeta.timestamp,
            rootId: logMeta.rootId,
            seq: logMeta.sequence,
            msg: message,
            isActivity: this.isActivity(schemaId),
            isError: this.isError(schemaId),
            isInstrumentedEvent: this.isInstrumentedEvent(schemaId),
            isO11ySample: this.isO11ySample(schemaId),
            isCustom: this.isCustom(schemaId),
        };
        this.logs = this.logs.concat(model);
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

    isO11ySample(schemaId) {
        return schemaId === 'sf.instrumentation.OllySample';
    }


    isCustom(schemaId) {
        return !this.isActivity(schemaId) && !this.isError(schemaId) && !this.isInstrumentedEvent(schemaId) && !this.isO11ySample(schemaId);
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

    toggleClickTracker() {
        if (this.clickTrackActive) {
            this.clickTrackActive = false;
            this.instrApp.deactivateClickTracker();
        } else {
            this.clickTrackActive = true;
            this.instrApp.activateClickTracker();
        }
    }

    domEvent(event) {
        this.instrApp.domEvent(event, this);
    }

    domEventWithSchema(event) {
        this.instrApp.domEvent(event, this, ollySampleSchema, {
            text: 'Demonstrates optional data accompanying the DomEvent',
            integerValue: Date.now()
        });
    }

    handleLogCustom() {
        this.instrApp.log(ollySampleSchema, {
            text: 'Demonstrates custom log',
            integerValue: Math.floor(Math.random() * 2147483647)
        });
    }

    handleErrorClick() {
        try {
            throw new Error('User initiated exception');
        } catch (ex) {
            this.instrApp.error(ex);
        }
    }

    handleNavigationSelect(event) {
        const newNav = event.detail.name;
        if (newNav !== this.selectedNav) {
            console.log(newNav);
            this.selectedNav = newNav;
        }
    }
}
