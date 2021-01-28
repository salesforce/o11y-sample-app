import { LightningElement } from 'lwc';

// #LOOK: the import path is subject to change
import {
    getInstrumentation,
    registerInstrumentedApp,
    CoreCollector
} from 'next-gen-client/dist/client';

import { ollySampleSchema } from '../../../../schemas/exports/KnownSchemas';

// The sample app comes with a built-in Express webserver, that defaults to port 3002.
const apiEndpoint = 'http://localhost:3002/api/uitelemetry';

// #LOOK: 
// If using a Salesforce endpoint, you must specify a bearerToken for authorization. 
// It can be either an Oauth2 access token or a session ID. 
// If you have Salesforce running locally, go to /qa/getUserSession.jsp to get a session ID. 
// If using the webserver included in this app, leave the bearerToken empty.
const bearerToken = '';

export default class App extends LightningElement {
    constructor() {
        super();
        this.initializeInstrumentation();
    }

    initializeInstrumentation() {
        let collectorMode = 0; // Use application/octet-stream by default

        if (apiEndpoint.indexOf('salesforce.com') >= 0) {
            this.overrideFetch(); // Include authorization header in the calls
            collectorMode = 1; // Use multipart/form-data for Salesforce app
        }

        this.instrApp = registerInstrumentedApp();
        this.instr = getInstrumentation('o11y-sample-App'); // Remember to provide your own app name

        const coreCollector = new CoreCollector(
            apiEndpoint,
            this.instrApp.getSchemaType,
            collectorMode
        );
        this.instrApp.registerLogCollector(coreCollector);
        this.instrApp.registerLogCollector(
            new (function () {
                this.collect = (_schema, data) => {
                    console.log(data);
                };
            })()
        );
        this.instrApp.registerMetricsCollector(coreCollector);

        this.toggleClickTracker();
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
            this.instrApp.deactivateClickTracker(this.instr);
        } else {
            this.clickTrackActive = true;
            this.instrApp.activateClickTracker(this.instr);
        }
    }

    domEvent(event) {
        this.instr.domEvent(event, this);
    }

    domEventWithSchema(event) {
        this.instr.domEvent(event, this, ollySampleSchema, {
            text: 'Demonstrates optional data accompanying the DomEvent',
            integerValue: Date.now()
        });
    }

    swapSidebarActive(selection) {
        if (!this.currentSidebar) {
            this.currentSidebar = main.getElementsByClassName("getting-started-sidebar")[0];
        }
        if (selection.target.parentNode !== this.currentSidebar) {
            const newSidebar = selection.target.parentNode;
            const oldSidebar = this.currentSidebar;
            oldSidebar.classList.remove("slds-is-active");
            newSidebar.classList.add("slds-is-active");
            this.currentSidebar = newSidebar;
        }
    }

    handleLogCustom() {
        this.instr.log(ollySampleSchema, {
            text: 'Demonstrates custom log',
            integerValue: Date.now()
        });
    }
}
