#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-userdata');

const vpc = new ec2.Vpc(stack, 'IntegUserdataVpc');

new ec2.Instance(stack, 'WindowsInstance', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE),
  userData: ec2.UserData.forWindows({ persist: true }),
});

app.synth();
