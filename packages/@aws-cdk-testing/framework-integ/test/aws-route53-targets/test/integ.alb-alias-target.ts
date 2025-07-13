#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
});

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

new route53.ARecord(zone, 'Alias', {
  zone,
  recordName: '_foo',
  target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
});

new route53.ARecord(stack, 'AliasWithHealthCheck', {
  zone,
  recordName: '_foo-health',
  target: route53.RecordTarget.fromAlias(
    new targets.LoadBalancerTarget(lb, {
      evaluateTargetHealth: true,
    }),
  ),
});

app.synth();
