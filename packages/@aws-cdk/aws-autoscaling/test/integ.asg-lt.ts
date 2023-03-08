#!/usr/bin/env node
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');

const lt = new ec2.LaunchTemplate(stack, 'MainLT', {
  instanceType: new ec2.InstanceType('t3.micro'),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    cpuType: ec2.AmazonLinuxCpuType.X86_64,
  }),
});

const ltOverrideT4g = new ec2.LaunchTemplate(stack, 'T4gLT', {
  instanceType: new ec2.InstanceType('t4g.micro'),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    cpuType: ec2.AmazonLinuxCpuType.ARM_64,
  }),
});

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

new autoscaling.AutoScalingGroup(stack, 'AsgFromLT', {
  vpc,
  launchTemplate: lt,
  minCapacity: 0,
  maxCapacity: 10,
  desiredCapacity: 5,
});

new autoscaling.AutoScalingGroup(stack, 'AsgWithDefaultInstanceWarmup', {
  vpc,
  launchTemplate: lt,
  defaultInstanceWarmup: cdk.Duration.seconds(5),
});

new autoscaling.AutoScalingGroup(stack, 'AsgFromMip', {
  vpc,
  mixedInstancesPolicy: {
    instancesDistribution: {
      onDemandPercentageAboveBaseCapacity: 50,
    },
    launchTemplate: lt,
    launchTemplateOverrides: [
      { instanceType: new ec2.InstanceType('t3.micro') },
      { instanceType: new ec2.InstanceType('t3a.micro') },
      { instanceType: new ec2.InstanceType('t4g.micro'), launchTemplate: ltOverrideT4g },
    ],
  },
  minCapacity: 0,
  maxCapacity: 10,
  desiredCapacity: 5,
});

new autoscaling.AutoScalingGroup(stack, 'AsgFromMipWithoutDistribution', {
  vpc,
  mixedInstancesPolicy: {
    launchTemplate: lt,
    launchTemplateOverrides: [
      { instanceType: new ec2.InstanceType('t3.micro') },
      { instanceType: new ec2.InstanceType('t3a.micro') },
      { instanceType: new ec2.InstanceType('t4g.micro'), launchTemplate: ltOverrideT4g },
    ],
  },
  minCapacity: 0,
  maxCapacity: 10,
  desiredCapacity: 5,
});

new autoscaling.AutoScalingGroup(stack, 'AsgWithGp3Blockdevice', {
  minCapacity: 0,
  maxCapacity: 10,
  desiredCapacity: 5,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
  blockDevices: [{
    deviceName: 'ebs',
    mappingEnabled: true,
    volume: autoscaling.BlockDeviceVolume.ebs(15, {
      deleteOnTermination: true,
      encrypted: true,
      volumeType: autoscaling.EbsDeviceVolumeType.GP3,
      throughput: 125,
    }),
  }],
  vpc,
});

app.synth();
