import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new Stack(app, 'EC2C8AInstanceStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });

// Use InstanceClass.C8A once available; using string for now
new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C8A, ec2.InstanceSize.LARGE),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
});

new IntegTest(app, 'EC2C8AInstanceInteg', {
  testCases: [stack],
});
