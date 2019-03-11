'use strict';

const randomstring = require('randomstring');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const rp = require('request-promise');

var consentService = {
  getConsentReferences: async accessToken => {
    const options = {
      url: 'https://api.naas-test1.nets.eu/naas/api/v1/ais/authorizations',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Idempotency-Key': randomstring.generate(),
        'Naas-Request-Id': uuidv1(),
        'Authorization': 'Bearer ' + accessToken
      },
      json: true,
      body: {
        instruction_id: '05d92489-9ef6-4fd2-9c0b-84e9e9c4bf5',
        first_use_date_time: moment(),
        last_use_date_time: moment().add(2, 'days'),
        frequency: 'Recurring',
        account_query: {
          content: ['balance', 'entries', 'info'],
          headers: {},
          account_servicer: {
            bic: 'TESTNO01',
            name: 'Test ASPSP',
            country: 'NO'
          },
          account_owner: {
            ssn: '1234567'
          },
          account: {
            type: 'IBAN',
            value: 'NO8399990522223',
            country: 'NO',
            currency: 'NOK'
          }
        }
      }
    };

    var consentResult = await rp.post(options);
    return consentResult.data;
  }
};

module.exports = consentService;
