import { LightningElement, track, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { ComponentUtils } from '../../shared/componentUtils';

export default class PromptPlay extends LightningElement {
    private readonly _instr: Instrumentation;
    private static readonly RANDOM_RECORD_ID_LEN: number = 8
    private _aggregatedData: string[];

    @track counter = 0;
    @track stringInput = PromptPlay.getRandomAlphaNumericString(PromptPlay.RANDOM_RECORD_ID_LEN)
    @api recordId: string;

    constructor() {
        super();
        this._instr = getInstrumentation('PromptPlay');
        this._aggregatedData = new Array();

        this._instr.registerForLogPrompt((reason: string) => {
            this._instr.log(`${this._aggregatedData}`);
        });
    }

    handlePromptLogCollection() {
        ComponentUtils.raiseEvent(this, 'promptrequest');
        this.counter = 0
        this._aggregatedData = new Array()
    }

    handleAggregate() {
        this._aggregatedData.push(this.stringInput);
        this.stringInput = PromptPlay.getRandomAlphaNumericString(PromptPlay.RANDOM_RECORD_ID_LEN);
        this.counter++
    }

    handleStringInputChange(event: CustomEvent){
        this.stringInput = event.detail.value;
    }

    handleSkip() {
        this.stringInput = PromptPlay.getRandomAlphaNumericString(PromptPlay.RANDOM_RECORD_ID_LEN);
    }

    static getRandomAlphaNumericString(length: number): string {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
