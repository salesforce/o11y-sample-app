module.exports = {
  "nested": {
    "sf": {
      "nested": {
        "instrumentation": {
          "nested": {
            "Activity": {
              "fields": {
                "id": {
                  "type": "string",
                  "id": 1
                },
                "name": {
                  "type": "string",
                  "id": 2
                },
                "duration": {
                  "type": "double",
                  "id": 3
                },
                "userPayload": {
                  "type": "Payload",
                  "id": 4
                },
                "pagePayload": {
                  "type": "Payload",
                  "id": 5
                },
                "stopReason": {
                  "type": "string",
                  "id": 6
                },
                "errorIds": {
                  "rule": "repeated",
                  "type": "uint32",
                  "id": 7
                }
              }
            },
            "Error": {
              "fields": {
                "name": {
                  "type": "string",
                  "id": 1
                },
                "message": {
                  "type": "string",
                  "id": 2
                },
                "stack": {
                  "type": "string",
                  "id": 3
                },
                "userPayload": {
                  "type": "Payload",
                  "id": 4
                },
                "pagePayload": {
                  "type": "Payload",
                  "id": 5
                }
              }
            },
            "Payload": {
              "fields": {
                "schemaName": {
                  "type": "string",
                  "id": 1
                },
                "payload": {
                  "type": "bytes",
                  "id": 2
                }
              }
            }
          }
        }
      }
    }
  }
}