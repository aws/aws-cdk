import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('syslog log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');


  });

  test('create a syslog log driver with options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SyslogLogDriver({
        tag: 'hello',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
            Options: {
              tag: 'hello',
            },
          },
        },
      ],
    });


  });

  test('create a syslog log driver without options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SyslogLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
          },
        },
      ],
    });


  });

  test('create a syslog log driver using syslog', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.syslog(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
            Options: {},
          },
        },
      ],
    });


  });
});
