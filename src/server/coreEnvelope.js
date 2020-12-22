const protobuf = require('protobufjs');

const coreEnvelopeSchema = require('../proto-json-module-exports/core_envelope');
const instrumentedEventSchema = require('../proto-json-module-exports/instrumented_event');
const sampleNameSchema = require('../proto-json-module-exports/sample_name');
const mediaPlayerExperienceSchema = require('../proto-json-module-exports/media_player_experience');

const schemas = new Map();
schemas.set('CoreEnvelope', coreEnvelopeSchema);
schemas.set('InstrumentedEvent', instrumentedEventSchema);
schemas.set('SampleName', sampleNameSchema);
schemas.set('MediaPlayerExperience', mediaPlayerExperienceSchema);

function decode(logType, encoded) {
    const schemaJson = schemas.get(logType);
    const schemaInstance = protobuf.Root.fromJSON(schemaJson);
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
            `BUNDLE #${i}: Schema='${schemaName}'${
                !isKnown ? ' (UNKNOWN)' : ''
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
    console.log('Encoded CoreEnvelope', encodedEnvelope);

    const { message: envelope } = decode('CoreEnvelope', encodedEnvelope);

    processDiagnostics(envelope);
    processBundles(envelope);
    processMetrics(envelope);
}

module.exports.processCoreEnvelope = processCoreEnvelope;
