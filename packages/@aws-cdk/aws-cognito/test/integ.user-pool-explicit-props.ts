import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { BooleanAttribute, DateTimeAttribute, NumberAttribute, StandardAttribute, StringAttribute, UserPool } from '../lib';

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
  requiredAttributes: [ StandardAttribute.NAME, StandardAttribute.EMAIL ],
  customAttributes: {
    'some-string-attr': new StringAttribute(),
    'another-string-attr': new StringAttribute({ minLen: 4, maxLen: 100 }),
    'some-number-attr': new NumberAttribute(),
    'another-number-attr': new NumberAttribute({ min: 10, max: 50 }),
    'some-boolean-attr': new BooleanAttribute(),
    'some-datetime-attr': new DateTimeAttribute(),
  }
});

new CfnOutput(stack, 'userpoolId', {
  value: userpool.userPoolId
});