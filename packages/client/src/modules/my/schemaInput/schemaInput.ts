import { api, LightningElement, track } from 'lwc';
import { getType } from '../../../../../_common/src/protoUtil';
import { ComponentUtils } from '../../shared/componentUtils';

type Value = boolean | number | string | (boolean | number | string)[];
type Field = {
    key: string;
    id: number;
    name: string;
    type: string;
    repeated: boolean;
    required: boolean;
    p3Optional: boolean;
};
export type Data = Record<string, Value>;

export default class SchemaInput extends LightningElement {
    private _data: Data = {};

    private _schema: string;
    @api
    get schema(): string {
        return this._schema;
    }
    set schema(value) {
        if (this._schema !== value) {
            this._schema = value;
            this._updateFields();
        }
    }

    @track
    fields: Field[] = [];

    private _updateFields() {
        if (this._schema) {
            this.fields = getType(this._schema).fieldsArray.map((item) => {
                const isBoolean = item.type === 'bool';
                const isString = item.type == 'string';
                const isNumber =
                    ['int32', 'uint32', 'int64', 'uint64', 'double'].indexOf(item.type) >= 0;
                const isUnknown = !isBoolean && !isString && !isNumber;

                return {
                    key: `{${this._schema}${item.id}`,
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    repeated: item.repeated,
                    required: item.required,
                    p3Optional: item.options?.proto3_optional,
                    label: item.name,
                    isBoolean,
                    isNumber,
                    isString,
                    isUnknown
                };
            });
        } else {
            this.fields = [];
        }
        this._data = {};
        this._raiseDataChange();
    }

    private _updateData(name: string, value: string) {
        const field = this.fields.find((field) => field.name === name);
        const type = field.type;

        // TODO: deal with field.p3Optional

        if (value === '') {
            delete this._data[name];
        } else {
            let newValue;
            if (field.repeated) {
                const values = value.split('\n');
                newValue = values.map((v) => this._getTypedValue(v, type));
            } else {
                newValue = this._getTypedValue(value, type);
            }
            this._data[name] = newValue;
        }

        this._raiseDataChange();
    }

    private _raiseDataChange() {
        const data = { ...this._data };
        ComponentUtils.raiseEvent(this, 'datachange', data);
    }

    private _getTypedValue(value: string, type: string): number | string | boolean {
        switch (type) {
            case 'bool':
                return value === 'true' || (value === 'false' ? false : value);
            case 'string':
                return String(value);
            case 'double':
            case 'int32':
            case 'int64':
            case 'uint32':
            case 'uint64':
                const tmp = Number(value);
                return isNaN(tmp) ? value : tmp;
        }
    }

    handleChangeInput(event: CustomEvent) {
        const name = (event.target as HTMLInputElement).name;
        this._updateData(name, event.detail.value);
    }

    handleChangeTextArea(event: CustomEvent) {
        const name = (event.target as HTMLTextAreaElement).name;
        this._updateData(name, event.detail.value);
    }
}
