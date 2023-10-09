#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const tmpDir = fs.mkdtempSync('/tmp/cfn-init-test');
fs.writeFileSync(path.resolve(tmpDir, 'testFile'), 'Hello World!\n');

const app = new cdk.App();
class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc');

    new ec2.Instance(this, 'FirstInstance', {
      vpc,
      instanceType:
      ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      init: ec2.CloudFormationInit.fromConfigSets({
        configSets: {
          default: ['default'],
        },
        configs: {
          default: new ec2.InitConfig([
            ec2.InitFile.fromAsset(
              '/target/path/config.json',
              tmpDir,
            ),
          ]),
        },
      }),
    });

    new ec2.Instance(this, 'SecondInstance', {
      vpc,
      instanceType:
      ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      init: ec2.CloudFormationInit.fromConfigSets({
        configSets: {
          default: ['default'],
        },
        configs: {
          default: new ec2.InitConfig([
            ec2.InitFile.fromAsset(
              '/target/path/config.json',
              tmpDir,
            ),
          ]),
        },
      }),
    });
  }
}

const testCase = new TestStack(app, 'integ-ec2-multiple-instances-in-stack');

new IntegTest(app, 'instance-test', {
  testCases: [testCase],
});