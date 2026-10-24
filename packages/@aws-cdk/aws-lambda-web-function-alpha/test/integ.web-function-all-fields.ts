import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  WebFunction,
  WebFunctionApplicationLogLevel,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpoint,
  WebFunctionEndpointType,
  WebFunctionSystemLogLevel,
} from '../lib';

// A web function that sets every supported prop, with an endpoint that sets its scaling and throttling
const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFunctionAllFields');

const kmsKey = new kms.Key(stack, 'Key', { enableKeyRotation: true, removalPolicy: cdk.RemovalPolicy.DESTROY });
const role = new iam.Role(stack, 'ExecutionRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
});

const fn = new WebFunction(stack, 'WebFunction', {
  code: WebFunctionCode.fromAsset(path.join(__dirname, 'fixture-app')),
  webFunctionName: 'all-fields',
  description: 'every supported property',
  runtime: lambda.Runtime.NODEJS_24_X,
  role,
  timeout: cdk.Duration.seconds(30),
  maxConcurrencyPerEnvironment: 32,
  environment: { NODE_ENV: 'test', APP_VERSION: '1' },
  kmsKey,
  applicationLogLevel: WebFunctionApplicationLogLevel.INFO,
  systemLogLevel: WebFunctionSystemLogLevel.WARN,
  tags: { Team: 'platform' },
});

const endpoint = new WebFunctionEndpoint(stack, 'Endpoint', {
  webFunction: fn,
  webFunctionEndpointName: 'prod',
  description: 'production endpoint',
  endpointType: WebFunctionEndpointType.HOME_REGION,
  authType: WebFunctionAuthType.IAM_AUTH,
  maxEnvironments: 10,
  rateLimit: 500,
});
endpoint.grants.invoke(new iam.ServicePrincipal('events.amazonaws.com'));
fn.grants.invoke(new iam.AccountRootPrincipal());

new integ.IntegTest(app, 'WebFunctionAllFieldsTest', { testCases: [stack] });
