#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');
stack.node.setContext(AUTOSCALING_GENERATE_LAUNCH_TEMPLATE, true);

const vpc = new ec2.Vpc(stack, 'AsgKeyPairVPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new autoscaling.AutoScalingGroup(stack, 'AsgWithKeyPair', {
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ec2.MachineImage.latestAmazonLinux2(),
  keyPair: new ec2.KeyPair(stack, 'MyKeyPair'),
  vpc,
});

new IntegTest(app, 'AsgIntegKeyPair', {
  testCases: [stack],
});

app.synth();
