import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as ec2 from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-vpc-reserved-azs');

new ec2.Vpc(stack, 'MyVpc', {
  reservedAzs: 2,
  maxAzs: 3,
});

new IntegTest(app, 'vpc-reserved-azs', {
  testCases: [stack],
});