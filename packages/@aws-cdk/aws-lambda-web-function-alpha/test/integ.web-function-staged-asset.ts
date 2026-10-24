import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { WebFunction, WebFunctionAuthType, WebFunctionCode, WebFunctionEndpoint } from '../lib';

// A local directory copied into a bucket the caller provides, validated for versioning and encryption
const app = new cdk.App();
const stack = new cdk.Stack(app, 'WebFunctionStagedAsset');

const bucket = new s3.Bucket(stack, 'CodeBucket', {
  versioned: true,
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const fn = new WebFunction(stack, 'WebFunction', {
  code: WebFunctionCode.fromAssetToProvidedBucket(bucket, path.join(__dirname, 'fixture-app')),
});
new WebFunctionEndpoint(stack, 'Endpoint', {
  webFunction: fn,
  authType: WebFunctionAuthType.APPLICATION_MANAGED,
});

new integ.IntegTest(app, 'WebFunctionStagedAssetTest', { testCases: [stack] });
