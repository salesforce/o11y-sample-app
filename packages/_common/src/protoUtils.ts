// import { coreEnvelopeSchema } from 'o11y_schema/sf_instrumentation';
// import type { CoreEnvelope } from 'o11y/dist/modules/o11y/shared/core_envelope/interfaces';
import protobuf from 'protobufjs';
import { schemas } from '../generated/schema';

export type DecodedMsg = { [k: string]: any };

export type DecodedValue = {
    type: protobuf.Type;
    message: DecodedMsg;
};

export function decode(schemaId: string, encoded: Uint8Array): DecodedValue {
    const schema = schemas.get(schemaId);
    const schemaInstance = protobuf.Root.fromJSON(schema.pbjsSchema);
    const type = schemaInstance.lookupType(schemaId);
    const message = type.decode(new Uint8Array(encoded));
    const pojo = type.toObject(message, {
        longs: Number
    });
    return { type, message: pojo };
}

export function getDecodedMessage(schemaId: string, encoded: Uint8Array): DecodedMsg {
    const { type, message } = decode(schemaId, encoded);
    const errorMsg: string | null = type.verify(message);
    if (errorMsg) {
        throw errorMsg;
    }
    return message;
}
