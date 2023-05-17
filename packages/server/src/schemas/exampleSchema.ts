import { Schema } from '../../../_common/interfaces/Schema';

export const exampleSchema: Schema = {
    namespace: 'sf.o11ySample',
    name: 'Example',
    pbjsSchema: {
        nested: {
            sf: {
                nested: {
                    o11ySample: {
                        nested: {
                            Example: {
                                fields: {
                                    bool: {
                                        type: 'bool',
                                        id: 1
                                    },
                                    string: {
                                        type: 'string',
                                        id: 2
                                    },
                                    int32: {
                                        type: 'int32',
                                        id: 3
                                    },
                                    int64: {
                                        type: 'int32',
                                        id: 4
                                    },
                                    uint32: {
                                        type: 'uint32',
                                        id: 5
                                    },
                                    uint64: {
                                        type: 'uint64',
                                        id: 6
                                    },
                                    double: {
                                        type: 'double',
                                        id: 7
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
