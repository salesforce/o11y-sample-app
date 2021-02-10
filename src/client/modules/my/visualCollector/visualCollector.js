import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Sequence', fieldName: 'seq' },
    { label: 'Type', fieldName: 'logType' },
    { label: 'Timestamp', fieldName: 'logType' },
    { label: 'Root Id', fieldName: 'rootId' }
];

export default class VisualCollector extends LightningElement {
    @api
    logs;

    columns = columns;
}
