import { LightningElement, api, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Activity as O11yActivity, Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { ComponentUtils } from '../../shared/componentUtils';

export default class Activity extends LightningElement {
    private _isRunning = false;
    get isRunning(): boolean {
        return this._isRunning;
    }
    set isRunning(value) {
        this._isRunning = value;
        this.isNotRunning = !value;
    }
    @track
    isNotRunning = !this._isRunning;

    @api
    activityName: string;

    private readonly _instr: Instrumentation;
    private _activity: O11yActivity;

    constructor() {
        super();
        this._instr = getInstrumentation('activity');
    }

    handleToggle(): void {
        if (!this.isRunning) {
            this._activity = this._instr.startActivity(this.activityName);
            this.isRunning = true;
        } else {
            this._activity.stop();
            this.isRunning = false;
        }
    }

    handleError(): void {
        this._activity.error(new Error(`An error associated with ${this.activityName}`));
    }

    handleActivityNameChange(event: CustomEvent): void {
        ComponentUtils.raiseEvent(this, 'namechange', event.detail.value);
    }
}
