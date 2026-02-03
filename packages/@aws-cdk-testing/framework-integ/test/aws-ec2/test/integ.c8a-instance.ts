import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'C8aInstanceStack');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  natGateways: 0,
});

// Create instance using C8A instance class
new ec2.Instance(stack, 'C8aInstance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C8A, ec2.InstanceSize.LARGE),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
});

new IntegTest(app, 'C8aInstanceTest', {
  testCases: [stack],
});
