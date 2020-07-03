#!/usr/bin/env node
import * as ec2 from '../lib';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-init', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

new ec2.Instance(stack, 'Instance2', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
  userDataCausesReplacement: true,
  init: ec2.CloudFormationInit.fromElements(
    ec2.InitCommand.shellCommand('echo hello2'),
  ),
});

app.synth();