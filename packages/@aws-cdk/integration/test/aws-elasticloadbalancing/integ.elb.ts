#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elb-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 1,
});

new elb.LoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  listeners: [{
    externalPort: 80,
    allowConnectionsFrom: [ec2.Peer.anyIpv4()],
  }],
  healthCheck: {
    port: 80,
  },
});

app.synth();
