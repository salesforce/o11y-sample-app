import { api } from 'lwc';
import QueryBase from '../../shared/queryBase';

export default class QueryUsage extends QueryBase {
    private _by: string;
    @api
    get by(): string {
        return this._by;
    }
    set by(value: string) {
        this._by = value;
        this.updateQuery();
    }

    protected getQuery(index: string, schemaId: string, loggerAppName: string): string {
        return `
index=${index} \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${schemaId}) loggerAppName=${loggerAppName} earliest=-1d
| stats count by ${this.by}
| sort -count
`;
    }
}
