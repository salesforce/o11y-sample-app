import protobuf from 'protobufjs';
import { coreEnvelopeSchema } from 'o11y_schema/sf_instrumentation';
import { schemas, getSchemaId, hasUserPayload } from './schema';

import type { CoreEnvelope } from './interfaces/CoreEnvelope';
import type { EncodedSchematizedPayload } from './interfaces/EncodedSchematizedPayload';
import type { MetricTag } from './interfaces/MetricTag';
import type { BucketHistogram } from './interfaces/BucketHistogram';
import type { ValueRecorder } from './interfaces/ValueRecorder';
import type { UpCounter } from './interfaces/UpCounter';
import type { LogMessage } from './interfaces/LogMessage';
import type { CoreEnvelopeProcessingOptions } from './interfaces/CoreEnvelopeProcessingOptions';

function whenText(timestamp: number): string {
    return timestamp ? new Date(timestamp).toLocaleString() : 'UNKNOWN';
}

function decode(logType: string, encoded: Uint8Array) {
    const schema = schemas.get(logType);
    const schemaInstance = protobuf.Root.fromJSON(schema.pbjsSchema);
    const type = schemaInstance.lookupType(logType);
    const message = type.decode(new Uint8Array(encoded));
    const pojo = type.toObject(message, {
        longs: Number
    });
    return { type, message: pojo };
}

class CoreEnvelopeProcessor {
    private readonly _log: (...params: unknown[]) => void;
    private readonly _warn: (...params: unknown[]) => void;
    private readonly _error: (...params: unknown[]) => void;

    constructor(options?: CoreEnvelopeProcessingOptions) {
        if (options && typeof options.logMethod === 'function') {
            this._log = options.logMethod;
        } else {
            this._log = console.log.bind(console);
        }

        if (options && typeof options.warnMethod === 'function') {
            this._warn = options.warnMethod;
        } else {
            this._warn = console.warn.bind(console);
        }

        if (options && typeof options.errorMethod === 'function') {
            this._error = options.errorMethod;
        } else {
            this._error = console.error.bind(console);
        }
    }

    processDiagnostics(envelope: CoreEnvelope): void {
        this._log('DIAGS', envelope.diagnostics);
        const whenGen: string = whenText(envelope.diagnostics.generatedTimestamp);
        this._log(`Core envelope generated at ${whenGen}`);
    }

    processStatics(envelope: CoreEnvelope): void {
        this._log('STATIC ATTRIBUTES', envelope.staticAttributes);
    }

    processBundles(envelope: CoreEnvelope): void {
        if (!envelope.bundles) {
            this._log('NO BUNDLES.');
            return;
        }
        for (let i = 0; i < envelope.bundles.length; i += 1) {
            const { schemaName, messages }: { schemaName: string; messages: LogMessage[] } =
                envelope.bundles[i];

            this._log(`BUNDLE #${i} has ${messages.length} messages of schema = '${schemaName}' `);

            // Recognizing only top-level schemas
            const isKnown: boolean = schemas.has(schemaName);
            if (isKnown) {
                for (let j = 0; j < messages.length; j += 1) {
                    const msg: LogMessage = messages[j];

                    const label = `MSG #${j}`;
                    this._log(`${label} logged at      :`, whenText(msg.timestamp));
                    this._log(`${label} sequence       :`, msg.seq);
                    this._log(`${label} age            :`, msg.age);
                    this._log(`${label} root ID        :`, msg.rootId);
                    this._log(`${label} logger app name:`, msg.loggerAppName);
                    this._log(`${label} logger name    :`, msg.loggerName);
                    this._log(`${label} connection type:`, msg.connectionType);

                    this.processEncodedMessage(`${label} data`, schemaName, msg.data);
                    this.processPayload(`${label} app payload`, msg.appPayload);
                    this.processPayload(`${label} page payload`, msg.pagePayload);
                }
            } else {
                this._warn(`Schema '${schemaName}' is UNKNOWN.`);
            }
        }
    }

    getDecodedMessage(schemaName: string, encoded: Uint8Array): { [k: string]: any } {
        const { type, message } = decode(schemaName, encoded);
        const errorMsg: string | null = type.verify(message);
        if (errorMsg) {
            throw errorMsg;
        }
        return message;
    }

    processEncodedMessage(label: string, schemaName: string, encoded: Uint8Array): boolean {
        let message;
        try {
            message = this.getDecodedMessage(schemaName, encoded);
        } catch (errorMsg) {
            this._error(`${label} is INVALID.`, errorMsg);
            return false;
        }

        let isPartiallyDecoded = false;
        if (hasUserPayload(schemaName)) {
            const userSchemaName = message.userPayload?.schemaName;
            if (userSchemaName) {
                if (schemas.has(userSchemaName)) {
                    let data;
                    try {
                        data = this.getDecodedMessage(
                            message.userPayload.schemaName,
                            message.userPayload.payload
                        );
                        message.userPayload.payload = data;
                    } catch (errorMsg) {
                        isPartiallyDecoded = true;
                        this._error(
                            `${label} userPayload is INVALID; it won't be decoded.`,
                            errorMsg
                        );
                    }
                } else {
                    isPartiallyDecoded = true;
                    this._warn(`${label} userPayload schema is UNKNOWN; it won't be decoded.`);
                }
            }
        }

        this._log(`${label} as ${isPartiallyDecoded ? 'partially' : 'fully'} decoded:`, message);
        return true;
    }

    processPayload(label: string, payloadObj: EncodedSchematizedPayload): void {
        if (payloadObj) {
            this.processEncodedMessage(label, payloadObj.schemaName, payloadObj.payload);
        } else {
            this._warn(`${label} is EMPTY.`);
        }
    }

    processMetrics(envelope: CoreEnvelope) {
        const metrics = envelope.metrics;
        this._log(`METRICS: ${metrics ? '' : 'Empty.'}`);
        if (metrics) {
            this.processUpCounters(metrics.upCounters);
            this.processValueRecorders(metrics.valueRecorders);
            this.processBucketHistograms(metrics.bucketHistograms);
        }
    }

    processUpCounters(counters: UpCounter[]) {
        const count = counters && counters.length;
        if (!count) {
            this._log(`No Up Counters.`);
            return;
        }

        for (let i = 0; i < count; i += 1) {
            const label = `UPC #${i}`;
            const c = counters[i];
            this._log(`${label} name          :`, c.name);
            this._log(`${label} owner app name:`, c.ownerAppName);
            this._log(`${label} owner name    :`, c.ownerName);
            this._log(`${label} tags          :`, this.getMetricsTags(c.tags));
            this._log(`${label} value         :`, c.value);
            this._log(`${label} created       :`, whenText(c.createdTimestamp));
            this._log(`${label} last updated  :`, whenText(c.lastUpdatedTimestamp));
        }
    }

    processValueRecorders(valueRecorders: ValueRecorder[]) {
        const count = valueRecorders && valueRecorders.length;
        if (!count) {
            this._log(`No Value Recorders.`);
            return;
        }
        for (let i = 0; i < count; i += 1) {
            const label = `VR  #${i}`;
            const v = valueRecorders[i];
            const vals = v.values;
            const valuesText = vals ? (vals.length ? vals.join(', ') : 'Empty') : 'UNDEFINED';
            this._log(`${label} name          :`, v.name);
            this._log(`${label} owner app name:`, v.ownerAppName);
            this._log(`${label} owner name    :`, v.ownerName);
            this._log(`${label} tags          :`, this.getMetricsTags(v.tags));
            this._log(`${label} values        :`, valuesText);
            this._log(`${label} created       :`, whenText(v.createdTimestamp));
            this._log(`${label} last updated  :`, whenText(v.lastUpdatedTimestamp));
        }
    }

    processBucketHistograms(bucketHistograms: BucketHistogram[]) {
        const count = bucketHistograms && bucketHistograms.length;
        if (!count) {
            this._log(`No Bucket Histograms.`);
            return;
        }
        for (let i = 0; i < count; i += 1) {
            const label = `BH  #${i}`;
            const b = bucketHistograms[i];
            const bucs = b.buckets;
            const bucketsText = bucs ? (bucs.length ? bucs.join(', ') : 'Empty') : 'UNDEFINED';
            const vals = b.values;
            const valuesText = vals ? (vals.length ? vals.join(', ') : 'Empty') : 'UNDEFINED';
            this._log(`${label} name          :`, b.name);
            this._log(`${label} owner app name:`, b.ownerAppName);
            this._log(`${label} owner name    :`, b.ownerName);
            this._log(`${label} tags          :`, this.getMetricsTags(b.tags));
            this._log(`${label} buckets       :`, bucketsText);
            this._log(`${label} values        :`, valuesText);
            this._log(`${label} created       :`, whenText(b.createdTimestamp));
            this._log(`${label} last updated  :`, whenText(b.lastUpdatedTimestamp));
        }
    }

    getMetricsTags(tagsArray: MetricTag[]) {
        if (!tagsArray) {
            return 'Undefined';
        }
        if (!tagsArray.length) {
            return 'EMPTY';
        }
        return tagsArray.map((tag) => `${tag.name}=${tag.value} `).join(', ');
    }

    processEncodedEnvelope(encodedEnvelope: Uint8Array): boolean {
        if (encodedEnvelope.length === undefined) {
            this._warn('Processing CoreEnvelope: Received invalid data. Check format.');
            return false;
        }
        this._log(`Received encoded CoreEnvelope with size ${encodedEnvelope.length} bytes.`);

        const { message } = decode(getSchemaId(coreEnvelopeSchema), encodedEnvelope);
        const envelope = message as CoreEnvelope;

        this.processDiagnostics(envelope);
        this.processStatics(envelope);
        this.processBundles(envelope);
        this.processMetrics(envelope);
        return true;
    }
}

export function processCoreEnvelope(
    encodedEnvelope: Uint8Array,
    options?: CoreEnvelopeProcessingOptions
): boolean {
    return new CoreEnvelopeProcessor(options).processEncodedEnvelope(encodedEnvelope);
}
