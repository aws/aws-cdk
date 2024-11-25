#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-s3-legacy-name-integ');

const legacyBucketFromName = s3.Bucket.fromBucketName(stack, 'LegacyBucketFromName', 'My_legacy_bucket1');

const legacyBucketFromArn = s3.Bucket.fromBucketArn(stack, 'LegacyBucketFromArn', 'arn:aws:s3:::My_legacy_bucket2');

const legacyBucketFromAttributes = s3.Bucket.fromBucketAttributes(stack, 'LegacyBucketFromAttributes', {
  bucketName: 'My_legacy_bucket3',
});

const role = new iam.Role(stack, 'LegacyBucketRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
role.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['s3:*'],
    resources: [
      `${legacyBucketFromName.bucketArn}/*`,
      `${legacyBucketFromArn.bucketArn}/*`,
      `${legacyBucketFromAttributes.bucketArn}/*`,
    ],
  }),
);

new IntegTest(app, 'aws-cdk-s3-integ-test', {
  testCases: [stack],
});

// In the synthesized template, verify:
// 1. The bucket names imported using different methods (Bucket.fromBucketName, Bucket.fromBucketArn, Bucket.fromBucketAttributes) are not modified and contain underscores.
// 2. The policy attached to the role includes the correct bucket ARNs with underscores for all three imported buckets.
