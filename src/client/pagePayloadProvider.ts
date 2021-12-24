import { SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';
import { pagePayloadSchema } from 'o11y_schema/sf_o11ySample';

export class PagePayloadProvider {
    private _entityId: string;
    private _entityType: string;

    constructor(entityId: string, entityType: string) {
        this.setEntityInfo(entityId, entityType);
    }

    setEntityInfo(id: string, type: string): void {
        this._entityId = id;
        this._entityType = type;
    }

    getPayload(): SchematizedPayload {
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