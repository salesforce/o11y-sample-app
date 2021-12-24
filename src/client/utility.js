"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utility = void 0;
class Utility {
    getKeyValues(obj) {
        return obj ? Object.keys(obj).map(key => {
            return {
                key,
                value: obj[key]
            };
        }) : [];
    }
    getFilteredKeyValues(obj) {
        return this.getKeyValues(obj).filter(retObj => !this._isSpecialField(retObj.key));
    }
    _isSpecialField(key) {
        const specialFields = ['msg', 'pagePayload', 'appPayload'];
        return key && specialFields.indexOf(key) >= 0 || key.startsWith('_');
    }
}
exports.utility = new Utility();
