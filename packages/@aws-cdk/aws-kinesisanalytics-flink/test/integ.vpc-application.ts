import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as core from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as flink from '../lib';

const app = new core.App();
const stack = new core.Stack(app, 'FlinkAppTest');
const vpc = new ec2.Vpc(stack, 'VPC');

new flink.Application(stack, 'App', {
  code: flink.ApplicationCode.fromAsset(path.join(__dirname, 'code-asset')),
  runtime: flink.Runtime.FLINK_1_15,
  vpc,
});

new integ.IntegTest(app, 'VpcTest', {
  testCases: [stack],
});
