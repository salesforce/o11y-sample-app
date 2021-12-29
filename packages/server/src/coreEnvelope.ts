import protobuf from 'protobufjs';

import {
    activitySchema,
    coreEnvelopeSchema,
    errorSchema,
    instrumentedEventSchema,
    simpleSchema
} from 'o11y_schema/sf_instrumentation';
import { userPayloadSchema, appPayloadSchema, pagePayloadSchema } from 'o11y_schema/sf_o11ySample';

import { CoreEnvelope } from './interfaces/CoreEnvelope';
import { EncodedSchematizedPayload } from './interfaces/EncodedSchematizedPayload';
import { MetricTag } from './interfaces/MetricTag';
import { Schema } from './interfaces/Schema';
import { ValueRecorder } from './interfaces/ValueRecorder';
import { UpCounter } from './interfaces/UpCounter';
import { exampleSchema } from './schemas/exampleSchema';
import { LogMessage } from './interfaces/LogMessage';

const schemas = new Map()
    .set(getSchemaId(coreEnvelopeSchema), coreEnvelopeSchema)
    .set(getSchemaId(instrumentedEventSchema), instrumentedEventSchema)
    .set(getSchemaId(activitySchema), activitySchema)
    .set(getSchemaId(errorSchema), errorSchema)
    .set(getSchemaId(simpleSchema), simpleSchema)
    .set(getSchemaId(userPayloadSchema), userPayloadSchema)
    .set(getSchemaId(appPayloadSchema), appPayloadSchema)
    .set(getSchemaId(pagePayloadSchema), pagePayloadSchema)
    .set(getSchemaId(exampleSchema), exampleSchema);

function getSchemaId(schema: Schema): string {
    return `${schema.namespace}.${schema.name}`;
}

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

function processDiagnostics(envelope: CoreEnvelope): void {
    console.log('DIAGS', envelope.diagnostics);
    const whenGen: string = whenText(envelope.diagnostics.generatedTimestamp);
    console.log(`Core envelope generated at ${whenGen}`);
}

function processStatics(envelope: CoreEnvelope): void {
    console.log('STATIC ATTRIBUTES', envelope.staticAttributes);
}

function processBundles(envelope: CoreEnvelope): void {
    if (!envelope.bundles) {
        console.log('NO BUNDLES.');
        return;
    }
    for (let i = 0; i < envelope.bundles.length; i += 1) {
        const { schemaName, messages }: { schemaName: string; messages: LogMessage[] } =
            envelope.bundles[i];

        console.log(`BUNDLE #${i} has ${messages.length} messages of schema = '${schemaName}' `);

        // Recognizing only top-level schemas
        const isKnown: boolean = schemas.has(schemaName);
        if (isKnown) {
            for (let j = 0; j < messages.length; j += 1) {
                const msg: LogMessage = messages[j];

                const label = `MSG #${j}`;
                console.log(`${label} logged at      :`, whenText(msg.timestamp));
                console.log(`${label} sequence       :`, msg.seq);
                console.log(`${label} age            :`, msg.age);
                console.log(`${label} root ID        :`, msg.rootId);
                console.log(`${label} logger app name:`, msg.loggerAppName);
                console.log(`${label} logger name    :`, msg.loggerName);
                console.log(`${label} connection type:`, msg.connectionType);

                processEncoded(`${label} data`, schemaName, msg.data);
                processPayload(`${label} app payload`, msg.appPayload);
                processPayload(`${label} page payload`, msg.pagePayload);
            }
        } else {
            console.warn(`Schema '${schemaName}' is UNKNOWN.`);
        }
    }
}

function processEncoded(label: string, schemaName: string, encoded: Uint8Array): boolean {
    const { type, message } = decode(schemaName, encoded);
    const errorMsg: string | null = type.verify(message);
    if (errorMsg) {
        console.warn(`${label} is INVALID.`);
        console.error(label, errorMsg);
        return false;
    }

    console.log(`${label} as decoded:`, message);
    return true;
}

function processPayload(label: string, payloadObj: EncodedSchematizedPayload): void {
    if (payloadObj) {
        processEncoded(label, payloadObj.schemaName, payloadObj.payload);
    } else {
        console.warn(`${label} is EMPTY.`);
    }
}

function processMetrics(envelope: CoreEnvelope) {
    const metrics = envelope.metrics;
    console.log(`METRICS: ${metrics ? '' : 'Empty.'}`);
    if (metrics) {
        processUpCounters(metrics.upCounters);
        processValueRecorders(metrics.valueRecorders);
    }
}

function processUpCounters(counters: UpCounter[]) {
    const count = counters && counters.length;
    if (!count) {
        console.log(`No Up Counters.`);
        return;
    }

    for (let i = 0; i < count; i += 1) {
        const label = `UPC #${i}`;
        const c = counters[i];
        console.log(`${label} name          :`, c.name);
        console.log(`${label} owner app name:`, c.ownerAppName);
        console.log(`${label} owner name    :`, c.ownerName);
        console.log(`${label} tags          :`, getMetricsTags(c.tags));
        console.log(`${label} value         :`, c.value);
        console.log(`${label} created       :`, whenText(c.createdTimestamp));
        console.log(`${label} last updated  :`, whenText(c.lastUpdatedTimestamp));
    }
}

function processValueRecorders(valueRecorders: ValueRecorder[]) {
    const count = valueRecorders && valueRecorders.length;
    if (!count) {
        console.log(`No Value Recorders.`);
        return;
    }
    for (let i = 0; i < count; i += 1) {
        const label = `VR  #${i}`;
        const v = valueRecorders[i];
        const vals = v.values;
        const valuesText = vals ? (vals.length ? vals.join(', ') : 'Empty') : 'UNDEFINED';
        console.log(`${label} name          :`, v.name);
        console.log(`${label} owner app name:`, v.ownerAppName);
        console.log(`${label} owner name    :`, v.ownerName);
        console.log(`${label} tags          :`, getMetricsTags(v.tags));
        console.log(`${label} values        :`, valuesText);
        console.log(`${label} created       :`, whenText(v.createdTimestamp));
        console.log(`${label} last updated  :`, whenText(v.lastUpdatedTimestamp));
    }
}

function getMetricsTags(tagsArray: MetricTag[]) {
    if (!tagsArray) {
        return 'Undefined';
    }
    if (!tagsArray.length) {
        return 'EMPTY';
    }
    return tagsArray.map((tag) => `${tag.name}=${tag.value} `).join(', ');
}

export function processCoreEnvelope(encodedEnvelope: Uint8Array) {
    console.log(`Received encoded CoreEnvelope with size ${encodedEnvelope.length} bytes.`);

    const { message } = decode(getSchemaId(coreEnvelopeSchema), encodedEnvelope);
    const envelope = message as CoreEnvelope;

    processDiagnostics(envelope);
    processStatics(envelope);
    processBundles(envelope);
    processMetrics(envelope);
}
