import { appPayloadSchema } from 'o11y_schema/sf_o11ySample';

export class AppPayloadProvider {
    constructor() {
        this.frameCount = 0;
        this.lastFrameRate = 0;

        setInterval(() => {
            this.lastFrameRate = this.frameCount;
            this.frameCount = 0;
        }, 1000);

        this.continuousRaf();
    }

    continuousRaf() {
        requestAnimationFrame(() => {
            this.frameCount += 1;
            this.continuousRaf();
        });
    }

    getPayload() {
        return {
            schema: appPayloadSchema,
            payload: {
                language: navigator.language,
                frameRate: this.lastFrameRate
            }
        };
    }
}