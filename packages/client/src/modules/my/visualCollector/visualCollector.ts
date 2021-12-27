import { LightningElement, api } from 'lwc';
import { LogModel } from '../../models/logModel';

export default class VisualCollector extends LightningElement {
    @api
    logs: LogModel[];
}
