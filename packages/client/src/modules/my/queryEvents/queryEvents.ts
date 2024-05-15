import SplunkQueryBase from '../../shared/splunkQueryBase';

export default class QueryEvents extends SplunkQueryBase {
    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
search index=${index} \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| sort -_time`;
    }
}
