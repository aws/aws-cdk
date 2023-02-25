#!/usr/bin/env node
import * as ec2 from '../../aws-ec2';
import * as elb from '../../aws-elasticloadbalancing';
import * as cdk from '../../core';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 3,
});

const asg = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
});

const lb = new elb.LoadBalancer(stack, 'LB', {
  vpc,
  internetFacing: true,
  healthCheck: {
    port: 80,
  },
});

lb.addTarget(asg);
lb.addListener({ externalPort: 80 });

app.synth();
