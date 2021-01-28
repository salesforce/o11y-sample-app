const protobuf = require('protobufjs');

// Note: The schemas are currently included in this project but will
// soon be imported through an NPM module.
const knownSchemas = require('../schemas/module_exports/KnownSchemas');
const coreEnvelopeSchema = knownSchemas.coreEnvelopeSchema;
const ollySampleSchema = knownSchemas.ollySampleSchema;

const schemas = new Map();
schemas.set(getSchemaId(coreEnvelopeSchema), coreEnvelopeSchema);
schemas.set(getSchemaId(ollySampleSchema), ollySampleSchema);

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
                console.log(decodedMsg);
            }
        }
    }
}

function processMetrics(envelope) {
    console.log('METRICS');
    console.log(envelope.metrics);
}

function processCoreEnvelope(encodedEnvelope) {
    console.log(`Received encoded CoreEnvelope with size ${encodedEnvelope.length} bytes.`);

    const { message: envelope } = decode(getSchemaId(coreEnvelopeSchema), encodedEnvelope);

    processDiagnostics(envelope);
    processBundles(envelope);
    processMetrics(envelope);
}

module.exports.processCoreEnvelope = processCoreEnvelope;
