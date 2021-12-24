"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
const client_1 = require("o11y/client");
const componentUtils_1 = require("../../shared/componentUtils");
class Activity extends lwc_1.LightningElement {
    constructor() {
        super();
        this._isRunning = false;
        this.isNotRunning = !this._isRunning;
        this._instr = (0, client_1.getInstrumentation)('activity');
    }
    get isRunning() {
        return this._isRunning;
    }
    set isRunning(value) {
        this._isRunning = value;
        this.isNotRunning = !value;
    }
    handleToggle() {
        if (!this.isRunning) {
            this._activity = this._instr.startActivity(this.activityName);
            this.isRunning = true;
        }
        else {
            this._activity.stop();
            this.isRunning = false;
        }
    }
    handleError() {
        this._activity.error(new Error(`An error associated with ${this.activityName}`));
    }
    handleActivityNameChange(event) {
        componentUtils_1.ComponentUtils.raiseEvent(this, 'namechange', event.detail.value);
    }
}
__decorate([
    lwc_1.track
], Activity.prototype, "isNotRunning", void 0);
__decorate([
    lwc_1.api
], Activity.prototype, "activityName", void 0);
exports.default = Activity;
