#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'IntegUserdataVpc', {
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
      frequency: ec2.Ec2LaunchV2Frequency.ALWAYS,
      scriptType: ec2.Ec2LaunchV2ScriptType.POWERSHELL,
      runAs: ec2.Ec2LaunchV2RunAs.LOCAL_SYSTEM,
    });
    userData.addCommands(
      'Write-Host "Hello from EC2Launch v2!"',
      'New-Item -Path C:\\test.txt -ItemType File -Force',
    );

    new ec2.Instance(this, 'WindowsV2Instance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE),
      userData,
    });
  }
}

const testCase = new TestStack(app, 'integ-userdata-windows-v2');

new IntegTest(app, 'userdata-windows-v2-test', {
  testCases: [testCase],
});
