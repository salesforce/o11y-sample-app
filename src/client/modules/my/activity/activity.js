// <
import { LightningElement, track, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';

export default class Activity extends LightningElement {
    @track
    isRunning = false;

    @api
    activityName;

    instr;
    activity;

    constructor() {
        super();
        this.instr = getInstrumentation('activity');
    }

    handleToggle() {
        if (!this.isRunning) {
            this.activity = this.instr.startActivity(this.activityName);
            this.isRunning = true;
        } else {
            this.activity.stop();
            this.isRunning = false;
        }
    }
}
