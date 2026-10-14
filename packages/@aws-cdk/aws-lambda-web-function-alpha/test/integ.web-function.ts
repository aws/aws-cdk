import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import {
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpoint,
  WebFunctionEndpointType,
} from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-lambda-web-function-integ');

const fn = new WebFunction(stack, 'WebFunction', {
  code: WebFunctionCode.fromAsset(path.join(__dirname, 'fixture-app')),
  timeout: cdk.Duration.seconds(30),
  environment: { NODE_ENV: 'test' },
});

new WebFunctionEndpoint(stack, 'Endpoint', {
  webFunction: fn,
  webFunctionEndpointName: 'prod',
  endpointType: WebFunctionEndpointType.HOME_REGION,
  authType: WebFunctionAuthType.IAM_AUTH,
  rateLimit: 100,
});

new WebFunctionEndpoint(stack, 'PublicEndpoint', {
  webFunction: fn,
  webFunctionEndpointName: 'public',
  endpointType: WebFunctionEndpointType.HOME_REGION,
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
});

new integ.IntegTest(app, 'LambdaWebFunctionInteg', {
  testCases: [stack],
});
