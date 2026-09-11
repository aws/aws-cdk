import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps
 * * Configure a SAML or OIDC IdP in the user pool.
 * * Sign in via the federated IdP.
 * * Verify the InboundFederation lambda was called via logged message in CloudWatch.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-inbound-federation');

const inboundFederationLambda = new lambda.Function(stack, 'InboundFederationLambda', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { console.log("Mocked inbound federation");return cb(null, event); }'),
});

// UserPool with inboundFederation trigger via lambdaTriggers prop
const userpoolWithProp = new cognito.UserPool(stack, 'UserPoolWithProp', {
  removalPolicy: RemovalPolicy.DESTROY,
  lambdaTriggers: {
    inboundFederation: inboundFederationLambda,
  },
});
userpoolWithProp.addClient('Client', {
  authFlows: {
    userSrp: true,
  },
});

// UserPool with inboundFederation trigger via addTrigger method
const userpoolWithMethod = new cognito.UserPool(stack, 'UserPoolWithMethod', {
  removalPolicy: RemovalPolicy.DESTROY,
});
userpoolWithMethod.addTrigger(cognito.UserPoolOperation.INBOUND_FEDERATION, inboundFederationLambda);
userpoolWithMethod.addClient('Client', {
  authFlows: {
    userSrp: true,
  },
});

const integ = new IntegTest(app, 'InboundFederationIntegTest', {
  testCases: [stack],
});

// Assertion for UserPool with lambdaTriggers prop
const describePoolWithProp = integ.assertions.awsApiCall('CognitoIdentityServiceProvider', 'describeUserPool', {
  UserPoolId: userpoolWithProp.userPoolId,
});
describePoolWithProp.assertAtPath(
  'UserPool.LambdaConfig.InboundFederation.LambdaArn',
  ExpectedResult.stringLikeRegexp('arn:aws:lambda:.*:function:.*'),
);
describePoolWithProp.assertAtPath(
  'UserPool.LambdaConfig.InboundFederation.LambdaVersion',
  ExpectedResult.stringLikeRegexp('V1_0'),
);

// Assertion for UserPool with addTrigger method
const describePoolWithMethod = integ.assertions.awsApiCall('CognitoIdentityServiceProvider', 'describeUserPool', {
  UserPoolId: userpoolWithMethod.userPoolId,
});
describePoolWithMethod.assertAtPath(
  'UserPool.LambdaConfig.InboundFederation.LambdaArn',
  ExpectedResult.stringLikeRegexp('arn:aws:lambda:.*:function:.*'),
);
describePoolWithMethod.assertAtPath(
  'UserPool.LambdaConfig.InboundFederation.LambdaVersion',
  ExpectedResult.stringLikeRegexp('V1_0'),
);
