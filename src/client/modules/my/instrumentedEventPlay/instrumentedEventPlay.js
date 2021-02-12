import { LightningElement } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { o11ySampleSchema } from '../../../../schemas/exports/KnownSchemas';

export default class InstrumentedEventPlay extends LightningElement {
    divColorValue = 0;

    constructor() {
        super();
        this.instr = getInstrumentation('InstrumentedEvent Play');
    }

    renderedCallback() {
        this.updateDivColor();
    }

    updateDivColor() {
        const clickTarget = this.template.querySelector('.click-target');
        const hexColorString = `#${this.divColorValue.toString(16).padStart(6, '0')}`;

        if (clickTarget.style.backgroundColor !== hexColorString) {
            clickTarget.style.backgroundColor = hexColorString;
        }
    }

    notify(text) {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, the click will be logged once execution resumes.`);
    }

    handleInputClick() {
        this.notify('input');
    }

    handleButtonClick() {
        this.notify('button');
    }

    handleLwcButtonClick() {
        this.notify('lightning-button');
    }

    handleDivClick(event) {
        const actualColor = window.getComputedStyle(this.template.querySelector('.click-target')).backgroundColor;

        this.instr.domEvent(event, this, o11ySampleSchema, {
            uint32: this.divColorValue,
            string: actualColor,
        });
        this.divColorValue = Math.floor(Math.random() * 0x1000000);
        this.updateDivColor();
    }
}
