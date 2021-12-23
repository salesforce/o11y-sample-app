import { EncodedSchematizedPayload } from './EncodedSchematizedPayload';

// Corresponds to the LogMessage in core_envelope.proto
export interface LogMessage {
    timestamp: number;
    data: Uint8Array;
    age: number;
    rootId: string;
    seq: number;
    loggerName: string;
    pagePayload: EncodedSchematizedPayload;
    loggerAppName: string;
    connectionType: string;
    appPayload: EncodedSchematizedPayload;
}
