import { LightningElement } from 'lwc';

import {
    getInstrumentation,
    registerInstrumentedApp,
    CoreCollector
} from 'next-gen-client/client';

import SampleSchema from './sampleSchema';

const makeSchema = (namespace, name, pbjsSchema) => {
    return {
        namespace,
        name,
        pbjsSchema
    };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleSchema = makeSchema('SampleNamespace', 'SampleName', SampleSchema);

console.log(sampleSchema);

const apiEndpoint = 'http://localhost:3002/api/uitelemetry';

// The bearerToken can be either an Oauth2 access token or a session ID. Use Doppler-CLI to get the former.
// Use your host's /qa/getUserSession.jsp to get a session ID. Do not check this value in.
// If using localhost (server/app.js), leave empty.
const bearerToken = '';

// NOTE: If not using nimbus (i.e. using fetch on a non-local endpoint, you will need to disable CORS on your browser)
// You can use this extension: https://chrome.google.com/webstore/detail/cross-domain-cors/mjhpgnbimicffchbodmgfnemoghjakai
// Note that the above extension interferes with web app functionality.
// You also need to disable Content-Policy-Security headers.
// You can use this extension: https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden
const useNimbus = false;

export default class App extends LightningElement {
    constructor() {
        super();
        if (!useNimbus) {
            this.overrideFetch();
        }

        this.instrApp = registerInstrumentedApp();
        this.instr = getInstrumentation('O11y-Sample-App');

        const coreCollector = new CoreCollector(
            apiEndpoint,
            this.instrApp.getSchemaType,
            useNimbus ? 2 : 0
        );
        this.instrApp.registerCollector(coreCollector);
        this.instrApp.registerCollector(
            new (function () {
                this.collect = (schema, data) => {
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

    log() {
        this.instr.log(sampleSchema, {
            requiredString: `AwesomeName Log ${new Date().toISOString()}`,
            optionalString: Math.random() >= 0.5 ? 'opt' : undefined
        });
    }
}
