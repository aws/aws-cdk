#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import elb = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-elb-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', {
  maxAZs: 1
});

new elb.LoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  listeners: [{
    externalPort: 80,
    allowConnectionsFrom: [new ec2.AnyIPv4()]
  }],
  healthCheck: {
    port: 80
  },
  targets: []
});

process.stdout.write(app.run());
