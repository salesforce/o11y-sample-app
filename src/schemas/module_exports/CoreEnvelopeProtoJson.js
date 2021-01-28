module.exports = {
  "nested": {
    "sf": {
      "nested": {
        "instrumentation": {
          "nested": {
            "CoreEnvelope": {
              "fields": {
                "diagnostics": {
                  "type": "CoreEnvelopeDiagnostics",
                  "id": 1
                },
                "bundles": {
                  "rule": "repeated",
                  "type": "MessageBundle",
                  "id": 2
                },
                "metrics": {
                  "type": "Metrics",
                  "id": 3
                }
              }
            },
            "CoreEnvelopeDiagnostics": {
              "fields": {
                "key": {
                  "type": "string",
                  "id": 1
                },
                "generatedTimestamp": {
                  "type": "double",
                  "id": 2
                },
                "bundleCount": {
                  "type": "uint32",
                  "id": 3
                },
                "upCounterCount": {
                  "type": "uint32",
                  "id": 4
                },
                "valueRecorderCount": {
                  "type": "uint32",
                  "id": 5
                }
              }
            },
            "MessageBundle": {
              "fields": {
                "schemaName": {
                  "type": "string",
                  "id": 1
                },
                "messages": {
                  "rule": "repeated",
                  "type": "LogMessage",
                  "id": 2
                }
              }
            },
            "LogMessage": {
              "fields": {
                "timestamp": {
                  "type": "double",
                  "id": 1
                },
                "data": {
                  "type": "bytes",
                  "id": 2
                },
                "age": {
                  "type": "double",
                  "id": 3
                },
                "rootId": {
                  "type": "string",
                  "id": 4
                },
                "seq": {
                  "type": "uint32",
                  "id": 5
                }
              }
            },
            "Metrics": {
              "fields": {
                "upCounters": {
                  "rule": "repeated",
                  "type": "UpCounter",
                  "id": 1
                },
                "valueRecorders": {
                  "rule": "repeated",
                  "type": "ValueRecorder",
                  "id": 2
                }
              }
            },
            "UpCounter": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "createdTimestamp": {
                  "type": "double",
                  "id": 2
                },
                "lastUpdatedTimestamp": {
                  "type": "double",
                  "id": 3
                },
                "value": {
                  "type": "uint32",
                  "id": 4
                }
              }
            },
            "ValueRecorder": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "createdTimestamp": {
                  "type": "double",
                  "id": 2
                },
                "lastUpdatedTimestamp": {
                  "type": "double",
                  "id": 3
                },
                "values": {
                  "rule": "repeated",
                  "type": "double",
                  "id": 4
                }
              }
            }
          }
        }
      }
    }
  }
}