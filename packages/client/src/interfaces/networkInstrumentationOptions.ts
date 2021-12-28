import { TracingHeadersOptions } from 'o11y/dist/modules/o11y/client/interfaces';

export interface NetworkInstrumentationOptions {
    logErrors: boolean;
    activityName: string;
    useTracing: boolean;
    tracingHeadersOptions: TracingHeadersOptions;
}
