const activityPbjs = require("./ActivityProtoJson");
const coreEnvelopePbjs = require("./CoreEnvelopeProtoJson");
const errorPbjs = require("./ErrorProtoJson");
const instrumentedEventPbjs = require("./InstrumentedEventProtoJson");
const ollySamplePbjs = require("./OllySampleProtoJson");

// This namespace is reserved for the instrumentation team in Salesforce
const namespace = 'sf.instrumentation';

module.exports.coreEnvelopeSchema = {
    namespace,
    name: 'CoreEnvelope',
    pbjsSchema: coreEnvelopePbjs
};

module.exports.instrumentedEventSchema = {
    namespace,
    name: 'InstrumentedEvent',
    pbjsSchema: instrumentedEventPbjs
};

module.exports.activitySchema = {
    namespace,
    name: 'Activity',
    pbjsSchema: activityPbjs
};

module.exports.errorSchema = {
    namespace,
    name: 'Error',
    pbjsSchema: errorPbjs
};

module.exports.ollySampleSchema = {
    namespace,
    name: 'OllySample',
    pbjsSchema: ollySamplePbjs
};
