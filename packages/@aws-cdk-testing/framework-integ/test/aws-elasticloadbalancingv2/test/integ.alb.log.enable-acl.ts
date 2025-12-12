#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ-enable-acl', { env: { region: 'us-west-2' } });

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  // Enable ACLs for the bucket
  accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
  objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

lb.logAccessLogs(bucket, 'prefix');
lb.logConnectionLogs(bucket, 'prefix-connection-log');
lb.logHealthCheckLogs(bucket, 'prefix-health-check-log');

const listener = lb.addListener('Listener', {
  port: 80,
});

listener.addTargets('Target', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.128.6')],
  stickinessCookieDuration: cdk.Duration.minutes(5),
});

new IntegTest(app, 'cdk-integ-alb-log-enable-acl', {
  testCases: [stack],
});
