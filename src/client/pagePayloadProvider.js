import { pagePayloadSchema } from 'o11y_schema/sf_o11ySample';

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
            schema: pagePayloadSchema,
            payload: {
                url: window.location.href,
                entityId: this._entityId,
                entityType: this._entityType
            }
        };
    }
}