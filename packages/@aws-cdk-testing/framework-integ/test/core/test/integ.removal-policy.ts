import * as cdk from 'aws-cdk-lib/core';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'core-removal-policy-stack');

// The removal policy is applied to both DeletionPolicy and UpdateReplacePolicy (default behavior)
const both = new Bucket(stack, 'BothAttributesBucket');
both.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

// The removal policy is only applied to DeletionPolicy; UpdateReplacePolicy stays unset
const deletionOnly = new Bucket(stack, 'DeletionPolicyOnlyBucket');
deletionOnly.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN, { applyToUpdateReplacePolicy: false });

// A fallback policy is applied through the `default` option
const withDefault = new Bucket(stack, 'WithDefaultBucket');
withDefault.applyRemovalPolicy(undefined, { default: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE });

new IntegTest(app, 'RemovalPolicyTest', {
  testCases: [stack],
});

app.synth();
