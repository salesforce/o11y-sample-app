module.exports = {
    nested: {
        sf: {
            nested: {
                salescloud: {
                    nested: {
                        MediaPlayerExperience: {
                            fields: {
                                id: {
                                    type: 'string',
                                    id: 1
                                },
                                duration: {
                                    type: 'double',
                                    id: 2
                                },
                                seekCount: {
                                    type: 'double',
                                    id: 3
                                },
                                connectionType: {
                                    rule: 'repeated',
                                    type: 'string',
                                    id: 4
                                },
                                stalled: {
                                    rule: 'repeated',
                                    type: 'double',
                                    id: 5
                                },
                                waiting: {
                                    rule: 'repeated',
                                    type: 'double',
                                    id: 6
                                },
                                error: {
                                    rule: 'repeated',
                                    type: 'string',
                                    id: 7
                                },
                                emptied: {
                                    rule: 'repeated',
                                    type: 'double',
                                    id: 8
                                },
                                ratechange: {
                                    rule: 'repeated',
                                    type: 'string',
                                    id: 9
                                },
                                seeked: {
                                    rule: 'repeated',
                                    type: 'double',
                                    id: 10
                                },
                                rtt: {
                                    type: 'double',
                                    id: 11
                                },
                                userId: {
                                    type: 'string',
                                    id: 12
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
