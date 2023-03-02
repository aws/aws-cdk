#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as elb from '../lib';
import { InstanceTarget } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elb-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 1,
});

const instance = new ec2.Instance(stack, 'targetInstance', {
  vpc: vpc,
  instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
    ec2.InstanceClass.T2,
    ec2.InstanceSize.MICRO,
  ),
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
});

const elbalancer = new elb.LoadBalancer(stack, 'LB', {
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

elbalancer.addTarget(new InstanceTarget(instance, 80));

app.synth();
