import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Test C8A instance class (AMD EPYC 5th gen)
    new ec2.Instance(this, 'InstanceC8A', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C8A, ec2.InstanceSize.LARGE),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    });

    // Test COMPUTE8_AMD instance class (alias for C8A)
    new ec2.Instance(this, 'InstanceCompute8Amd', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.COMPUTE8_AMD, ec2.InstanceSize.XLARGE),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    });
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance-c8a');

new IntegTest(app, 'instance-c8a-test', {
  testCases: [testCase],
});
