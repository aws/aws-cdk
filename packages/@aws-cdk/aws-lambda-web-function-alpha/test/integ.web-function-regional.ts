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

// One web function served by a MultiRegion endpoint (global domain) and a PerRegion endpoint (a domain per Region).
// The home Region is added automatically, so the regions list names only the other Region.
const app = new cdk.App();
// The home Region is pinned to eu-west-1, so the replica Region is always a different one
const stack = new cdk.Stack(app, 'WebFunctionRegional', { env: { region: 'eu-west-1' } });

const fn = new WebFunction(stack, 'WebFunction', {
  code: WebFunctionCode.fromAsset(path.join(__dirname, 'fixture-app')),
});

new WebFunctionEndpoint(stack, 'Global', {
  webFunction: fn,
  webFunctionEndpointName: 'global',
  endpointType: WebFunctionEndpointType.MULTI_REGION,
  regions: ['us-east-1'],
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
});
new WebFunctionEndpoint(stack, 'PerRegion', {
  webFunction: fn,
  webFunctionEndpointName: 'perregion',
  endpointType: WebFunctionEndpointType.PER_REGION,
  regions: ['us-east-1'],
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
});

new integ.IntegTest(app, 'WebFunctionRegionalTest', { testCases: [stack] });
