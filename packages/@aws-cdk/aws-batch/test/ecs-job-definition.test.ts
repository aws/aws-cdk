import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import { Stack } from '@aws-cdk/core';
import { Compatibility, EcsEc2ContainerDefinition, EcsFargateContainerDefinition, EcsJobDefinition } from '../lib';


test('EcsJobDefinition uses Compatibility.EC2 for EC2 containers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'ECSJobDefn', {
    containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryMiB: 2048,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PlatformCapabilities: [Compatibility.EC2],
  });
});

test('EcsJobDefinition uses Compatibility.FARGATE for Fargate containers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'ECSJobDefn', {
    containerDefinition: new EcsFargateContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryMiB: 2048,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PlatformCapabilities: [Compatibility.FARGATE],
  });
});

test('can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const importedJob = EcsJobDefinition.fromJobDefinitionArn(stack, 'importedJobDefinition',
    'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');

  // THEN
  expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
});

