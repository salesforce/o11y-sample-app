import QueryBase from '../../shared/queryBase';

export default class QuerySimple extends QueryBase {
    handleSchemaChange(): void {
        this.setQuery(
            `
index=prod \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${this.schemaName}) 
| head 5
| spath input=userPayloadData
| table ${this.schemaType.fieldsArray.map((field) => field.name).join(', ')}
`.substring(1)
        );
    }
}
