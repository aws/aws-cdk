import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionEndpoint } from '../lib';

// The smallest web function: code from a local directory and one endpoint with the default settings
const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFunctionMinimal');

const fn = new WebFunction(stack, 'WebFunction', {
  code: WebFunctionCode.fromAsset(path.join(__dirname, 'fixture-app')),
});
new WebFunctionEndpoint(stack, 'Endpoint', {
  webFunction: fn,
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
});

new integ.IntegTest(app, 'WebFunctionMinimalTest', { testCases: [stack] });
