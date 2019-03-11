# Nets NAAS sandbox samples
This repository contains samples for calls against Nets' sandbox environment for PSD2 apis.

The samples are ment for easily describing the flow for getting tokens, creating consents, accessing accounts with transactions and creating payments.

Proposed use for the scripts are(but not limited to):
* Understanding which bank capabilities these API's represent
* "Debugging" and outputting data for use in concept development
* Copy&pasting into own project code

For more information about the API's visit [https://sandbox.naas-test1.nets.eu/#/landing-page](https://sandbox.naas-test1.nets.eu/#/landing-page)

Login credentials can be obtained by contacting the Sparebanken Vest representation personally at the hackaton or reaching out to me on Slack/Teams.


## Setup & prerequisites

In order to run the project you need NodeJS installed. Installation instruction can be found [here](https://nodejs.org/en/).

Clone, fork or download the project and navigate to the `[project-root]/source/nets-api-scripts` directory in your favourite terminal.

### Token
The Nets PSD2 api uses [OAuth2](https://oauth.net/2/) and requires an access token to be presented on all api calls. 
To obtain a token, credentials in the form of `clientId` and `clientSecret`(username&password) are needed. These can be obtained by contacting the Sparebanken Vest representation at the hackaton event.

Update `[project-root]/source/nets-api-scripts/app.config.js` with the `clientId` and `clientSecret`.

### Running the samples
To run the samples as is do the following:
```sh
# Install dependencies
npm install

# Test the accounts flow
npm run test-accounts

# Test the payments flow
npm run test-payments

# Test the all flows
npm run test-all

```

## Consent and SCA(Strong Customer Authentication)
Getting account information and creating payments require the TPP(Third Party Provider) that wants to implement banking services for their end-users, to obtain consents from the account owner.

The procedure to obtain this is by letting the end-user authenticate theirselves with SCA(Strong Customer Authentication) at their bank(ASPSP) and granting the TPP a time-limited access to the accounts or for creating payments.

This is done by using a OIDC(OpenID Connect) authorization flow where the user gets redirected to their banks own login and can confirm consent or payment details.

Once this is done an "authorization/consent" reference is returned and is included in a custom header in subsequent api calls(`Naas-Consent-Reference`).

For this hackaton the Nets sandbox is a simulator that has been preconfigured with certain results that fits the sample scripts. In essence this is the "happy path" where all consents and payments are approved. 

The SCA has also been "faked" in the sample scripts and no redirect and login is required to run against the sandbox. 

To better understand the process and plan for it in your concepts/solutions, it can be compared to a Facebook/Twitter login to other third-party services.

## Accounts
The accounts services will allow you to list accounts, view account information, balance and list transactions.

The sample scripts handles creating a consent and "faking" the SCA process. It will then output the accounts found and a summary of the transactions. These sample scripts might of course be tuned to output more information to suit your needs. 

For a full description of the account data available and services not provided an example for, is available in the Nets developer documentation [here](https://sandbox.naas-test1.nets.eu/#/documentation)

## Payments
These services allow you to create current, future dated or periodic payment. When creating a payment, this service is configured to always ask for SCA to authorize the payment. 

In "real life" there are scenarios where this might not be required(exempted) such as payments between own accounts(transfers) or when the amount is below a certain threshold(30 EUR). The reasoning for always asking for SCA, is to better illustrate how the full cycle of a payment works.

Have a look in [`src/nets-api-scripts/payments/index.js`](src/nets-api-scripts/payments/index.js) for examples on how to create payments. Additional information about the payment API can be found in the Nets developer documentation [here](https://sandbox.naas-test1.nets.eu/#/documentation).