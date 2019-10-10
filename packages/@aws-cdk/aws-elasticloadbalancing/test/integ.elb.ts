#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import elb = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elb-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 1
});

new elb.LoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  listeners: [{
    externalPort: 80,
    allowConnectionsFrom: [ec2.Peer.anyIpv4()]
  }],
  healthCheck: {
    port: 80
  }
});

app.synth();
