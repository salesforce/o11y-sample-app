import { LightningElement, track } from 'lwc';

import { schemas } from '../../../../../_common/generated/schema';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';
import type { ComboBoxOption } from '../../types/ComboBoxOption';

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
    splunkTypes: ComboBoxOption[] = [
        {
            value: 'preprod',
            label: 'Pre-production (use this one for test environments)'
        },
        {
            value: 'prod',
            label: 'Production (use this one for org62, gus and other production environments)'
        }
    ];

    @track
    selectedSplunkType: string;

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

    get areInputsValid(): boolean {
        return this.selectedSplunkType !== undefined && this.selectedSchemaId !== undefined;
    }

    handleSchemaChange(event: CustomEvent) {
        this.selectedSchemaId = event.detail.value;
    }

    handleSplunkTypeChange(event: CustomEvent) {
        this.selectedSplunkType = event.detail.value;
    }
}
