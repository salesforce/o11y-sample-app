module.exports = {
    nested: {
        sf: {
            nested: {
                instrumentation: {
                    nested: {
                        InstrumentedEvent: {
                            oneofs: {
                                event: {
                                    oneof: ['mouseEvent']
                                }
                            },
                            fields: {
                                ownerComponent: {
                                    type: 'string',
                                    id: 1
                                },
                                parentComponent: {
                                    type: 'string',
                                    id: 2
                                },
                                auto: {
                                    type: 'bool',
                                    id: 3
                                },
                                xpath: {
                                    rule: 'repeated',
                                    type: 'string',
                                    id: 4
                                },
                                userPayload: {
                                    type: 'Payload',
                                    id: 5
                                },
                                pagePayload: {
                                    type: 'Payload',
                                    id: 6
                                },
                                mouseEvent: {
                                    type: 'MouseEvent',
                                    id: 7
                                }
                            }
                        },
                        Payload: {
                            fields: {
                                schemaName: {
                                    type: 'string',
                                    id: 1
                                },
                                payload: {
                                    type: 'bytes',
                                    id: 2
                                }
                            }
                        },
                        MouseEvent: {
                            fields: {
                                altKey: {
                                    type: 'bool',
                                    id: 1
                                },
                                bubbles: {
                                    type: 'bool',
                                    id: 2
                                },
                                button: {
                                    type: 'uint32',
                                    id: 3
                                },
                                buttons: {
                                    type: 'uint32',
                                    id: 4
                                },
                                cancelable: {
                                    type: 'bool',
                                    id: 5
                                },
                                clientX: {
                                    type: 'uint32',
                                    id: 6
                                },
                                clientY: {
                                    type: 'uint32',
                                    id: 7
                                },
                                composed: {
                                    type: 'bool',
                                    id: 8
                                },
                                ctrlKey: {
                                    type: 'bool',
                                    id: 9
                                },
                                defaultPrevented: {
                                    type: 'bool',
                                    id: 10
                                },
                                detail: {
                                    type: 'int64',
                                    id: 11
                                },
                                eventPhase: {
                                    type: 'uint32',
                                    id: 12
                                },
                                isTrusted: {
                                    type: 'bool',
                                    id: 13
                                },
                                metaKey: {
                                    type: 'bool',
                                    id: 14
                                },
                                movementX: {
                                    type: 'uint32',
                                    id: 15
                                },
                                movementY: {
                                    type: 'uint32',
                                    id: 16
                                },
                                offsetX: {
                                    type: 'uint32',
                                    id: 17
                                },
                                offsetY: {
                                    type: 'uint32',
                                    id: 18
                                },
                                pageX: {
                                    type: 'uint32',
                                    id: 19
                                },
                                pageY: {
                                    type: 'uint32',
                                    id: 20
                                },
                                screenX: {
                                    type: 'uint32',
                                    id: 21
                                },
                                screenY: {
                                    type: 'uint32',
                                    id: 22
                                },
                                shiftKey: {
                                    type: 'bool',
                                    id: 23
                                },
                                timeStamp: {
                                    type: 'double',
                                    id: 24
                                },
                                type: {
                                    type: 'string',
                                    id: 25
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
