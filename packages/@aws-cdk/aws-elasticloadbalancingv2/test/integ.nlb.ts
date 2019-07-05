#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import elbv2 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2
});

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true
});

const listener = lb.addListener('Listener', {
  port: 443,
});

const group = listener.addTargets('Target', {
  port: 443,
  targets: [new elbv2.IpTarget('10.0.1.1')]
});

group.node.addDependency(vpc.internetConnectivityEstablished);

// The target's security group must allow being routed by the LB and the clients.

app.synth();
