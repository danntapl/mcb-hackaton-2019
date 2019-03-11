'use strict';
const tokenService = require('../nets-token.service.js');
const consentService = require('./ais-consent.service.js');
const accountsService = require('./ais-accounts.service.js');
const scaService = require('../sca.service.js');
require('colors');

// Get account information
(async () => {
  // ## Step 1: Get access token for AISP(Account Information Service Provider)
  var accessToken = await tokenService.getAccessToken(['aisp']);
  console.log('Successfully created access token'.green);

  // ## Step 2: Create a consent for reading account information
  console.log('Creating consent for reading account information');
  var consentDetails = await consentService.getConsentReferences(accessToken);
  console.log('Successfully retrieved consent'.green);

  // ## Step 3: Perform SCA(Strong Customer Authentication)
  var scaResult = await scaService.fakeSca(consentDetails.links.sca);
  console.log('Successfully faked SCA'.green);

  //## Step 4: Get account data
  var authorizationId = consentDetails.authorization.naas_authorization_id;
  // ### Get account list
  console.log('Retrieving accounts');
  var accounts = await accountsService.getAccounts(accessToken, authorizationId, scaResult.authorizationReference);
  console.log('Successfully retrieved accounts:'.green);
  console.log(accounts.reports);

  // ### Get transation list
  console.log('Retrieving account transactions');
  var transactions = await accountsService.getTransactions(accessToken, authorizationId,scaResult.authorizationReference);
  var totalTransactions = 0;
  transactions.reports.forEach(g => {
      totalTransactions += g.entries.length
  });
  console.log(`Successfully retrieved ${totalTransactions} transactions for ${transactions.reports.length} account(s)`.green);

  // ### Get account balance TODO: implement
})();
