import { LightningElement, track } from 'lwc';

import { schemas } from '../../../../../_common/generated/schema';
import { getType } from '../../../../../_common/src/protoUtil';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';
import { Schema } from '../../../../../_common/interfaces/Schema';
import type { ComboBoxOption } from '../../types/ComboBoxOption';
import { setCode } from '../../shared/htmlUtils';

type Query = {
    key: string;
    label: string;
    name: string;
    query: string;
    cssClass?: string;
};

export default class Splunker extends LightningElement {
    @track
    schemaOptions: ComboBoxOption[];

    @track
    selectedSchemaId: string;

    @track
    queries: Query[];

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
        this.selectedSchemaId = event.detail.value;
    }
}
