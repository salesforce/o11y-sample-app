import { LightningElement, track } from 'lwc';
import { idleDetector } from 'o11y/client';
import { TaskerMulti } from 'o11y/dist/modules/o11y/client/interfaces/IdleDetector';

export default class BusyComponent extends LightningElement {
    @track
    isBusy = false;

    private _taskerMulti: TaskerMulti;

    constructor() {
        super();
        this._taskerMulti = idleDetector.declareNotifierTaskMulti('Busy Work');
    }

    handleClick() {
        this.isBusy = !this.isBusy;
        if (this.isBusy) {
            this._taskerMulti.add();
        } else {
            this._taskerMulti.done();
        }
    }
}
