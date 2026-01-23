#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-userdata-windows-v2');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const vpc = new ec2.Vpc(stack, 'IntegUserdataVpc', {
  maxAzs: 1,
  natGateways: 0,
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
  ],
});

// Create EC2Launch v2 user data with various options
const userData = ec2.UserData.forWindowsV2({
  frequency: 'always',
  scriptType: 'powershell',
  runAs: 'localSystem',
});
userData.addCommands(
  'Write-Host "Hello from EC2Launch v2!"',
  'New-Item -Path C:\\test.txt -ItemType File -Force',
);

new ec2.Instance(stack, 'WindowsV2Instance', {
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
  machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE),
  userData,
});

app.synth();
