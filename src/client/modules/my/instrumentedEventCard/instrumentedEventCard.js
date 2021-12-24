"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
const utility_1 = require("../../../utility");
class InstrumentedEventCard extends lwc_1.LightningElement {
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        const topItems = utility_1.utility.getFilteredKeyValues();
        const msgItems = value && utility_1.utility.getKeyValues(value.msg).filter(obj => obj.key !== 'userPayload' && obj.key !== 'event');
        this.keyValues = [...topItems, ...msgItems];
        this.userPayload = value && value.msg && value.msg.userPayload;
        this.eventKeyValues = value && value.msg && utility_1.utility.getKeyValues(value.msg.event);
    }
    handleToggle() {
        this.isExpanded = !this.isExpanded;
    }
}
__decorate([
    lwc_1.track
], InstrumentedEventCard.prototype, "isExpanded", void 0);
__decorate([
    lwc_1.track
], InstrumentedEventCard.prototype, "keyValues", void 0);
__decorate([
    lwc_1.track
], InstrumentedEventCard.prototype, "userPayload", void 0);
__decorate([
    lwc_1.track
], InstrumentedEventCard.prototype, "eventKeyValues", void 0);
__decorate([
    lwc_1.api
], InstrumentedEventCard.prototype, "model", null);
exports.default = InstrumentedEventCard;
