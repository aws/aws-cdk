import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

describe('warm pool', () => {
  test('we can add a warm pool without properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = newASG(stack);

    // WHEN
    asg.addWarmPool();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::WarmPool', {
      AutoScalingGroupName: {
        Ref: 'ASG46ED3070',
      },
    });
  });

  test('we can add a warm pool with all optional properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = newASG(stack);

    // WHEN
    asg.addWarmPool({
      reuseOnScaleIn: true,
      maxGroupPreparedCapacity: 5,
      minSize: 2,
      poolState: autoscaling.PoolState.HIBERNATED,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::WarmPool', {
      AutoScalingGroupName: {
        Ref: 'ASG46ED3070',
      },
      InstanceReusePolicy: {
        ReuseOnScaleIn: true,
      },
      MaxGroupPreparedCapacity: 5,
      MinSize: 2,
      PoolState: 'Hibernated',
    });
  });
});

test('adding a warm pool with maxGroupPreparedCapacity smaller than -1 throws an error', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const asg = newASG(stack);

  // WHEN
  expect(() => {
    asg.addWarmPool({
      maxGroupPreparedCapacity: -42,
    });
  }).toThrow(/'maxGroupPreparedCapacity' parameter should be greater than or equal to -1/);
});

test('adding a warm pool with negative minSize throws an error', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const asg = newASG(stack);

  // WHEN
  expect(() => {
    asg.addWarmPool({
      minSize: -1,
    });
  }).toThrow(/'minSize' parameter should be greater than or equal to 0/);
});

function newASG(stack: cdk.Stack) {
  const vpc = new ec2.Vpc(stack, 'VPC');

  return new autoscaling.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
  });
}
