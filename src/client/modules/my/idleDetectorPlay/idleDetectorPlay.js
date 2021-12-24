"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lwc_1 = require("lwc");
const client_1 = require("o11y/client");
const sf_o11ySample_1 = require("o11y_schema/sf_o11ySample");
class IdleDetectorPlay extends lwc_1.LightningElement {
    constructor() {
        super();
        this.idleRequestCount = 0;
        this._instr = (0, client_1.getInstrumentation)('IdleDetector Play');
        this._fetchTaskerMulti = client_1.idleDetector.declareNotifierTaskMulti('fetch');
    }
    get isFetchOverridden() {
        return this._fetchOriginal !== undefined;
    }
    handleIdleRequest() {
        this.idleRequestCount += 1;
        client_1.idleDetector.requestIdleDetectedCallback((timestamp) => {
            this.idleRequestCount -= 1;
            this._instr.log(sf_o11ySample_1.userPayloadSchema, {
                double: timestamp
            });
        });
    }
    handleToggleFetchOverrideClick() {
        if (this.isFetchOverridden) {
            window.fetch = this._fetchOriginal;
            this._fetchOriginal = undefined;
        }
        else {
            this._fetchOriginal = window.fetch;
            const that = this;
            window.fetch = function () {
                return __awaiter(this, arguments, void 0, function* () {
                    try {
                        that._fetchTaskerMulti.add();
                        return yield that._fetchOriginal.apply(window, arguments);
                    }
                    finally {
                        that._fetchTaskerMulti.done();
                    }
                });
            }.bind(window);
        }
    }
    handleHighCpu() {
        this.handleIdleRequest();
        for (let i = 0; i < 1000000000; i += 0.3) {
        }
    }
}
__decorate([
    lwc_1.track
], IdleDetectorPlay.prototype, "idleRequestCount", void 0);
exports.default = IdleDetectorPlay;
