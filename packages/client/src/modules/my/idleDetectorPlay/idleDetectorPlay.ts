import { LightningElement, track } from 'lwc';
import { getInstrumentation, idleDetector } from 'o11y/client';
import { TaskerMulti } from 'o11y/dist/modules/o11y/client/interfaces/IdleDetector';
import { userPayloadSchema } from 'o11y_schema/sf_o11ySample';

declare type fetchType = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export default class IdleDetectorPlay extends LightningElement {
    @track
    idleRequestCount = 0;

    private readonly _instr;
    private _fetchOriginal: fetchType;
    private readonly _fetchTaskerMulti: TaskerMulti;

    constructor() {
        super();
        this._instr = getInstrumentation('IdleDetector Play');
        this._fetchTaskerMulti = idleDetector.declareNotifierTaskMulti('fetch');
    }

    get isFetchOverridden() {
        return this._fetchOriginal !== undefined;
    }

    handleIdleRequest() {
        this.idleRequestCount += 1;
        idleDetector.requestIdleDetectedCallback((timestamp) => {
            this.idleRequestCount -= 1;
            this._instr.log(userPayloadSchema, {
                double: timestamp
            });
        });
    }

    handleToggleFetchOverrideClick(): void {
        if (this.isFetchOverridden) {
            window.fetch = this._fetchOriginal;
            this._fetchOriginal = undefined;
        } else {
            this._fetchOriginal = window.fetch;
            const that = this;
            window.fetch = async function () {
                try {
                    that._fetchTaskerMulti.add();
                    return await that._fetchOriginal.apply(window, arguments as any);
                } finally {
                    that._fetchTaskerMulti.done();
                }
            }.bind(window);
        }
    }

    handleHighCpu(): void {
        this.handleIdleRequest();
        for (let i = 0; i < 1000000000; i += 0.3) {}
    }
}
