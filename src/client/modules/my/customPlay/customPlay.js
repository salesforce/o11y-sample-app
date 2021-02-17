import { LightningElement, api } from 'lwc';
import { getInstrumentation } from 'o11y/client';
import { o11ySampleSchema } from 'o11ySchema/ui-telemetry-js-schema';
export default class CustomPlay extends LightningElement {
    @api
    model;

    instr;

    constructor() {
        super();
        this.instr = getInstrumentation('Custom Play');
    }


    handleSubmit() {
        const inputs = this.template.querySelectorAll('lightning-input');

        const logData = {};
        inputs.forEach((element) => {
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
                case 'inputIgnored':
                    // This field isn't part of the schema
                    logData.ignored = val;
                    break;
                default:
                    this.instr.error(new Error(`Undefined input name ${element.name}`));
                    return;
            }
        });

        try {
            // This will throw in development-mode if the logData has invalid values per the schema
            this.instr.log(o11ySampleSchema, logData);
        } catch (ex) {
            this.instr.error(ex);
        }
    }
}