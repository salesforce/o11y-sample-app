"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagePayloadProvider = void 0;
const sf_o11ySample_1 = require("o11y_schema/sf_o11ySample");
class PagePayloadProvider {
    constructor(entityId, entityType) {
        this.setEntityInfo(entityId, entityType);
    }
    setEntityInfo(id, type) {
        this._entityId = id;
        this._entityType = type;
    }
    getPayload() {
        return {
            schema: sf_o11ySample_1.pagePayloadSchema,
            payload: {
                url: window.location.href,
                entityId: this._entityId,
                entityType: this._entityType
            }
        };
    }
}
exports.PagePayloadProvider = PagePayloadProvider;
