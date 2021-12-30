class SchemaUtil {
    isActivity(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.Activity';
    }

    isError(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.Error';
    }

    isInstrumentedEvent(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.InstrumentedEvent';
    }

    isSimple(schemaId: string): boolean {
        return schemaId === 'sf.instrumentation.Simple';
    }

    isSample(schemaId: string): boolean {
        return schemaId === 'sf.o11ySample.UserPayload';
    }

    isUnknown(schemaId: string): boolean {
        return (
            !this.isActivity(schemaId) &&
            !this.isError(schemaId) &&
            !this.isInstrumentedEvent(schemaId) &&
            !this.isSample(schemaId) &&
            !this.isSimple(schemaId)
        );
    }
}

export const schemaUtil = new SchemaUtil();
