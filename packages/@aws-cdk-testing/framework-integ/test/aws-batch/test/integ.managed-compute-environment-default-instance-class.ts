import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ManagedEc2EcsComputeEnvironment, EcsMachineImageType, DefaultInstanceClass } from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'managed-compute-environment-default-instance-class');
const vpc = new ec2.Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

new ManagedEc2EcsComputeEnvironment(stack, 'ECS', {
  vpc,
  images: [{
    imageType: EcsMachineImageType.ECS_AL2023,
  }],
  defaultInstanceClasses: [DefaultInstanceClass.ARM64],
});

new integ.IntegTest(app, 'integ-managed-compute-environment-default-instance-class', {
  testCases: [stack],
});
