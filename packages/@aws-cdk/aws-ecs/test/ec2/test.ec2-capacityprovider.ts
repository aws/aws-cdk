import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

const defaultCapacityProviderStrategy = [
  {
    capacityProvider: 'FARGATE',
    weight: 1,
    base: 1,
  },
  {
    capacityProvider: 'FARGATE_SPOT',
    weight: 2,
  },
];

export = {
  'When creating a cluster with fargate capacity providers': {
    'allow to create ec2 capacity'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy,
      });

      // WHEN
      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Cluster', {
        CapacityProviders: [
          'FARGATE',
          'FARGATE_SPOT',
        ],
        DefaultCapacityProviderStrategy: [
          {
            Base: 1,
            CapacityProvider: 'FARGATE',
            Weight: 1,
          },
          {
            CapacityProvider: 'FARGATE_SPOT',
            Weight: 2,
          },
        ],
      }));

      expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', {
        MaxSize: '1',
        MinSize: '1',
        LaunchConfigurationName: {
          Ref: 'EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1',
        },
      }));

      test.done();
    },
    'allow to create Ec2Service'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy,
      });

      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
      });

      // WHEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 256,
      });

      // we are allowed to create Ec2Service even the cluster defaultCapacityProviderStrategy is fargate
      // as we leave the capacityProviderStrategy undefined, the launch type will be explicitly defined as EC2.
      new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
        LaunchType: 'EC2',
      }));

      test.done();
    },
    'allow to create Ec2Service when capacityProviderStrategy is about fargate'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy,
      });

      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro'),
      });

      // WHEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Task', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 256,
      });

      // we are allowed to create Ec2Service even the capacityProviderStrategy is all about fargate
      new ecs.Ec2Service(stack, 'Ec2Service', {
        cluster,
        taskDefinition,
        capacityProviderStrategy: defaultCapacityProviderStrategy,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        CapacityProviderStrategy: [
          {
            Base: 1,
            CapacityProvider: 'FARGATE',
            Weight: 1,
          },
          {
            CapacityProvider: 'FARGATE_SPOT',
            Weight: 2,
          },
        ],
        Cluster: {
          Ref: 'EcsCluster97242B84',
        },
      }));

      test.done();
    },
  },
};
