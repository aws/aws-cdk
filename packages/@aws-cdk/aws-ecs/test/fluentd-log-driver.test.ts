import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('fluentd log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
  });

  test('create a fluentd log driver with options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FluentdLogDriver({
        tag: 'hello',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'fluentd',
            Options: {
              tag: 'hello',
            },
          },
        }),
      ],
    });
  });

  test('create a fluentd log driver without options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FluentdLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'fluentd',
          },
        }),
      ],
    });
  });

  test('create a fluentd log driver with all possible options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FluentdLogDriver({
        address: 'localhost:24224',
        asyncConnect: true,
        bufferLimit: 128,
        retryWait: cdk.Duration.seconds(1),
        maxRetries: 4294967295,
        subSecondPrecision: false,
        tag: 'my-tag',
        labels: [
          'one',
          'two',
          'three',
        ],
        env: [
          'one',
          'two',
          'three',
        ],
        envRegex: '[0-9]{1}',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'fluentd',
            Options: {
              'fluentd-address': 'localhost:24224',
              'fluentd-async-connect': 'true',
              'fluentd-buffer-limit': '128',
              'fluentd-retry-wait': '1',
              'fluentd-max-retries': '4294967295',
              'fluentd-sub-second-precision': 'false',
              'tag': 'my-tag',
              'labels': 'one,two,three',
              'env': 'one,two,three',
              'env-regex': '[0-9]{1}',
            },
          },
        }),
      ],
    });
  });

  test('create a fluentd log driver using fluentd', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.fluentd(),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'fluentd',
          },
        }),
      ],
    });
  });
});
