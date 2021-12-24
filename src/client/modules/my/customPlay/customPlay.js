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
const sf_o11ySample_1 = require("o11y_schema/sf_o11ySample");
class CustomPlay extends lwc_1.LightningElement {
    constructor() {
        super();
        this._instr = (0, client_1.getInstrumentation)('Custom Play');
    }
    handleSubmit() {
        const inputs = this.template.querySelectorAll('lightning-input');
        const logData = {};
        inputs.forEach((element) => {
            const val = element.value;
            const isEmpty = val === '' || val === undefined;
            switch (element.name) {
                case 'inputBool':
                    if (!isEmpty) {
                        logData.bool = val === 'true' || (val === 'false' ? false : val);
                    }
                    break;
                case 'inputString':
                    logData.string = String(val);
                    break;
                case 'inputInt32':
                    if (!isEmpty) {
                        logData.int32 = Number(val);
                    }
                    break;
                case 'inputInt64':
                    if (!isEmpty) {
                        logData.int64 = Number(val);
                    }
                    break;
                case 'inputUint32':
                    if (!isEmpty) {
                        logData.uint32 = Number(val);
                    }
                    break;
                case 'inputUint64':
                    if (!isEmpty) {
                        logData.uint64 = Number(val);
                    }
                    break;
                case 'inputDouble':
                    if (!isEmpty) {
                        logData.double = Number(val);
                    }
                    break;
                case 'inputIgnored':
                    // This field isn't part of the schema
                    logData.ignored = val;
                    break;
                default:
                    this._instr.error(new Error(`Undefined input name ${element.name}`));
                    return;
            }
        });
        try {
            // This will throw in development-mode if the logData has invalid values per the schema
            this._instr.log(sf_o11ySample_1.userPayloadSchema, logData);
        }
        catch (ex) {
            this._instr.error(ex);
        }
    }
}
__decorate([
    lwc_1.api
], CustomPlay.prototype, "model", void 0);
exports.default = CustomPlay;
