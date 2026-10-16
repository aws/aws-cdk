import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  NetworkConnector,
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpoint,
  WebFunctionEndpointType,
} from '../lib';

// A web function with egress through a connector, and an IAM endpoint whose function has a resource-based policy
const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFunctionEgress');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  natGateways: 0,
  subnetConfiguration: [{ name: 'isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 24 }],
});
const connector = new NetworkConnector(stack, 'Connector', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});

const fn = new WebFunction(stack, 'WebFunction', {
  code: WebFunctionCode.fromAsset(path.join(__dirname, 'fixture-app')),
  runtime: lambda.Runtime.NODEJS_24_X,
  egressNetworkConnector: connector,
});

const endpoint = new WebFunctionEndpoint(stack, 'Endpoint', {
  webFunction: fn,
  endpointType: WebFunctionEndpointType.HOME_REGION,
  authType: WebFunctionAuthType.IAM_AUTH,
});

// IAM callers of the endpoint also need a resource-based policy on the function, scoped to the endpoint
new lambda.CfnResourcePolicy(stack, 'InvokePolicy', {
  resourceArn: fn.functionArn,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Sid: 'InvokeEndpoint',
      Effect: 'Allow',
      Principal: { AWS: stack.account },
      Action: 'lambda:InvokeWebFunctionEndpoint',
      Resource: endpoint.endpointArn,
    }],
  },
});

new integ.IntegTest(app, 'WebFunctionEgressTest', { testCases: [stack] });
