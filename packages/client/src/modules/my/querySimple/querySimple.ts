import QueryBase from '../../shared/queryBase';

export default class QuerySimple extends QueryBase {
    handleInputChange(): void {
        const index = this.splunkType === 'preprod' ? 'prod' : 'prod' ? 'coreprod' : undefined;

        this.setQuery(
            index
                ? `
search index=${index} \`logRecordType(ux*)\` userPayloadSchemaName=TERM(${
                      this.schemaName
                  }) earliest=-7d
| head 5
| spath input=userPayloadData
| table ${this.schemaType.fieldsArray.map((field) => field.name).join(', ')}
`.substring(1)
                : undefined
        );
    }
}
