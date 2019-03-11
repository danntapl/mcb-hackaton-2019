'use strict';
const rp = require('request-promise');

var accountsService = {
    getAccounts: async (accessToken, authorizationId, authorizationReference) => {
        const options = {
            url: `https://api.naas-test1.nets.eu/naas/api/v1/ais/queries/${authorizationId}/info`,
            headers: {
                'Accept': 'application/json',
                'Naas-Consent-Reference': authorizationReference,
                'naas_authorization_id': authorizationId,
                'Authorization': 'Bearer ' + accessToken,
                'Naas-Account-Servicer': 'TESTNO01'
            },
            json: true
        };
        var result = await rp(options);
        return result.data;
    },
    getTransactions: async (accessToken, authorizationId, authorizationReference) => {
        const options = {
            url: `https://api.naas-test1.nets.eu/naas/api/v1/ais/queries/${authorizationId}/entries`,
            headers: {
                'Accept': 'application/json',
                'Naas-Consent-Reference': authorizationReference,
                'naas_authorization_id': authorizationId,
                'Authorization': 'Bearer ' + accessToken,
                'Naas-Account-Servicer': 'TESTNO01'
            },
            json: true
        };
        var result = await rp(options);
        return result.data;
    }
};

module.exports = accountsService;