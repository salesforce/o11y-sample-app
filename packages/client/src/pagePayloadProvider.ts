import { PayloadProviderArgs, SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';
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

    // getPayload can take an optional input of PayloadProviderArgs. Below is an example
    // of using an argument from one of the fields. Note that the appPayload is created
    // after the pagePayload, so the app has access to the pagePayload, but not vice-versa.
    getPayload(args: PayloadProviderArgs): SchematizedPayload {
        return {
            schema: pagePayloadSchema,
            payload: {
                url: window.location.href,
                entityId: this._entityId,
                entityType: this._entityType
                
                /* Here is an example of accessing one of the fields on the arguments
                LOG_META_FIELD: args.logMeta.<LOG_META_FIELD> */

                /* Note that the below field would NOT work, since appPayload is not created
                until after pagePayload
                APP_PAYLOAD_FIELD: args.logMeta.appPayload.payload.<APP_PAYLOAD_FIELD> */
            }
        };
    }
}
