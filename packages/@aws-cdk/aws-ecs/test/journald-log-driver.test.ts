import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('journald log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');


  });

  test('create a journald log driver with options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver({
        tag: 'hello',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
            Options: {
              tag: 'hello',
            },
          },
        },
      ],
    });


  });

  test('create a journald log driver without options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
          },
        },
      ],
    });


  });

  test('create a journald log driver using journald', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.journald(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
            Options: {},
          },
        },
      ],
    });


  });
});
