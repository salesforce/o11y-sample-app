import protobuf from 'protobufjs';

export interface Schema {
    namespace: string;
    name: string;
    pbjsSchema: protobuf.INamespace;
}
