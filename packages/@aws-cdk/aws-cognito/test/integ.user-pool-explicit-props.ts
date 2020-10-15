import { Code, Function, IFunction, Runtime } from '@aws-cdk/aws-lambda';
import { App, CfnOutput, Duration, Stack } from '@aws-cdk/core';
import { BooleanAttribute, DateTimeAttribute, Mfa, NumberAttribute, StringAttribute, UserPool } from '../lib';

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
  standardAttributes: {
    fullname: {
      required: true,
      mutable: true,
    },
    email: {
      required: true,
    },
  },
  customAttributes: {
    'some-string-attr': new StringAttribute(),
    'another-string-attr': new StringAttribute({ minLen: 4, maxLen: 100 }),
    'some-number-attr': new NumberAttribute(),
    'another-number-attr': new NumberAttribute({ min: 10, max: 50 }),
    'some-boolean-attr': new BooleanAttribute(),
    'some-datetime-attr': new DateTimeAttribute(),
  },
  mfa: Mfa.OFF,
  mfaSecondFactor: {
    sms: true,
    otp: true,
  },
  passwordPolicy: {
    tempPasswordValidity: Duration.days(10),
    minLength: 12,
    requireDigits: true,
    requireLowercase: true,
    requireUppercase: true,
    requireSymbols: true,
  },
  lambdaTriggers: {
    createAuthChallenge: dummyTrigger('createAuthChallenge'),
    customMessage: dummyTrigger('customMessage'),
    defineAuthChallenge: dummyTrigger('defineAuthChallenge'),
    postAuthentication: dummyTrigger('postAuthentication'),
    postConfirmation: dummyTrigger('postConfirmation'),
    preAuthentication: dummyTrigger('preAuthentication'),
    preSignUp: dummyTrigger('preSignUp'),
    preTokenGeneration: dummyTrigger('preTokenGeneration'),
    userMigration: dummyTrigger('userMigration'),
    verifyAuthChallengeResponse: dummyTrigger('verifyAuthChallengeResponse'),
  },
});

const cognitoDomain = userpool.addDomain('myuserpooldomain', {
  cognitoDomain: {
    domainPrefix: 'myawesomeapp',
  },
});

new CfnOutput(stack, 'userpoolId', {
  value: userpool.userPoolId,
});

new CfnOutput(stack, 'cognitoDomainName', {
  value: `${cognitoDomain.domainName}.auth.${stack.region}.amazoncognito.com`,
});

function dummyTrigger(name: string): IFunction {
  return new Function(stack, name, {
    functionName: name,
    handler: 'index.handler',
    runtime: Runtime.NODEJS_12_X,
    code: Code.fromInline('foo'),
  });
}
