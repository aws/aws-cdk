#!/usr/bin/env node
import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cdk = require('@aws-cdk/cdk');
import autoscaling = require('../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-cdk-ec2-integ');

const vpc = new ec2.VpcNetwork(stack, 'VPC', {
  maxAZs: 3
});

const asg = new autoscaling.AutoScalingGroup(stack, 'Fleet', {
  vpc,
  instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro),
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

process.stdout.write(app.run());
