import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { ComponentUtils } from '../../shared/componentUtils';

export default class Activity extends LightningElement {
    _isRunning = false;
    get isRunning() {
        return this._isRunning;
    }
    set isRunning(value) {
        this._isRunning = value;
        this.isNotRunning = !value;
    }    
    isNotRunning = !this._isRunning;

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

    handleError() {
        this.activity.error(new Error(`An error associated with ${this.activityName}`));
    }

    handleActivityNameChange(event) {
        ComponentUtils.raiseEvent(this, 'namechange', event.detail.value);
    }
}
