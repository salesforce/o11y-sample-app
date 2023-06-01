import QueryBase from '../../shared/queryBase';

export default class QueryFields extends QueryBase {
    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
search index=${index} \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| spath input=userPayloadData
| table ${this.schemaType.fieldsArray.map((field) => field.name).join(', ')}
`;
    }
}
