#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ec2:ec2SumTImeoutEnabled': false,
  },
});
const stack = new cdk.Stack(app, 'integ-init');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

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
        ec2.InitFile.fromObject('/tmp/file2.json', {
          stackId: stack.stackId,
          stackName: stack.stackName,
          region: stack.region,
          intProperty: 18,
          boolProperty: true,
          numProperty: 58.23,
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
      service: new ec2.InitConfig([
        ec2.InitFile.fromString('/myvars.env', 'OTHER_VAR="im from the file :3"'),
        ec2.InitService.systemdConfigFile('myapp', {
          command: '/bin/bash -c "echo HELLO_WORLD=${MY_VAR} | FROM_FILE=${OTHER_VAR}"',
          environmentVariables: {
            MY_VAR: 'its me :)',
          },
          environmentFiles: ['/myvars.env'],
        }),
      ]),
    },
  }),
  resourceSignalTimeout: cdk.Duration.minutes(10),
});

new integ.IntegTest(app, 'instance-init-test', {
  testCases: [stack],
});

app.synth();
