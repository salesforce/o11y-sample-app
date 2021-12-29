import { KeyValue } from './interfaces/keyValue';

class Utility {
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
}

export const utility = new Utility();
