import { KeyValue } from './interfaces/keyValue';

const MAX_INT = Math.pow(2, 31) - 1;

class Utility {
    get maxInt(): number {
        return MAX_INT;
    }

    getKeyValues(obj?: Record<string, unknown>): KeyValue[] {
        return obj
            ? Object.keys(obj).map((key) => {
                  return {
                      key,
                      value: obj[key]
                  };
              })
            : [];
    }

    getFilteredKeyValues(obj?: Record<string, unknown>): KeyValue[] {
        return this.getKeyValues(obj).filter((retObj) => !this._isSpecialField(retObj.key));
    }

    _isSpecialField(key: string): boolean {
        const specialFields = ['msg', 'pagePayload', 'appPayload'];
        return (key && specialFields.indexOf(key) >= 0) || key.startsWith('_');
    }

    asNumber(value: string | number): number | undefined {
        return value === undefined ? undefined : Number(value);
    }
}

export const utility = new Utility();
