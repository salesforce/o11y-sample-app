import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { userPayloadSchema } from 'o11y_schema/sf_o11ySample';

export default class InstrumentedEventPlay extends LightningElement {
    @api
    isActActive: boolean;

    private readonly _instr: Instrumentation;

    constructor() {
        super();
        this._instr = getInstrumentation('InstrumentedEvent Play');
    }

    updateDivColor(div: HTMLDivElement, colorValue: number): void {
        const hexColorString = `#${colorValue.toString(16).padStart(6, '0')}`;

        if (div.style.backgroundColor !== hexColorString) {
            div.style.backgroundColor = hexColorString;
        }
    }

    notifyAct(text: string): void {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, the click will be logged once execution resumes.`);
    }

    notifyNoAct(text: string): void {
        alert(`The handler for the ${text} is executing. If the automatic click tracker is on, it will ignore the event which the handler will log explicitly.`);
    }

    handleAnchorClick(event: MouseEvent): void {
        this.notifyAct('anchor');
        event.preventDefault();
    }

    handleAnchorLogClick(event: MouseEvent): void {
        this.notifyNoAct('anchor');
        event.preventDefault();
        this.logEvent(event);
    }

    handleInputClick(): void {
        this.notifyAct('input');
    }

    handleInputLogClick(event: MouseEvent): void {
        this.notifyNoAct('input');
        this.logEvent(event);
    }

    handleButtonClick(): void {
        this.notifyAct('button');
    }

    handleButtonLogClick(event: MouseEvent): void {
        this.notifyNoAct('button');
        this.logEvent(event);
    }

    handleLwcButtonClick(): void {
        this.notifyAct('lightning-button');
    }

    handleLwcButtonLogClick(event: CustomEvent): void {
        this.notifyNoAct('lightning-button');
        this.logEvent(event);
    }

    handleDivClick(event: MouseEvent): void {
        this.updateDivColor(event.target as HTMLDivElement, this.newColor());
    }

    handleDivLogClick(event: MouseEvent): void {
        this.updateDivColor(event.target as HTMLDivElement, this.newColor());
        this.logEvent(event);
    }

    handleToggleActClick(): void {
        this.dispatchEvent(new CustomEvent('toggleact'));
    }

    newColor(): number {
        return Math.floor(Math.random() * 0x1000000);
    }

    logEvent(event: Event): void {
        const actualColor = window.getComputedStyle(event.target as Element).backgroundColor;
        // Convert actualColor text, which comes back in the form of "rgb(x, y, z)" or "rgba(x, y, z, a)", into an actual value.
        const colorValue = actualColor.substring(actualColor.indexOf('(') + 1, actualColor.indexOf(')'))
            .split(', ')
            .slice(0, 3)
            .map(s => parseInt(s))
            .reduce((a, b) => a * 256 + b);


        this._instr.domEvent(event, this, userPayloadSchema, {
            string: actualColor,
            uint32: colorValue
        });
    }
}
