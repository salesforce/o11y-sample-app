import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { o11ySampleSchema } from 'o11ySchema/sf_instrumentation';

export default class InstrumentedEventPlay extends LightningElement {
    @api
    isActActive;

    constructor() {
        super();
        this.instr = getInstrumentation('InstrumentedEvent Play');
    }

    updateDivColor(div, colorValue) {
        const hexColorString = `#${colorValue.toString(16).padStart(6, '0')}`;

        if (div.style.backgroundColor !== hexColorString) {
            div.style.backgroundColor = hexColorString;
        }
    }

    notifyAct(text) {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, the click will be logged once execution resumes.`);
    }

    notifyNoAct(text) {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, it will ignore the event which the handler will log explicitly.`);
    }

    handleAnchorClick(event) {
        this.notifyAct('anchor');
        event.preventDefault();
    }

    handleAnchorLogClick(event) {
        this.notifyNoAct('anchor');
        event.preventDefault();
        this.logEvent(event);
    }

    handleInputClick() {
        this.notifyAct('input');
    }

    handleInputLogClick(event) {
        this.notifyNoAct('input');
        this.logEvent(event);
    }

    handleButtonClick() {
        this.notifyAct('button');
    }

    handleButtonLogClick(event) {
        this.notifyNoAct('button');
        this.logEvent(event);
    }

    handleLwcButtonClick() {
        this.notifyAct('lightning-button');
    }

    handleLwcButtonLogClick(event) {
        this.notifyNoAct('lightning-button');
        this.logEvent(event);
    }

    handleDivClick(event) {
        this.updateDivColor(event.target, this.newColor());
    }

    handleDivLogClick(event) {
        this.updateDivColor(event.target, this.newColor());
        this.logEvent(event);
    }

    handleToggleActClick() {
        this.dispatchEvent(new CustomEvent('toggleact'));
    }

    newColor() {
        return Math.floor(Math.random() * 0x1000000);
    }

    logEvent(event) {
        const actualColor = window.getComputedStyle(event.target).backgroundColor;
        // Convert actualColor text, which comes back in the form of "rgb(x, y, z)" or "rgba(x, y, z, a)", into an actual value.
        const colorValue = actualColor.substring(actualColor.indexOf('(') + 1, actualColor.indexOf(')'))
            .split(', ')
            .slice(0, 3)
            .map(s => parseInt(s))
            .reduce((a, b) => a * 256 + b);


        this.instr.domEvent(event, this, o11ySampleSchema, {
            string: actualColor,
            uint32: colorValue
        });
    }
}
