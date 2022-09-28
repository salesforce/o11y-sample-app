import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { Instrumentation } from 'o11y/dist/modules/o11y/client/interfaces';
import { userPayloadSchema } from 'o11y_schema/sf_o11ySample';
import { CardModel } from '../../models/cardModel';
import { LogData } from '../../models/logData';

export default class CustomPlay extends LightningElement {
    @api
    model: CardModel;

    private readonly _instr: Instrumentation;

    constructor() {
        super();
        this._instr = getInstrumentation('Custom Play');
    }

    handleSubmit(): void {
        const inputs: NodeListOf<Element> = this.template.querySelectorAll('lightning-input');

        const logData: LogData = {};
        inputs.forEach((element: any) => {
            const val = element.value;
            const isEmpty = val === '' || val === undefined;
            switch (element.name) {
                case 'inputBool':
                    if (!isEmpty) {
                        logData.bool = val === 'true' || (val === 'false' ? false : val);
                    }
                    break;
                case 'inputString':
                    logData.string = String(val);
                    break;
                case 'inputInt32':
                    if (!isEmpty) {
                        logData.int32 = Number(val);
                    }
                    break;
                case 'inputInt64':
                    if (!isEmpty) {
                        logData.int64 = Number(val);
                    }
                    break;
                case 'inputUint32':
                    if (!isEmpty) {
                        logData.uint32 = Number(val);
                    }
                    break;
                case 'inputUint64':
                    if (!isEmpty) {
                        logData.uint64 = Number(val);
                    }
                    break;
                case 'inputDouble':
                    if (!isEmpty) {
                        logData.double = Number(val);
                    }
                    break;
                case 'inputRecordIds':
                    if (!isEmpty) {
                        logData.recordIds = String(val)
                            .split(',')
                            .map((x) => x.trim())
                            .filter((x) => x !== '');
                    }
                    break;
                case 'inputIgnored':
                    // This field isn't part of the schema
                    logData.ignored = val;
                    break;
                case 'inputBoolOpt':
                    if (!isEmpty) {
                        logData.isOptBool = val === 'true' || (val === 'false' ? false : val);
                    }
                    break;
                case 'inputStringOpt':
                    if (!isEmpty) {
                        logData.optString = String(val);
                    }
                    break;
                case 'inputInt32Opt':
                    if (!isEmpty) {
                        logData.optInt32 = Number(val);
                    }
                    break;
                case 'inputInt64Opt':
                    if (!isEmpty) {
                        logData.optInt64 = Number(val);
                    }
                    break;
                case 'inputUint32Opt':
                    if (!isEmpty) {
                        logData.optUint32 = Number(val);
                    }
                    break;
                case 'inputUint64Opt':
                    if (!isEmpty) {
                        logData.optUint64 = Number(val);
                    }
                    break;
                case 'inputDoubleOpt':
                    if (!isEmpty) {
                        logData.optDouble = Number(val);
                    }
                    break;
                case 'optStringEmpty':
                    if (element.checked && logData.optString === undefined) {
                        logData.optString = '';
                    }
                    break;
                default:
                    this._instr.error(new Error(`Undefined input name ${element.name}`));
                    return;
            }
        });

        try {
            // This will throw in development-mode if the logData has invalid values per the schema
            this._instr.log(userPayloadSchema, logData);
        } catch (ex) {
            this._instr.error(ex as Error);
        }
    }
}
