#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-alb-log-imported-bucket-integ', { env: { region: 'us-west-2' } });
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const bucket = new s3.Bucket(stack, 'Bucket');
const importedBucket = s3.Bucket.fromBucketName(stack, 'ImportedBucket', bucket.bucketName);
// Imported buckets have `autoCreatePolicy` disabled by default
importedBucket.policy = new s3.BucketPolicy(stack, 'ImportedBucketPolicy', {
  bucket: importedBucket,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

lb.logAccessLogs(importedBucket, 'prefix');

const listener = lb.addListener('Listener', {
  port: 80,
});

const group1 = listener.addTargets('Target', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.6')],
  stickinessCookieDuration: cdk.Duration.minutes(5),
});

vpc.publicSubnets.forEach((subnet) => {
  group1.node.addDependency(subnet);
});

new IntegTest(app, 'cdk-integ-alb-log-imported-bucket', {
  testCases: [stack],
  diffAssets: true,
});
