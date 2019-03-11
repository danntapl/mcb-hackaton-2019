'use strict';
const config = require('./app.config.js');
const ClientOAuth2 = require('client-oauth2');

//TODO: Maybe cache token to avvoid getting new one for each call
var netsTokenService = {
    getAccessToken: async (scopes) => { 
        var oauthClient = new ClientOAuth2({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            accessTokenUri: config.tokenHost,
            scopes: scopes
        });
        const token = await oauthClient.credentials.getToken();
        return token.accessToken;
    }
};

module.exports = netsTokenService;