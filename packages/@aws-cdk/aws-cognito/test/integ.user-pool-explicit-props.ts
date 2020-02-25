import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { BooleanAttr, DateTimeAttr, NumberAttr, StandardAttrs, StringAttr, UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-user-pool');

const userpool = new UserPool(stack, 'myuserpool', {
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
  requiredAttrs: [ StandardAttrs.NAME, StandardAttrs.EMAIL ],
  customAttrs: {
    'some-string-attr': new StringAttr(),
    'another-string-attr': new StringAttr({ minLen: 4, maxLen: 100 }),
    'some-number-attr': new NumberAttr(),
    'another-number-attr': new NumberAttr({ min: 10, max: 50 }),
    'some-boolean-attr': new BooleanAttr(),
    'some-datetime-attr': new DateTimeAttr(),
  }
});

new CfnOutput(stack, 'userpoolId', {
  value: userpool.userPoolId
});