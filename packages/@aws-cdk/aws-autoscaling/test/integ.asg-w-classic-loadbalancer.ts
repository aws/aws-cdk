#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cdk = require('@aws-cdk/core');
import autoscaling = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 3
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
    port: 80
  },
});

lb.addTarget(asg);
lb.addListener({ externalPort: 80 });

app.synth();
