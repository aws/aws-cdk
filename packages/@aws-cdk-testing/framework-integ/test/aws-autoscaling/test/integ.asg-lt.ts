#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-asg-integ');
stack.node.setContext(AUTOSCALING_GENERATE_LAUNCH_TEMPLATE, true);

const role = new iam.Role(stack, 'role', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
});

const lt = new ec2.LaunchTemplate(stack, 'MainLT', {
  instanceType: new ec2.InstanceType('t3.micro'),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    cpuType: ec2.AmazonLinuxCpuType.X86_64,
  }),
  role: role,
});

const ltOverrideT4g = new ec2.LaunchTemplate(stack, 'T4gLT', {
  instanceType: new ec2.InstanceType('t4g.micro'),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    cpuType: ec2.AmazonLinuxCpuType.ARM_64,
  }),
});

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new autoscaling.AutoScalingGroup(stack, 'AsgFromLT', {
  vpc,
  launchTemplate: lt,
  minCapacity: 0,
  maxCapacity: 10,
  desiredCapacity: 5,
  ssmSessionPermissions: true,
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
  ssmSessionPermissions: true,
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

new autoscaling.AutoScalingGroup(stack, 'AsgFromMipWithInstanceRequirements', {
  vpc,
  mixedInstancesPolicy: {
    launchTemplate: lt,
    launchTemplateOverrides: [
      {
        instanceRequirements: {
          vCpuCount: { min: 4, max: 8 },
          memoryMiB: { min: 16384 },
          cpuManufacturers: ['intel'],
        },
      },
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
    deviceName: '/dev/sda1',
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

new autoscaling.AutoScalingGroup(stack, 'AsgWithIMDSv2', {
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ec2.MachineImage.latestAmazonLinux2(),
  requireImdsv2: true,
  vpc,
});

app.synth();
