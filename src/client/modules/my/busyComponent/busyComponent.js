import { LightningElement, track } from 'lwc';
import { idleDetector } from 'o11y/client';

export default class BusyComponent extends LightningElement {
    @track
    isBusy = false;

    taskerMulti;

    constructor() {
        super();
        this.taskerMulti = idleDetector.declareNotifierTaskMulti('Busy Work');
    }

    handleClick() {
        this.isBusy = !this.isBusy;
        if (this.isBusy) {
            this.taskerMulti.add();
        } else {
            this.taskerMulti.done();
        }
    }
}
