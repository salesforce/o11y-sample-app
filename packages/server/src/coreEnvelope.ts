import { coreEnvelopeSchema } from 'o11y_schema/sf_instrumentation';
import { schemas, getSchemaId, hasUserPayload } from '../../_common/generated/schema';
import { decode, getDecodedMessage } from '../../_common/src/protoUtil';
import type { CoreEnvelope } from '../../_common/interfaces/CoreEnvelope';
import type { EncodedSchematizedPayload } from '../../_common/interfaces/EncodedSchematizedPayload';
import type { MetricTag } from '../../_common/interfaces/MetricTag';
import type { BucketHistogram } from '../../_common/interfaces/BucketHistogram';
import type { ValueRecorder } from '../../_common/interfaces/ValueRecorder';
import type { UpCounter } from '../../_common/interfaces/UpCounter';
import type { LogMessage } from '../../_common/interfaces/LogMessage';

import type { CoreEnvelopeProcessingOptions } from './interfaces/CoreEnvelopeProcessingOptions';
import { exampleSchema } from './schemas/exampleSchema';

function whenText(timestamp: number): string {
    return timestamp !== undefined ? new Date(timestamp).toLocaleString() : 'UNKNOWN';
}

const MAX_BUNDLES_TO_PROCESS = 100;
const MAX_MESSAGES_PER_BUNDLE_TO_PROCESS = 100;
const MAX_METRICS_PER_TYPE_TO_PROCESS = 100;
const MAX_TAGS_PER_METRIC = 10;

class CoreEnvelopeProcessor {
    private readonly _log: (...params: unknown[]) => void;
    private readonly _warn: (...params: unknown[]) => void;
    private readonly _error: (...params: unknown[]) => void;
    private readonly _maxBundles?: number;
    private readonly _maxMessages?: number;
    private readonly _maxMetrics?: number;
    private readonly _maxTags?: number;

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

        this._maxBundles = options?.maxBundlesToProcess || MAX_BUNDLES_TO_PROCESS;
        this._maxMessages =
            options?.maxMessagesPerBundleToProcess || MAX_MESSAGES_PER_BUNDLE_TO_PROCESS;
        this._maxMetrics = options?.maxMetricsPerTypeToProcess || MAX_METRICS_PER_TYPE_TO_PROCESS;
        this._maxTags = options?.maxTagsPerMetric || MAX_TAGS_PER_METRIC;

        schemas.set(getSchemaId(exampleSchema), exampleSchema);
    }

    processDiagnostics(envelope: CoreEnvelope): void {
        this._log('DIAGS', envelope.diagnostics);
        const whenGen: string = whenText(envelope.diagnostics?.generatedTimestamp);
        this._log(`Core envelope generated at ${whenGen}`);
    }

    processStatics(envelope: CoreEnvelope): void {
        this._log('STATIC ATTRIBUTES', envelope.staticAttributes);
    }

    processBundles(envelope: CoreEnvelope): void {
        const bundleCount = envelope?.bundles?.length;
        if (!bundleCount) {
            this._log('NO BUNDLES.');
            return;
        }

        const limitBundleCount = Math.min(bundleCount, this._maxBundles);
        for (let i = 0; i < limitBundleCount; i += 1) {
            const { schemaName, messages }: { schemaName: string; messages: LogMessage[] } =
                envelope.bundles[i];

            const msgCount = messages?.length || 0;

            this._log(`BUNDLE #${i} has ${msgCount} messages of schema = '${schemaName}' `);

            // Recognizing only top-level schemas
            const isKnown: boolean = schemas.has(schemaName);
            if (isKnown) {
                const limitMsgCount = Math.min(msgCount, this._maxMessages);
                for (let j = 0; j < limitMsgCount; j += 1) {
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
                if (limitMsgCount < msgCount) {
                    this._warn(`Skipped remaining ${msgCount - limitMsgCount} messages.`);
                }
            } else {
                this._warn(`Schema '${schemaName}' is UNKNOWN.`);
            }
        }
        if (limitBundleCount < bundleCount) {
            this._warn(`Skipped remaining ${bundleCount - limitBundleCount} bundles.`);
        }
    }

    processEncodedMessage(label: string, schemaName: string, encoded: Uint8Array): boolean {
        let message;
        try {
            message = getDecodedMessage(schemaName, encoded);
        } catch (errorMsg) {
            this._error(`${label} is INVALID.`, errorMsg);
            return false;
        }

        let isPartiallyDecoded = false;
        this.populateOptionals(message, schemaName);
        if (hasUserPayload(schemaName)) {
            const userSchemaName = message.userPayload?.schemaName;
            if (userSchemaName) {
                if (schemas.has(userSchemaName)) {
                    let data;
                    try {
                        data = getDecodedMessage(
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

    populateOptionals(msg: { [k: string]: any }, schemaName: string): void {
        const schema = schemas.get(schemaName);
        const parts = schemaName.split('.');
        const fields =
            parts.length === 3 &&
            (schema?.pbjsSchema?.nested?.[parts[0]] as any)?.nested?.[parts[1]]?.nested?.[parts[2]]
                ?.fields;
        for (const key of Object.keys(fields)) {
            if (msg[key] === undefined && fields?.[key]?.options?.proto3_optional) {
                msg[key] = null;
            }
        }
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
        const count = counters?.length;
        if (!count) {
            this._log(`No Up Counters.`);
            return;
        }

        const limitCount = Math.min(count, this._maxMetrics);
        for (let i = 0; i < limitCount; i += 1) {
            const label = `UPC #${i}`;
            const c = counters[i];
            const tagCount = c?.tags?.length || 0;

            this._log(`${label} name          : `, c.name);
            this._log(`${label} owner app name: `, c.ownerAppName);
            this._log(`${label} owner name    : `, c.ownerName);
            this._log(`${label} tags          : `, this.getMetricsTags(c.tags, this._maxTags));
            this._log(`${label} value         : `, c.value);
            this._log(`${label} created       : `, whenText(c.createdTimestamp));
            this._log(`${label} last updated  : `, whenText(c.lastUpdatedTimestamp));

            if (this._maxTags < tagCount) {
                this._warn(`${label}: Skipped ${tagCount - this._maxTags} tag(s).`);
            }
        }
        if (limitCount < count) {
            this._warn(`Skipped remaining ${count - limitCount} Up Counter(s).`);
        }
    }

    processValueRecorders(valueRecorders: ValueRecorder[]) {
        const count = valueRecorders?.length;
        if (!count) {
            this._log(`No Value Recorders.`);
            return;
        }
        const limitCount = Math.min(count, this._maxMetrics);
        for (let i = 0; i < limitCount; i += 1) {
            const label = `VR  #${i}`;
            const v = valueRecorders[i];
            const vals = v.values;
            const valuesText = vals ? (vals.length ? vals.join(', ') : 'Empty') : 'UNDEFINED';
            const tagCount = v?.tags?.length || 0;

            this._log(`${label} name          : `, v.name);
            this._log(`${label} owner app name: `, v.ownerAppName);
            this._log(`${label} owner name    : `, v.ownerName);
            this._log(`${label} tags          : `, this.getMetricsTags(v.tags, this._maxTags));
            this._log(`${label} values        : `, valuesText);
            this._log(`${label} created       : `, whenText(v.createdTimestamp));
            this._log(`${label} last updated  : `, whenText(v.lastUpdatedTimestamp));

            if (this._maxTags < tagCount) {
                this._warn(`${label}: Skipped ${tagCount - this._maxTags} tag(s).`);
            }
        }
        if (limitCount < count) {
            this._warn(`Skipped remaining ${count - limitCount} Value Recorder(s).`);
        }
    }

    processBucketHistograms(bucketHistograms: BucketHistogram[]) {
        const count = bucketHistograms?.length;
        if (!count) {
            this._log(`No Bucket Histograms.`);
            return;
        }

        const limitCount = Math.min(count, this._maxMetrics);
        for (let i = 0; i < limitCount; i += 1) {
            const label = `BH  #${i}`;
            const b = bucketHistograms[i];
            const bucs = b.buckets;
            const bucketsText = bucs ? (bucs.length ? bucs.join(', ') : 'Empty') : 'UNDEFINED';
            const vals = b.values;
            const valuesText = vals ? (vals.length ? vals.join(', ') : 'Empty') : 'UNDEFINED';
            const tagCount = b?.tags?.length || 0;

            this._log(`${label} name          : `, b.name);
            this._log(`${label} owner app name: `, b.ownerAppName);
            this._log(`${label} owner name    : `, b.ownerName);
            this._log(`${label} tags          : `, this.getMetricsTags(b.tags, this._maxTags));
            this._log(`${label} buckets       : `, bucketsText);
            this._log(`${label} values        : `, valuesText);
            this._log(`${label} created       : `, whenText(b.createdTimestamp));
            this._log(`${label} last updated  : `, whenText(b.lastUpdatedTimestamp));

            if (this._maxTags < tagCount) {
                this._warn(`${label}: Skipped ${tagCount - this._maxTags} tag(s).`);
            }
        }
        if (limitCount < count) {
            this._warn(`Skipped remaining ${count - limitCount} Bucket Histogram(s).`);
        }
    }

    getMetricsTags(tagsArray: MetricTag[], limit: number) {
        if (!tagsArray) {
            return 'Undefined';
        }
        if (!tagsArray.length) {
            return 'EMPTY';
        }
        return tagsArray
            .slice(0, limit)
            .map((tag) => `${tag.name}=${tag.value} `)
            .join(', ');
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
