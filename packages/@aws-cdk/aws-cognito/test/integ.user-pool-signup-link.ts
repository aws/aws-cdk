import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { CfnUserPoolDomain, UserPool, UserPoolClient, VerificationEmailStyle } from '../lib';

/*
 * Stack verification steps:
 * * `aws cognito-idp sign-up --client-id <cfnoutput-client-id> --username user-1 --password pass1234 \
 *   --user-attributes Name="phone_number",Value="<valid-phone-number-with-intl-extension>"
 * * `aws cognito-idp sign-up --client-id <cfnoutput-client-id> --username user-2 --password pass1234 \
 *   --user-attributes Name="email",Value="<valid-email-address>"
 * * An email with the message 'integ-test: Verify by clicking on <link>' should be received.
 * * An SMS with the message 'integ-test: Account verification code is <code>' should be received.
 */

const app = new App();
const stack = new Stack(app, 'integ-user-pool-signup-link');

const userpool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
  autoVerify: {
    email: true,
    phone: true,
  },
  selfSignUpEnabled: true,
  userVerification: {
    emailStyle: VerificationEmailStyle.LINK,
    emailSubject: 'integ-test: Verify your account',
    emailBody: 'integ-test: Verify by clicking on {##Verify Email##}',
    smsMessage: 'integ-test: Account verification code is {####}',
  },
  passwordPolicy: {
    requireUppercase: false,
    requireLowercase: false,
    requireDigits: false,
    requireSymbols: false,
  },
});

const client = new UserPoolClient(stack, 'myuserpoolclient', {
  userPool: userpool,
  userPoolClientName: 'signup-test',
  generateSecret: false,
});

// replace with L2 once Domain support is available
new CfnUserPoolDomain(stack, 'myuserpooldomain', {
  userPoolId: userpool.userPoolId,
  domain: userpool.node.uniqueId,
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});

new CfnOutput(stack, 'client-id', {
  value: client.userPoolClientId,
});