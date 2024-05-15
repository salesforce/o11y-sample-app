import SplunkQueryBase from '../../shared/splunkQueryBase';

export default class QueryTopErrors extends SplunkQueryBase {
    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
index=${index} \`logRecordType(uxerr)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| stats count by message
| sort -count
| table message, count
`;
    }
}
