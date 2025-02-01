/*
 * Stack verification steps:
 * * aws ssm start-session --target <bastion host instance id>
 * * cat /etc/os-release  # Should be running Amazon Linux 2
 */

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(BASTION_HOST_USE_AMAZON_LINUX_2023_BY_DEFAULT, false); // disable feature flag

    const vpc = new ec2.Vpc(this, 'VPC');

    new ec2.BastionHostLinux(this, 'BastionHost', {
      vpc,
    });
  }
}

const testCase = new TestStack(app, 'integ-bastionhost-disable-al2023-feature-flag');

new IntegTest(app, 'bastionhost-disable-al2023-feature-flag-test', {
  testCases: [testCase],
});
