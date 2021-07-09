import { LightningElement, track } from 'lwc';
import { getInstrumentation, idleDetector } from 'o11y/client';
import { userPayloadSchema } from 'o11y_schema/sf_o11ySample';


export default class IdleDetectorPlay extends LightningElement {

    @track
    idleRequestCount = 0;

    instr;
    fetchOriginal;
    fetchTaskerMulti;

    constructor() {
        super();
        this.instr = getInstrumentation('IdleDetector Play');
        this.fetchTaskerMulti = idleDetector.declareNotifierTaskMulti('fetch');
    }

    get isFetchOverridden() {
        return this.fetchOriginal !== undefined;
    }

    handleIdleRequest() {
        this.idleRequestCount += 1;
        idleDetector.requestIdleDetectedCallback((timestamp) => {
            this.idleRequestCount -= 1;
            this.instr.log(userPayloadSchema, {
                double: timestamp
            });
        });
    }

    handleToggleFetchOverrideClick() {
        if (this.isFetchOverridden) {
            window.fetch = this.fetchOriginal;
            this.fetchOriginal = undefined;
        } else {
            this.fetchOriginal = window.fetch;
            const that = this;
            window.fetch = async function () {
                try {
                    that.fetchTaskerMulti.add();
                    return await that.fetchOriginal.apply(this, arguments);
                } finally {
                    that.fetchTaskerMulti.done();
                }
            }.bind(window);
        }
    }

    handleHighCpu() {
        this.handleIdleRequest();
        for (let i = 0; i < 1000000000; i += 0.3) {
        }
    }
}