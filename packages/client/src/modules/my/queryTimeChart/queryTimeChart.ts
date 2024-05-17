import SplunkQueryBase from '../../shared/splunkQueryBase';

export default class QueryTimeChart extends SplunkQueryBase {
    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
index=${index} \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| timechart dc(clientSessionId) by loggerName span=1h
`;
    }
}
