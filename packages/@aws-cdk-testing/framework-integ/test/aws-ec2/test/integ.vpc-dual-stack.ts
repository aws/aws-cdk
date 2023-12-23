import { App, Stack } from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const salt = 'Deploy5';

const app = new App();
const stack = new Stack(app, `OneIPv6Block${salt}`);

new ec2.Vpc(stack, 'DualStackProtocolVpc', {
  vpcProtocol: ec2.VpcProtocol.DUAL_STACK,
});

new IntegTest(app, 'DualStackTesting', {
  testCases: [stack],
});

