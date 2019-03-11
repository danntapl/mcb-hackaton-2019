'use strict';
const randomstring = require('randomstring');
const rp = require('request-promise');
const url = require('url');

var scaService = {
  fakeSca: async (scaUrl) => {
    var scaResult = await rp(scaUrl + '&simulator=accept');//To get result as string instead of http redirect to SCA
    var url_parts = url.parse(scaResult, true);
    var naasAuthorizationReference = url_parts.query.authorizationReference.replace('"', '');
    return { authorizationReference: naasAuthorizationReference };
  }
};

module.exports = scaService;
