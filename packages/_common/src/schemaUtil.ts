import { Schema } from '../interfaces/Schema';

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

    isInternal(schemaId: string): boolean {
        return (
            this.isActivity(schemaId) ||
            this.isError(schemaId) ||
            this.isInstrumentedEvent(schemaId) ||
            schemaId === 'sf.instrumentation.CoreEnvelope' ||
            schemaId === 'sf.instrumentation.MouseEvent' ||
            schemaId === 'sf.instrumentation.Payload'
        );
    }

    getImportName(schema: Schema): string {
        const moduleName = schema.namespace.replace(/\./g, '_');

        return `o11y_schema/${moduleName}`;
    }

    getSchemaName(schema: Schema): string {
        return `${schema.name[0].toLowerCase()}${schema.name.substring(1)}Schema`;
    }
}

export const schemaUtil = new SchemaUtil();
