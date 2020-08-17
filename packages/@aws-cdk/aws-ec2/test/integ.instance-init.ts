#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-init', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

const vpc = ec2.Vpc.fromLookup(stack, 'VPC', { isDefault: true });

const tmpDir = fs.mkdtempSync('/tmp/cfn-init-test');
fs.writeFileSync(path.resolve(tmpDir, 'testFile'), 'Hello World!\n');

new ec2.Instance(stack, 'Instance2', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
  userDataCausesReplacement: true,
  initOptions: {
    timeout: cdk.Duration.minutes(30),
  },
  init: ec2.CloudFormationInit.fromElements(
    ec2.InitCommand.argvCommand(['/bin/true']),
  ),
});

app.synth();