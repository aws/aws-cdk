#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-init');

const vpc = new ec2.Vpc(stack, 'IntegInitVpc');

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
  init: ec2.CloudFormationInit.fromConfigSets({
    configSets: {
      default: ['yumPreinstall', 'config'],
    },
    configs: {
      yumPreinstall: new ec2.InitConfig([
        ec2.InitPackage.yum('git'),
      ]),
      config: new ec2.InitConfig([
        ec2.InitFile.fromObject('/tmp/file2', {
          stackId: stack.stackId,
          stackName: stack.stackName,
          region: stack.region,
        }),
        ec2.InitGroup.fromName('group1'),
        ec2.InitGroup.fromName('group2', 42),
        ec2.InitUser.fromName('sysuser1', {
          groups: ['group1', 'group2'],
          homeDir: '/home/sysuser1-custom',
        }),
        ec2.InitUser.fromName('sysuser2'),
        ec2.InitSource.fromAsset('/tmp/sourceDir', tmpDir),
      ]),
    },
  }),
});

app.synth();
