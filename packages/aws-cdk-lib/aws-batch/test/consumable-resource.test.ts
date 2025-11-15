import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as ecs from '../../aws-ecs';
import { Stack, Size } from '../../core';
import * as batch from '../lib';

describe('ConsumableResourceProperties', () => {
  let stack: Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
  });

  test('can specify consumable resources in job definition', () => {
    // GIVEN
    const computeEnvironment = new batch.ManagedEc2EcsComputeEnvironment(stack, 'ComputeEnvironment', {
      vpc,
    });

    const jobQueue = new batch.JobQueue(stack, 'JobQueue', {
      computeEnvironments: [{ computeEnvironment, order: 1 }],
    });

    const container = new batch.EcsEc2ContainerDefinition(stack, 'Container', {
      image: ecs.ContainerImage.fromRegistry('busybox'),
      cpu: 1,
      memory: Size.mebibytes(128),
    });

    // WHEN
    new batch.EcsJobDefinition(stack, 'JobDefinition', {
      container,
      consumableResourceProperties: {
        consumableResourceList: [
          {
            consumableResource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/license-tokens',
            quantity: 2,
          },
          {
            consumableResource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/api-calls',
            quantity: 100,
          },
        ],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ConsumableResourceProperties: {
        ConsumableResourceList: [
          {
            ConsumableResource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/license-tokens',
            Quantity: 2,
          },
          {
            ConsumableResource: 'arn:aws:batch:us-east-1:123456789012:consumable-resource/api-calls',
            Quantity: 100,
          },
        ],
      },
    });
  });

  test('job definition without consumable resources should not have the property', () => {
    // GIVEN
    const computeEnvironment = new batch.ManagedEc2EcsComputeEnvironment(stack, 'ComputeEnvironment', {
      vpc,
    });

    const container = new batch.EcsEc2ContainerDefinition(stack, 'Container', {
      image: ecs.ContainerImage.fromRegistry('busybox'),
      cpu: 1,
      memory: Size.mebibytes(128),
    });

    // WHEN
    new batch.EcsJobDefinition(stack, 'JobDefinition', {
      container,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      Type: 'container',
    });

    const template = Template.fromStack(stack);
    const jobDefinitions = template.findResources('AWS::Batch::JobDefinition');
    const jobDefinition = Object.values(jobDefinitions)[0];

    expect(jobDefinition.Properties.ConsumableResourceProperties).toBeUndefined();
  });
});
