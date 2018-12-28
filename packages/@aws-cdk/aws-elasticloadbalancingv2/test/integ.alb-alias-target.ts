#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/cdk');
import elbv2 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', {
  maxAZs: 2
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true
});

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

new route53.AliasRecord(zone, 'Alias', {
  zone,
  recordName: '_foo',
  target: lb
});

app.run();
