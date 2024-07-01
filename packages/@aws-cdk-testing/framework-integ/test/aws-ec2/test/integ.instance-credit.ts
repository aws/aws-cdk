import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'IntegSg', {
      vpc,
      allowAllIpv6Outbound: true,
    });

    new ec2.Instance(this, 'Instance', {
      vpc,
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      creditSpecification: ec2.CpuCredits.STANDARD,
    });
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance-credit');

new IntegTest(app, 'instance-test', {
  testCases: [testCase],
});
