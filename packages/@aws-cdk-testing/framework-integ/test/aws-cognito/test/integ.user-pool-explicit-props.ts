import { Code, Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import { App, CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AdvancedSecurityMode, BooleanAttribute, DateTimeAttribute, FeaturePlan, Mfa, NumberAttribute, StringAttribute, UserPool } from 'aws-cdk-lib/aws-cognito';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-user-pool');

const userpool = new UserPool(stack, 'myuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
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
  keepOriginal: {
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
  advancedSecurityMode: AdvancedSecurityMode.ENFORCED,
  featurePlan: FeaturePlan.PLUS,
  snsRegion: Stack.of(stack).region,
});

const cognitoDomain = userpool.addDomain('myuserpooldomain', {
  cognitoDomain: {
    domainPrefix: 'cdkintegrationtestuserpoolexplicitprops',
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
    runtime: STANDARD_NODEJS_RUNTIME,
    code: Code.fromInline('foo'),
  });
}
