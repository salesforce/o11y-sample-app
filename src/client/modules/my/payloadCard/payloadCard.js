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
class PayloadCard extends lwc_1.LightningElement {
    get model() {
        return this._model;
    }
    set model(value) {
        this._model = value;
        if (!value) {
            this.schemaName = undefined;
            this.payload = undefined;
        }
        else {
            this.schemaName = value.schema ? `${value.schema.namespace}.${value.schema.name}` : undefined;
            this.payload = utility_1.utility.getKeyValues(value.payload);
        }
    }
}
__decorate([
    lwc_1.track
], PayloadCard.prototype, "schemaName", void 0);
__decorate([
    lwc_1.track
], PayloadCard.prototype, "payload", void 0);
__decorate([
    lwc_1.api
], PayloadCard.prototype, "header", void 0);
__decorate([
    lwc_1.api
], PayloadCard.prototype, "model", null);
exports.default = PayloadCard;
