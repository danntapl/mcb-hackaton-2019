'use strict';
const tokenService = require('../nets-token.service.js');
const paymentService = require('./pis-payments.service.js');
const scaService = require('../sca.service.js');
const consentService = require('./pis-consent.service.js');
require('colors');

// Create payments
(async () => {
  // ## Step 1: Get access token for PISP(Payment Initiation Service Provider)
  var accessToken = await tokenService.getAccessToken(['pisp']);
  console.log('Successfully created access token'.green);

  // ## Step 2: Create a single payment initiation
  console.log('Creating a single payment');
  var paymentInformation = {
    fromAccount:'99990439571',
    toAccount: '99990439571',
    amount: 42,
    currency: 'NOK'
  }
  var paymentInitiationResult = await paymentService.createSinglePaymentInitiation(accessToken, paymentInformation);
  console.log('Successfully created a payment initiation'.green);

  // ## Step 3: Perform SCA(Strong Customer Authentication)
  console.log('Payment is configured to require SCA. Fake it since it does not exist in simulated environment');
  var scaResult = await scaService.fakeSca(paymentInitiationResult.links.sca);
  console.log('Successfully faked SCA'.green);

  // ## Step 4: Re-send the payment with authorisation(consent reference)
  console.log('Re-sending the same payment inititiation, but with authorization/consent reference');
  var paymentInitiationResult = await paymentService.createSinglePaymentInitiation(accessToken, paymentInformation, scaResult.authorizationReference);
  // Since the simulator is configured to always return `AuthorizationRequired` it will not actually 
  // be authorized here, but that is what it is supposed to do in a real environment
  console.log('Successfully authorized payment'.green);
})();
