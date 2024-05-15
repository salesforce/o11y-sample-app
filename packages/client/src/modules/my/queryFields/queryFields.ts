import SplunkQueryBase from '../../shared/splunkQueryBase';

export default class QueryFields extends SplunkQueryBase {
    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
search index=${index} \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| spath input=userPayloadData
| table ${this.schemaType.fieldsArray.map((field) => field.name).join(', ')}
`;
    }
}
