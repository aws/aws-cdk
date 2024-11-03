import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceProfile, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const role = new Role(this, 'MyRole', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
    });
    const instanceProfile = new InstanceProfile(this, 'MyInstanceProfile', {
      role,
    });

    new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C3, ec2.InstanceSize.LARGE),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
      instanceProfile,
    });
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance-iam-profile');

new IntegTest(app, 'instance-iam-profile-test', {
  testCases: [testCase],
});

app.synth();