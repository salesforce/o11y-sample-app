import { o11ySamplePagePayloadSchema } from 'o11ySchema/sf_instrumentation';

export class PagePayloadProvider {
    constructor(entityId, entityType) {
        this.setEntityInfo(entityId, entityType);
    }

    setEntityInfo(id, type) {
        this._entityId = id;
        this._entityType = type;
    }

    getPayload() {
        return {
            schema: o11ySamplePagePayloadSchema,
            payload: {
                url: window.location.href,
                entityId: this._entityId,
                entityType: this._entityType
            }
        };
    }
}