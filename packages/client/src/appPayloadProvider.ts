import { SchematizedPayload } from 'o11y/dist/modules/o11y/client/interfaces';
import { appPayloadSchema } from 'o11y_schema/sf_o11ySample';

export class AppPayloadProvider {
    private _frameCount: number;
    private _lastFrameRate: number;

    constructor() {
        this._frameCount = 0;
        this._lastFrameRate = 0;

        setInterval(() => {
            this._lastFrameRate = this._frameCount;
            this._frameCount = 0;
        }, 1000);

        this.continuousRaf();
    }

    continuousRaf(): void {
        requestAnimationFrame(() => {
            this._frameCount += 1;
            this.continuousRaf();
        });
    }

    getPayload(): SchematizedPayload {
        return {
            schema: appPayloadSchema,
            payload: {
                language: navigator.language,
                frameRate: this._lastFrameRate
            }
        };
    }
}
