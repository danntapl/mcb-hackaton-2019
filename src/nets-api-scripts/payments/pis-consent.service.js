'use strict';

const randomstring = require('randomstring');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const url = require('url');
const rp = require('request-promise');

var consentService = {
  getConsentReferences: async (accessToken, paymentInformation, consentOptions) => {
    const options = {
      url: 'https://api.naas-test1.nets.eu/naas/api/v1/pis/authorizations',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Idempotency-Key': randomstring.generate(),
        'Naas-Request-Id': uuidv1(),
        Authorization: 'Bearer ' + accessToken
      },
      json: true,
      body: {
        instruction_id: 'PISP-Ref-6HQWzxzoM0d3KSOHRREDie',
        first_use_date_time: moment(),
        last_use_date_time: moment().add(60, 'seconds'),
        frequency: consentOptions.frequency,//'Recurring',
        payment_information: {
          debtor_account: {
            type: 'BBAN',
            value: paymentInformation.fromAccount,
            country: 'NO'
          },
          creditor_account: {
            type: 'BBAN',
            value: paymentInformation.toAccount,
            country: 'NO'
          },
          creditor: {
            name: 'ACME INC'
          },
          instructed_amount: {
            amount: paymentInformation.amount,
            currency: paymentInformation.currency
          }
        }
      }
    };

    var consentResult = await rp.post(options);
    var naasAuthorizationId =
      consentResult.data.authorization.naas_authorization_id;
    var naasAuthorizationReference = null;
    console.debug('Consent created with authorization id:', naasAuthorizationId);
    
    if (consentResult.data.status_reason.status === 'AuthorizationRequired') {
      console.debug('SCA required. Auto handling...');
      var scaLink = consentResult.data.links.sca + '&simulator=accept'; //To get result as string instead of http redirect to SCA
      var scaResult = await rp(scaLink);
      var url_parts = url.parse(scaResult, true);
      var query = url_parts.query;
      naasAuthorizationReference = query.authorizationReference.replace('"', '');
      console.debug('SCA finished with authorization reference:', naasAuthorizationReference);
    }
    return {
      authorizationId: naasAuthorizationId,
      authorizationReference: naasAuthorizationReference
    };
  }
};

module.exports = consentService;
