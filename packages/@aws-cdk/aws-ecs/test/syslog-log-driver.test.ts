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

  'create a syslog log driver with options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SyslogLogDriver({
        tag: 'hello',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
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
    }));

    test.done();
  },

  'create a syslog log driver without options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SyslogLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
          },
        },
      ],
    }));

    test.done();
  },

  'create a syslog log driver using syslog'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.syslog(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
            Options: {},
          },
        },
      ],
    }));

    test.done();
  },
});
