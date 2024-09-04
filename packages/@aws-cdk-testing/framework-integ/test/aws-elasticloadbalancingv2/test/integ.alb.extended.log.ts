#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';

class ExtendedLB extends elbv2.ApplicationLoadBalancer {
  constructor(scope: Construct, id: string, props: elbv2.BaseLoadBalancerProps) {
    super(scope, id, props);

    const accessLogsBucket = new s3.Bucket(this, 'ALBAccessLogsBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      serverAccessLogsPrefix: 'selflog/',
      enforceSSL: true,
    });
    this.logAccessLogs(accessLogsBucket);

    const connectionLogsBucket = new s3.Bucket(this, 'ALBConnectionLogsBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      serverAccessLogsPrefix: 'selflog/',
      enforceSSL: true,
    });
    this.logConnectionLogs(connectionLogsBucket);
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ', { env: { region: 'us-west-2' } });
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const lb = new ExtendedLB(stack, 'LB', {
  vpc,
  internetFacing: true,
});

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

new IntegTest(app, 'cdk-integ-alb-extended-log', {
  testCases: [stack],
});
