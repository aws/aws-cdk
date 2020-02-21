import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as cloud9 from '../lib';

let stack = new cdk.Stack();
let vpc = new ec2.Vpc(stack, 'VPC');

beforeEach(() => {
  stack = new cdk.Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
});

test('create resource correctly with only vpc provide', () => {
  // WHEN
  new cloud9.EnvironmentEC2(stack, 'C9Env', { vpc });
  // THEN
  expectCDK(stack).to(haveResource('AWS::Cloud9::EnvironmentEC2'));
});

test('create resource correctly with both vpc and subnetSelectio', () => {
  // WHEN
  new cloud9.EnvironmentEC2(stack, 'C9Env', {
    vpc,
    subnetSelection: {
      subnetType: ec2.SubnetType.PRIVATE
    }
   });
  // THEN
  expectCDK(stack).to(haveResource('AWS::Cloud9::EnvironmentEC2'));
});

test('import correctly from existing environment', () => {
  // WHEN
  const c9env = cloud9.EnvironmentEC2.fromEnvironmentEC2Name(stack, 'ImportedEnv', 'existingEnvName');
  // THEN
  expect(c9env).toHaveProperty('environmentEc2Name');
});

test('create correctly with instanceType specified', () => {
  // WHEN
  new cloud9.EnvironmentEC2(stack, 'C9Env', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE)
   });
  // THEN
  expectCDK(stack).to(haveResource('AWS::Cloud9::EnvironmentEC2'));
});
