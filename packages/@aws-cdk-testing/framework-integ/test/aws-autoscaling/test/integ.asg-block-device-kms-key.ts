#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-block-device-kms-key');
// kmsKey on a block device requires the launch template path
stack.node.setContext(AUTOSCALING_GENERATE_LAUNCH_TEMPLATE, true);

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const key = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new autoscaling.AutoScalingGroup(stack, 'ASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  blockDevices: [{
    deviceName: '/dev/xvda',
    volume: autoscaling.BlockDeviceVolume.ebs(15, {
      volumeType: autoscaling.EbsDeviceVolumeType.GP3,
      encrypted: true,
      kmsKey: key,
    }),
  }],
});

new integ.IntegTest(app, 'AsgBlockDeviceKmsKeyTest', {
  testCases: [stack],
});
