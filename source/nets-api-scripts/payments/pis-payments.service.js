'use strict';
const randomstring = require('randomstring');
const rp = require('request-promise');
const url = require('url');

var paymentService = {
  createSinglePaymentInitiation: async (accessToken, paymentInformation, consentReference) => {
    const options = {
      url: `https://api.naas-test1.nets.eu/naas/api/v1/pis/payments`,
      headers: {
        'Accept': 'application/json',
        'Idempotency-Key': randomstring.generate(),
        'Authorization': 'Bearer ' + accessToken,
        'Naas-Account-Servicer': 'TESTNO01',
        'Naas-Consent-Reference': consentReference
      },
      json: true,
      body: {
        payment_information: {
          category_purpose: 'CT',
          debtor_account: {
            type: 'BBAN',
            value: paymentInformation.fromAccount,
            country: 'NO'
          },
          credit_transfer_transaction: {
            instruction_id: 'PISP-Ref-24SlFGLqlMDa6BBrZB5eor2',
            end_to_end_id: 'Merchant-5CTOM32Urmjha9wZQmowo72',
            instructed_amount: {
              amount: paymentInformation.amount,
              currency: paymentInformation.currency
            },
            creditor_account: {
              type: 'BBAN',
              value: paymentInformation.toAccount,
              country: 'NO'
            },
            creditor: {
              name: 'ACME INC'
            }
          }
        }
      }
    };
    var result = await rp.post(options);
    return result.data;
  }
};

module.exports = paymentService;
