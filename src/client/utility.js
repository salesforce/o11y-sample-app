class Utility {
    getKeyValues(obj) {
        return obj ? Object.keys(obj).map(key => {
            return {
                key,
                value: obj[key]
            };
        }) : [];
    }
}

export const utility = new Utility();
