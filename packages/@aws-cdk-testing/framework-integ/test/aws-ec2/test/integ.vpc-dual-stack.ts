import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'OneIPv6Block');

//new ec2.VpcDualStack(stack, 'TestVpcDualStack');

new ec2.VpcDualStackOneIPv6Block(stack, 'TestVpcDualStackOneIPv6Block');

new IntegTest(app, 'DualStackTesting', {
  testCases: [stack],
});

