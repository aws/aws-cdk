#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/core');
import targets = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true
});

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

new route53.ARecord(zone, 'Alias', {
  zone,
  recordName: '_foo',
  target: route53.AddressRecordTarget.fromAlias(new targets.LoadBalancerTarget(lb))
});

app.synth();
