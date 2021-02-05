import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

const defaultCapacityProviderStrategy = [
  {
    capacityProvider: ecs.FargateCapacityProviderType.FARGATE,
    weight: 1,
    base: 1,
  },
  {
    capacityProvider: ecs.FargateCapacityProviderType.FARGATE_SPOT,
    weight: 2,
  },
];

export = {
  'When creating a cluster with fargate capacity providers': {
    'with defaultCapacityProviderStrategy only'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy,
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

      test.done();
    },
    'with capacityProvider only'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        capacityProvider: [
          ecs.FargateCapacityProviderType.FARGATE,
          ecs.FargateCapacityProviderType.FARGATE_SPOT,
        ],
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Cluster', {
        CapacityProviders: [
          'FARGATE',
          'FARGATE_SPOT',
        ],
      }));

      test.done();
    },
    'with capacityProvider and defaultCapacityProviderStrategy'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        capacityProvider: [
          ecs.FargateCapacityProviderType.FARGATE,
          ecs.FargateCapacityProviderType.FARGATE_SPOT,
        ],
        defaultCapacityProviderStrategy,
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

      test.done();
    },
    'allowed to create service with capacityProviderStrategy'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy,
      });

      // WHEN
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Task', {
        cpu: 256,
        memoryLimitMiB: 512,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
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
      }));

      test.done();
    },
    'allowed to create service without capacityProviderStrategy'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy,
      });

      // WHEN
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'Task', {
        cpu: 256,
        memoryLimitMiB: 512,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        LaunchType: 'FARGATE',
      }));

      test.done();
    },
  },
};
