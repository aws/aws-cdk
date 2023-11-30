import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app);

new ec2.VpcDualStack(stack, 'TestVpcDualStack');

new IntegTest(app, 'DualStackTesting', {
  testCases: [stack],
});

