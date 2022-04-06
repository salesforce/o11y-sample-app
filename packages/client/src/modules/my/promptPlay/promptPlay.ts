import { LightningElement, track, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { ComponentUtils } from '../../shared/componentUtils';
import { userPayloadSchema } from 'o11y_schema/sf_o11ySample'

export default class PromptPlay extends LightningElement {
    private readonly _instr: Instrumentation;
    private static readonly RANDOM_RECORD_ID_LEN: number = 8

    aggregatedData: string[];

    @track recordId = PromptPlay.getRandomAlphaNumericString()

    constructor() {
        super();
        this._instr = getInstrumentation('PromptPlay');
        this.aggregatedData = [];

        this._instr.registerForLogPrompt((reason: string) => {
            this._instr.log(userPayloadSchema, { recordIds: this.aggregatedData });
        });
    }

    handlePromptLogCollection() {
        ComponentUtils.raiseEvent(this, 'promptrequest');
        this.aggregatedData = new Array()
    }

    handleTake() {
        this.aggregatedData.push(this.recordId);
        this.recordId = PromptPlay.getRandomAlphaNumericString();
    }

    handleRecordIdChange(event: CustomEvent) {
        this.recordId = event.detail.value;
    }

    handleSkip() {
        this.recordId = PromptPlay.getRandomAlphaNumericString();
    }

    static getRandomAlphaNumericString(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < PromptPlay.RANDOM_RECORD_ID_LEN; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
