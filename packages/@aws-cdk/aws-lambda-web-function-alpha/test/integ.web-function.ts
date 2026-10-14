import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  NetworkConnector,
  WebFunction,
  WebFunctionAuthType,
  WebFunctionCode,
  WebFunctionEndpoint,
  WebFunctionEndpointType,
} from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-lambda-web-function-integ');

// Egress through a connector: isolated subnets only, so the VPC needs no NAT gateway
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
  timeout: cdk.Duration.seconds(30),
  environment: { NODE_ENV: 'test' },
  egressNetworkConnector: connector,
});

// Code copied into a bucket that the caller provides
const providedBucket = new s3.Bucket(stack, 'ProvidedCodeBucket', {
  versioned: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
new WebFunction(stack, 'ProvidedBucketFunction', {
  code: WebFunctionCode.fromAssetToProvidedBucket(providedBucket, path.join(__dirname, 'fixture-app')),
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
