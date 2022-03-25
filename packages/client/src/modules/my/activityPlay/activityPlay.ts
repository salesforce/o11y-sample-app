import { LightningElement, track } from 'lwc';

export default class ActivityPlay extends LightningElement {
    @track activity1 = 'Activity 1';
    @track activity2 = 'Activity 2';
    @track activity3 = 'Activity 3';

    handleNameChange(event: CustomEvent): void {
        const name = event.detail.value;
        const element = event.detail.sender;

        switch (element.getAttribute('data-name')) {
            case 'activity1':
                this.activity1 = name;
                break;
            case 'activity2':
                this.activity2 = name;
                break;
            case 'activity3':
                this.activity3 = name;
                break;
            default:
                throw new Error('Unrecognized activity name in data-name');
        }
    }
}
