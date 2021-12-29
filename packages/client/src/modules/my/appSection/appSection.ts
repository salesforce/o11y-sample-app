import { LightningElement, api, track } from 'lwc';

export default class appSection extends LightningElement {
    @api
    label: string;

    @api
    iconName: string;

    handlePlaySlotChange(event: Event) {
        const slot = event.target as HTMLSlotElement;
        const showPlaySlot = slot.assignedElements().length !== 0;
        if (showPlaySlot) {
            this.template.querySelector('.play').classList.remove('hidden');
        }
    }
}
