#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-env-agnostic-logging');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
  ],
});

const bucket = new s3.Bucket(stack, 'LoggingBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
  internetFacing: true,
});
alb.logAccessLogs(bucket, 'alb-access');
alb.logConnectionLogs(bucket, 'alb-connection');

const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
  vpc,
  internetFacing: true,
});
nlb.logAccessLogs(bucket, 'nlb-access');

new IntegTest(app, 'cdk-integ-elbv2-env-agnostic-logging', {
  testCases: [stack],
});
