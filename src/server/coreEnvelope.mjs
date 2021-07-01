import protobuf from 'protobufjs';

import {
    activitySchema,
    coreEnvelopeSchema,
    errorSchema,
    instrumentedEventSchema,
    o11ySampleSchema,
    o11ySampleAppPayloadSchema,
    o11ySamplePagePayloadSchema
} from 'o11y_schema/sf_instrumentation';

import { exampleSchema } from '../schemas/exampleSchema.mjs';

const schemas = new Map()
    .set(getSchemaId(coreEnvelopeSchema), coreEnvelopeSchema)
    .set(getSchemaId(instrumentedEventSchema), instrumentedEventSchema)
    .set(getSchemaId(activitySchema), activitySchema)
    .set(getSchemaId(errorSchema), errorSchema)
    .set(getSchemaId(o11ySampleSchema), o11ySampleSchema)
    .set(getSchemaId(o11ySampleAppPayloadSchema), o11ySampleAppPayloadSchema)
    .set(getSchemaId(o11ySamplePagePayloadSchema), o11ySamplePagePayloadSchema)
    .set(getSchemaId(exampleSchema), exampleSchema);

function getSchemaId(schema) {
    return `${schema.namespace}.${schema.name}`;
}

function decode(logType, encoded) {
    const schema = schemas.get(logType);
    const schemaInstance = protobuf.Root.fromJSON(schema.pbjsSchema);
    const type = schemaInstance.lookupType(logType);
    const message = type.decode(new Uint8Array(encoded));
    const pojo = type.toObject(message, {
        longs: Number
    });
    return { type, message: pojo };
}

function processDiagnostics(envelope) {
    console.log('DIAGS', envelope.diagnostics);
    console.log(new Date(envelope.diagnostics.generatedTimestamp));
}

function processStatics(envelope) {
    console.log('STATIC ATTRIBUTES', envelope.staticAttributes);
}

function processBundles(envelope) {
    for (let i = 0; i < envelope.bundles.length; i += 1) {
        const { schemaName, messages } = envelope.bundles[i];

        // Recognizing only top-level schemas
        const isKnown = schemas.has(schemaName);
        console.log(
            `BUNDLE #${i}: Schema='${schemaName}'${!isKnown ? ' (UNKNOWN)' : ''
            }, Messages=${messages.length}`
        );

        if (isKnown) {
            for (let j = 0; j < messages.length; j += 1) {
                const msg = messages[j];
                const ts = new Date(msg.timestamp);
                const { type, message: decodedMsg } = decode(
                    schemaName,
                    msg.data
                );

                const validity = type.verify(decodedMsg) ? 'Invalid' : 'Valid';
                console.log(`MSG #${j} logged at ${ts}: ${validity}`);
                console.log('Msg fields', msg);

                processPayload(msg.appPayload, 'Msg.appPayload');
                processPayload(msg.pagePayload, 'Msg.pagePayload');

                console.log('Msg.data (decoded)', decodedMsg);
            }
        }
    }
}

function processPayload(payloadObj, label) {
    if (payloadObj) {
        const { type: pageType, message: decodedPageMsg } = decode(
            payloadObj.schemaName,
            payloadObj.payload
        );
        const validity = pageType.verify(decodedPageMsg) ? 'Invalid' : 'Valid';
        console.log(`${label} is ${validity}. (decoded)`, decodedPageMsg);
    } else {
        console.log(`${label} is empty`);
    }
}

function processMetrics(envelope) {
    const metrics = envelope.metrics;
    console.log(`METRICS: ${metrics ? '' : 'Empty.'}`);
    if (metrics); {
        processUpCounters(metrics.upCounters);
        processValueRecorders(metrics.valueRecorders);
    }
}

function processUpCounters(counters) {
    const count = counters && counters.length;
    console.log(`Up Counters: ${count}`);
    for (let i = 0; i < count; i += 1) {
        const c = counters[i];
        console.log(`[${i}].name: ${c.name}`);
        console.log(`[${i}].value: ${c.value}`);
        console.log(`[${i}].createdTimestamp: ${c.createdTimestamp}`);
        console.log(`[${i}].lastUpdatedTimestamp: ${c.lastUpdatedTimestamp}`);
        console.log(`[${i}].tags: ${getMetricsTags(c.tags)}`);
        console.log(`[${i}].ownerName: ${c.ownerName}`);
    }
}


function processValueRecorders(valueRecorders) {
    const count = valueRecorders && valueRecorders.length;
    console.log(`Value Recorders: ${count}`);
    for (let i = 0; i < count; i += 1) {
        const v = valueRecorders[i];
        console.log(`[${i}].name: ${v.name}`);
        console.log(`[${i}].values: ${v.values ? v.values.length ? v.values.join(', ') : 'Empty' : 'Undefined'}`);
        console.log(`[${i}].createdTimestamp: ${v.createdTimestamp}`);
        console.log(`[${i}].lastUpdatedTimestamp: ${v.lastUpdatedTimestamp}`);
        console.log(`[${i}].tags: ${getMetricsTags(v.tags)}`);
        console.log(`[${i}].ownerName: ${v.ownerName}`);
    }
}

function getMetricsTags(tagsArray) {
    if (!tagsArray) {
        return 'Undefined.';
    }
    if (!tagsArray.length) {
        return 'Empty';
    }
    return tagsArray.map(tag => `${tag.name}=${tag.value}`).join(', ');
}

export function processCoreEnvelope(encodedEnvelope) {
    console.log(`Received encoded CoreEnvelope with size ${encodedEnvelope.length} bytes.`);

    const { message: envelope } = decode(getSchemaId(coreEnvelopeSchema), encodedEnvelope);

    processDiagnostics(envelope);
    processStatics(envelope);
    processBundles(envelope);
    processMetrics(envelope);
}

