import { App, Duration, Stack } from '@aws-cdk/core';
import { MfaEnforcement, UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool');

new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
  userInvitation: {
    emailSubject: 'invitation email subject from the integ test',
    emailBody: 'invitation email body from the integ test for {username}. Temp password is {####}.',
    smsMessage: 'invitation sms message from the integ test for {username}. Temp password is {####}.',
  },
  selfSignUpEnabled: true,
  userVerification: {
    emailBody: 'verification email body from the integ test. Code is {####}.',
    emailSubject: 'verification email subject from the integ test',
    smsMessage: 'verification sms message from the integ test. Code is {####}.',
  },
  signInAliases: {
    username: true,
    email: true,
  },
  autoVerify: {
    email: true,
    phone: true,
  },
  mfaEnforcement: MfaEnforcement.REQUIRED,
  mfaTypes: {
    sms: true,
    oneTimePassword: true,
  },
  passwordPolicy: {
    tempPasswordValidity: Duration.days(10),
    minLength: 12,
    requireDigits: true,
    requireLowercase: true,
    requireUppercase: true,
    requireSymbols: true,
  },
  emailTransmission: {
    from: 'noreply@myawesomeapp.com',
    replyTo: 'support@myawesomeapp.com',
  },
});