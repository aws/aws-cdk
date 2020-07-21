import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

export = {
  'When creating an ECS CapacityProvider': {
    'with only required properties set, it correctly sets default properties'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });
      const asg = new AutoScalingGroup(stack, 'ASG', {
        vpc,
        instanceType: new InstanceType('t3.large'),
        machineImage: new ecs.EcsOptimizedAmi(),
      });
      new ecs.CapacityProvider(stack, 'CP', {
        autoscalingGroup: asg,
      });

      // THEN
      expectCDK(stack).to(haveResource('AWS::ECS::CapacityProvider', {
        AutoScalingGroupProvider: {
          AutoScalingGroupArn: {
            Ref: 'ASG46ED3070',
          },
          ManagedScaling: {
            MaximumScalingStepSize: 10000,
            MinimumScalingStepSize: 1,
            Status: 'ENABLED',
            TargetCapacity: 100,
          },
          ManagedTerminationProtection: 'DISABLED',
        },
      }));
      test.done();
    },
  },
  'with all available properties set, it correctly creates the resource'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });
    const asg = new AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new InstanceType('t3.large'),
      machineImage: new ecs.EcsOptimizedAmi(),
    });
    new ecs.CapacityProvider(stack, 'CP', {
      autoscalingGroup: asg,
      capacityProviderName: 'MyCapacityProvider',
      managedScaling: true,
      managedTerminationProtection: true,
      maximumScalingStepSize: 100,
      minimumScalingStepSize: 1,
      targetCapacity: 90,
    });

    // THEN
    expectCDK(stack).to(haveResource('AWS::ECS::CapacityProvider', {
      AutoScalingGroupProvider: {
        AutoScalingGroupArn: {
          Ref: 'ASG46ED3070',
        },
        ManagedScaling: {
          MaximumScalingStepSize: 100,
          MinimumScalingStepSize: 1,
          Status: 'ENABLED',
          TargetCapacity: 90,
        },
        ManagedTerminationProtection: 'ENABLED',
      },
      Name: 'MyCapacityProvider',
    }));
    test.done();
  },
  'with managedScaling disabled'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });
    const asg = new AutoScalingGroup(stack, 'ASG', {
      vpc,
      instanceType: new InstanceType('t3.large'),
      machineImage: new ecs.EcsOptimizedAmi(),
    });
    new ecs.CapacityProvider(stack, 'CP', {
      autoscalingGroup: asg,
      capacityProviderName: 'MyCapacityProvider',
      managedScaling: false,
      managedTerminationProtection: false,
    });

    // THEN
    expectCDK(stack).to(haveResource('AWS::ECS::CapacityProvider', {
      AutoScalingGroupProvider: {
        AutoScalingGroupArn: {
          Ref: 'ASG46ED3070',
        },
        ManagedScaling: {
          MaximumScalingStepSize: 10000,
          MinimumScalingStepSize: 1,
          Status: 'DISABLED',
          TargetCapacity: 100,
        },
        ManagedTerminationProtection: 'DISABLED',
      },
      Name: 'MyCapacityProvider',
    }));
    test.done();
  },
  'import correctly'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    const cp = ecs.CapacityProvider.fromCapacityProviderName(stack, 'CP', 'foo');
    // THEN
    test.equal(cp.capacityProviderName, 'foo');
    test.done();
  },
};
