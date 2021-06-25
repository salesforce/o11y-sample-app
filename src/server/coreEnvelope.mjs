import protobuf from 'protobufjs';

import {
    activitySchema,
    coreEnvelopeSchema,
    errorSchema,
    instrumentedEventSchema,
    o11ySampleSchema,
    o11ySampleAppPayloadSchema,
    o11ySamplePagePayloadSchema
} from 'o11ySchema/sf_instrumentation/index.js';

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
    console.log('METRICS');
    console.log(envelope.metrics);
}

export function processCoreEnvelope(encodedEnvelope) {
    console.log(`Received encoded CoreEnvelope with size ${encodedEnvelope.length} bytes.`);

    const { message: envelope } = decode(getSchemaId(coreEnvelopeSchema), encodedEnvelope);

    processDiagnostics(envelope);
    processStatics(envelope);
    processBundles(envelope);
    processMetrics(envelope);
}

