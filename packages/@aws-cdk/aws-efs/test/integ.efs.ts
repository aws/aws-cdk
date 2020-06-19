import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { AccessPoint, FileSystem } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-efs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1});

const filesystem = new FileSystem(stack, 'FileSystem', {
  vpc,
});

new AccessPoint(stack, 'AccessPoint', {
  filesystem,
});
