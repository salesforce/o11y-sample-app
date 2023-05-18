import { LightningElement, track } from 'lwc';
import { schemas } from '../../../../../_common/generated/schema';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';

type ComboBoxOption = {
    label: string;
    value: string;
};

export default class Utility extends LightningElement {
    @track
    schemaOptions: ComboBoxOption[];

    @track
    names: string;

    @track
    selectedSchema: string;

    constructor() {
        super();
        this.schemaOptions = Array.from(schemas.keys())
            .filter((name) => !schemaUtil.isInternal(name))
            .map((name) => ({
                label: name,
                value: name
            }));
    }

    handleSchemaChange(event: CustomEvent) {
        this.selectedSchema = event.detail.value;
    }
}
