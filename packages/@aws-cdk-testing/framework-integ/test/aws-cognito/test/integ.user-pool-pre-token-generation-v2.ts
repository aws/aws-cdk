import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AdvancedSecurityMode, FeaturePlan, LambdaVersion, UserPool, UserPoolOperation } from 'aws-cdk-lib/aws-cognito';
import { STANDARD_NODEJS_RUNTIME } from '../../config';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'integ-user-pool-pre-token-generation-v2');

const triggerLambda = new lambda.Function(stack, 'preTokenGenerationLambda', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = function(event, ctx, cb) { console.log("Mocked pre token generation");return cb(null, "success"); }'),
});

const userpool = new UserPool(stack, 'pool', {
  removalPolicy: RemovalPolicy.DESTROY,
  advancedSecurityMode: AdvancedSecurityMode.ENFORCED,
  featurePlan: FeaturePlan.PLUS,
});
userpool.addTrigger(UserPoolOperation.PRE_TOKEN_GENERATION_CONFIG, triggerLambda, LambdaVersion.V2_0);

userpool.addClient('client', {
  authFlows: {
    userSrp: true,
  },
});

new integ.IntegTest(app, 'preTokenGenerationIntegTest', {
  testCases: [stack],
});

app.synth();
