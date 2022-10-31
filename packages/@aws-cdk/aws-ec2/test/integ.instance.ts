import { PolicyStatement } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');
    const securityGroup = new ec2.SecurityGroup(this, 'IntegSg', {
      vpc,
      allowAllIpv6Outbound: true,
    });

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      detailedMonitoring: true,
    });

    instance.addToRolePolicy(new PolicyStatement({
      actions: ['ssm:*'],
      resources: ['*'],
    }));

    instance.connections.allowFromAnyIpv4(ec2.Port.icmpPing());

    instance.addUserData('yum install -y');
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance');

new IntegTest(app, 'instance-test', {
  testCases: [testCase],
});
