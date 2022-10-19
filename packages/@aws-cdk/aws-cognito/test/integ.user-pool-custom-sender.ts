import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

/*
 * Stack verification steps
 * * Sign up to the created user pool using an email address as the username, and password.
 * * Verify the CustomEmailSender lambda was called via logged message in CloudWatch.
 */
const app = new App();
const stack = new Stack(app, 'integ-user-pool-custom-sender');

const customSenderLambda = new lambda.Function(stack, 'emailLambda', {
  runtime: lambda.Runtime.NODEJS_14_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { console.log("Mocked custom email send");return cb(null, "success"); }'),
});

const userpool = new UserPool(stack, 'pool', {
  autoVerify: {
    email: true,
  },
  selfSignUpEnabled: true,
  signInAliases: {
    email: true,
  },
  customSenderKmsKey: new kms.Key(stack, 'key'),
  lambdaTriggers: {
    customEmailSender: customSenderLambda,
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

const client = userpool.addClient('client', {
  authFlows: {
    userSrp: true,
  },
});

new CfnOutput(stack, 'UserPoolId', {
  value: userpool.userPoolId,
});

new CfnOutput(stack, 'ClientId', {
  value: client.userPoolClientId,
});
