import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'UserPoolPreTokenGenerationStack');

const triggerLambda = new lambda.Function(stack, 'PreTokenGenerationLambda', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { console.log("Mocked pre token generation");return cb(null, "success"); }'),
});

const userpoolV2 = new cognito.UserPool(stack, 'UserPoolV2', {
  removalPolicy: RemovalPolicy.DESTROY,
  featurePlan: cognito.FeaturePlan.PLUS,
});
userpoolV2.addTrigger(cognito.UserPoolOperation.PRE_TOKEN_GENERATION_CONFIG, triggerLambda, cognito.LambdaVersion.V2_0);
userpoolV2.addClient('Client', {
  authFlows: {
    userSrp: true,
  },
});

const userpoolV3 = new cognito.UserPool(stack, 'UserPoolV3', {
  removalPolicy: RemovalPolicy.DESTROY,
  featurePlan: cognito.FeaturePlan.PLUS,
});
userpoolV3.addTrigger(cognito.UserPoolOperation.PRE_TOKEN_GENERATION_CONFIG, triggerLambda, cognito.LambdaVersion.V3_0);
userpoolV3.addClient('Client', {
  authFlows: {
    userSrp: true,
  },
});

new integ.IntegTest(app, 'PreTokenGenerationIntegTest', {
  testCases: [stack],
});
