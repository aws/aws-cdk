import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as origins from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-load-balancer-origin', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });
const loadbalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.LoadBalancerV2Origin(loadbalancer) },
});

app.synth();
