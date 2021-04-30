import { o11ySamplePageSchema } from 'o11ySchema/sf_instrumentation';

export class PagePayloadProvider {
    getPayload() {
        return {
            schema: o11ySamplePageSchema,
            payload: {
                url: window.location.href,
                language: navigator.language
            }
        };
    }
}