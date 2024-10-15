import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'VPC');
    const sshKeys = ['foo', 'bar'];

    const bastionHostUserDataReplacementEnabled = new ec2.BastionHostLinux(this, 'BastionHostUserDataReplacementEnabled', {
      vpc,
      userDataCausesReplacement: true,
    });
    bastionHostUserDataReplacementEnabled.instance.addUserData(
      ...sshKeys.map(key => `echo ${key} >> ~ec2-user/.ssh/authorized_keys`),
    );

    const bastionHostUserDataReplacementDisabled = new ec2.BastionHostLinux(this, 'BastionHostUserDataReplacementDisabled', {
      vpc,
      userDataCausesReplacement: false,
    });
    bastionHostUserDataReplacementDisabled.instance.addUserData(
      ...sshKeys.map(key => `echo ${key} >> ~ec2-user/.ssh/authorized_keys`),
    );
  }
}

const testCase = new TestStack(app, 'integ-bastionhost-userdatacausesreplacement');

new IntegTest(app, 'bastionhost-userdatacausesreplacement-test', {
  testCases: [testCase],
});
