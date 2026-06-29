import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { App, Stack } from 'aws-cdk-lib';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'aws-cdk-lambda-1');

const fn = new lambda.Function(stack, 'MyLambda', {
  code: new lambda.InlineCode('foo'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const apigw = new RestApi(stack, 'MyRestApi', {
  defaultMethodOptions: {
    apiKeyRequired: true,
  },
});

apigw.root.addMethod('GET', new LambdaIntegration(fn));
apigw.root.addMethod('POST', new LambdaIntegration(fn), {
  apiKeyRequired: false,
});

new integ.IntegTest(app, 'LambdaTest', {
  testCases: [stack],
});

app.synth();
