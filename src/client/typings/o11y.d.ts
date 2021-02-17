declare module 'o11y/client' {
    import { INamespace, Type } from "protobufjs";
    import { LightningElement } from "lwc";

    export function registerApp(): InstrumentedAppMethods | undefined;
    export function getInstrumentation(name?: string): Instrumentation;

    interface Schema {
        namespace: string;
        name: string;
        pbjsSchema: INamespace;
    }

    interface InstrumentedAppMethods {
        startRootActivity(name: string, url?: string): RootActivity;
        registerLogCollector(collector: LogCollector): void;
        registerMetricsCollector(collector: MetricsCollector): void;
        getSchemaType(schema: Schema): Type;
        activateClickTracker(instrumentation: Instrumentation): void;
        deactivateClickTracker(): void;
    }

    interface LogCollector {
        collect(schema: Schema, data: SchematizedData, logMeta: LogMeta): void;
    }

    type SchematizedData = { [key: string]: any };

    interface LogMeta {
        sequence: number;
        timestamp: number;
        rootId: string;
    }

    interface MetricsCollector {
        receiveMetricsExtractors: (extractors: MetricsExtractorMethods) => void;
    }

    interface MetricsExtractorMethods {
        getAllUpCounters(): Metric<number>[];
        getAllUpValueRecorders(): Metric<number[]>[];
    }

    interface Metric<T> {
        getName(): string,
        getCreatedOn(): number,
        getLastUpdatedOn(): number,
        getData(): T,
        reset(): void
    }

    interface RootActivity {
        getId(): string;
        stop(schema?: Schema, data?: SchematizedData): void;
    }

    interface Instrumentation {
        log(schema: Schema, data?: SchematizedData): void;
        error(error: Error, schema?: Schema | string, data?: SchematizedData): void;
        startActivity(name: string): Activity;
        domEvent(e: Event, handledBy: HTMLElement | LightningElement, schema?: Schema, data?: SchematizedData, auto?: boolean): void;
        createUpCounter(name: string): UpCounter;
        createValueRecorder(name: string): ValueRecorder;
    }

    interface Activity {
        error(err: Error): void;
        stop(schema?: Schema, data?: SchematizedData): void;
        discard(): void;
    }

    interface UpCounter {
        increment(positiveInteger?: number): void;
    }

    interface ValueRecorder {
        record(value: number): void;
    }
}
