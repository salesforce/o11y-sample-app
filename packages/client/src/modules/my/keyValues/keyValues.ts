import { LightningElement, api } from 'lwc';
import { KeyValue } from '../../../interfaces/keyValue';

export default class KeyValues extends LightningElement {
    @api
    model: KeyValue[];
}
