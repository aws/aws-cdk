#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cxapi from 'aws-cdk-lib/cx-api';

const myFeatureFlag = { [cxapi.S3_BUCKET_DEFAULT_BLOCK_PUBLIC_ACCESS_PROPERTIES_TO_TRUE]: true };

const app = new cdk.App({
  context: myFeatureFlag,
});

const stack = new cdk.Stack(app, 'aws-cdk-s3');

// Bucket with default setting for `blockPublicAccess`
new s3.Bucket(stack, 'BucketWithDefaultAccess', {});

// Bucket with explicit setting for `blockPublicAccess`
new s3.Bucket(stack, 'BucketWithExplicitBlockAccess', {
  blockPublicAccess: new s3.BlockPublicAccess({
    blockPublicAcls: true,
    ignorePublicAcls: true,
    blockPublicPolicy: true,
    restrictPublicBuckets: true,
  }),
});

// Bucket with partial setting for `blockPublicAccess`
new s3.Bucket(stack, 'BucketWithPartialBlockAccess', {
  blockPublicAccess: new s3.BlockPublicAccess({
    blockPublicPolicy: false,
    restrictPublicBuckets: false,
  }),
});

new IntegTest(app, 'cdk-integ-s3-bucket-block-public-access', {
  testCases: [stack],
});
