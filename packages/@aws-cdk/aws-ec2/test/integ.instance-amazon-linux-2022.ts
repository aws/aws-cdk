import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';

const app = new cdk.App();

const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};

interface TestStackProps extends cdk.StackProps {
  kernel?: ec2.AmazonLinuxKernel
}

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: TestStackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const { kernel } = props;

    new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2022, kernel }),
    });
  }
}

new integ.IntegTest(app, 'AmazonLinux2022Test', {
  testCases: [
    new TestStack(app, 'DefaultValueForKernel', { env }),
    new TestStack(app, 'ExplicitKernel-KernelDefault', {
      env,
      kernel: ec2.AmazonLinuxKernel.KERNEL_DEFAULT,
    }),
  ],
});

app.synth();
