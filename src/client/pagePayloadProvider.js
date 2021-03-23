import { o11ySamplePageSchema } from 'o11ySchema/sf_instrumentation';

export class PagePayloadProvider {
    constructor() {
        this.frameCount = 0;
        this.lastFrameRate = 0;

        setInterval(() => {
            this.lastFrameRate = this.frameCount;
            this.frameCount = 0;
            console.log(`Frame Rate ${this.lastFrameRate}`);
        }, 1000);

        this.continuousRaf();
    }

    continuousRaf() {
        requestAnimationFrame(() => {
            this.frameCount += 1;
            this.continuousRaf();
        });
    }

    getPagePayload() {
        return {
            schema: o11ySamplePageSchema,
            data: {
                url: window.location.href,
                language: navigator.language,
                frameRate: this.lastFrameRate
            }
        };
    }
}