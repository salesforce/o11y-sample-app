import { LightningElement, api } from 'lwc';

export default class appSection extends LightningElement {
    @api
    label: string;

    @api
    iconName: string;
}
