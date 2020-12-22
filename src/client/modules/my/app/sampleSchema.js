export default {
    nested: {
        SampleNamespace: {
            nested: {
                SampleName: {
                    fields: {
                        requiredString: {
                            type: 'string',
                            id: 1,
                            rule: 'required'
                        },
                        optionalString: {
                            type: 'string',
                            id: 2
                        }
                    }
                }
            }
        }
    }
};
