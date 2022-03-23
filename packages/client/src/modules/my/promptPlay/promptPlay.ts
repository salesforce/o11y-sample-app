import { LightningElement, track } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { ComponentUtils } from '../../shared/componentUtils';

export default class PromptPlay extends LightningElement {
    private readonly _instr: Instrumentation;
    @track counter = 0;

    constructor() {
        super();
        this._instr = getInstrumentation('PromptPlay');

        setInterval(() => {
            this.counter += 1;
        }, 100);

        this._instr.registerForLogPrompt((reason: string) => {
            this._instr.log(`${this.counter}, reason`);
        });
    }
    handleRequestPrompt() {
        ComponentUtils.raiseEvent(this, 'promptrequest');
    }
}
