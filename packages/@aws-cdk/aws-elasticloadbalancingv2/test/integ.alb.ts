#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import elbv2 = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', {
  maxAZs: 2
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true
});

const listener = lb.addListener('Listener', {
  port: 80,
});

listener.addTargets('Target', {
  port: 80,
  targets: [new elbv2.IpTarget('10.0.1.1')]
});

listener.addTargets('ConditionalTarget', {
  priority: 10,
  hostHeader: 'example.com',
  port: 80,
  targets: [new elbv2.IpTarget('10.0.1.2')]
});

listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

process.stdout.write(app.run());
