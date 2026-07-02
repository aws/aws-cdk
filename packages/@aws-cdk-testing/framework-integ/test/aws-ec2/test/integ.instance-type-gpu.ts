import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-ec2-instance-type-gpu');

new ec2.LaunchTemplate(stack, 'LTG7e', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.G7E, ec2.InstanceSize.XLARGE),
});

new ec2.LaunchTemplate(stack, 'LTP6b200', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.P6_B200, ec2.InstanceSize.XLARGE48),
});

new ec2.LaunchTemplate(stack, 'LTP6b300', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.P6_B300, ec2.InstanceSize.XLARGE48),
});

new integ.IntegTest(app, 'GpuInstanceTypeTest', {
  testCases: [stack],
});

app.synth();
