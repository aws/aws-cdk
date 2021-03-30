import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

nodeunitShim({
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');

    cb();
  },

  'create a fluentd log driver with options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FluentdLogDriver({
        tag: 'hello',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'fluentd',
            Options: {
              tag: 'hello',
            },
          },
        },
      ],
    }));

    test.done();
  },

  'create a fluentd log driver without options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.FluentdLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'fluentd',
          },
        },
      ],
    }));

    test.done();
  },

  'create a fluentd log driver with all possible options'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
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
        },
      ],
    }));

    test.done();
  },

  'create a fluentd log driver using fluentd'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.fluentd(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'fluentd',
          },
        },
      ],
    }));

    test.done();
  },
});
