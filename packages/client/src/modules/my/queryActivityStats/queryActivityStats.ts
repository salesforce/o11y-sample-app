import SplunkQueryBase from '../../shared/splunkQueryBase';

export default class QueryActivityStats extends SplunkQueryBase {
    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
index=${index} \`logRecordType(uxact)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| stats p95(duration) as P95_duration, avg(duration) as AVG_duration, max(duration) as MAX_duration, min(duration) as MIN_duration, count by name
| sort name
| table name, count, P95_duration, AVG_duration, MAX_duration, MIN_duration
`;
    }
}
