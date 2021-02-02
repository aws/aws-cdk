import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

export = {
  'When creating a cluster with fargate capacity providers': {
    'with defaultCapacityProviderStrategy only'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
        defaultCapacityProviderStrategy: [
          {
            capacityProvider: ecs.FargateCapacityProviderType.FARGATE,
            weight: 1,
            base: 1,
          },
          {
            capacityProvider: ecs.FargateCapacityProviderType.FARGATE_SPOT,
            weight: 2,
          },
        ],
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
        defaultCapacityProviderStrategy: [
          {
            capacityProvider: ecs.FargateCapacityProviderType.FARGATE,
            weight: 1,
            base: 1,
          },
          {
            capacityProvider: ecs.FargateCapacityProviderType.FARGATE_SPOT,
            weight: 2,
          },
        ],
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
  },
};
