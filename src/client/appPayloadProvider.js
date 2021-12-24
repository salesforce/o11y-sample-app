"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPayloadProvider = void 0;
const sf_o11ySample_1 = require("o11y_schema/sf_o11ySample");
class AppPayloadProvider {
    constructor() {
        this._frameCount = 0;
        this._lastFrameRate = 0;
        setInterval(() => {
            this._lastFrameRate = this._frameCount;
            this._frameCount = 0;
        }, 1000);
        this.continuousRaf();
    }
    continuousRaf() {
        requestAnimationFrame(() => {
            this._frameCount += 1;
            this.continuousRaf();
        });
    }
    getPayload() {
        return {
            schema: sf_o11ySample_1.appPayloadSchema,
            payload: {
                language: navigator.language,
                frameRate: this._lastFrameRate
            }
        };
    }
}
exports.AppPayloadProvider = AppPayloadProvider;
