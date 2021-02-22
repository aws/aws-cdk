import { expect, haveResourceLike } from '@aws-cdk/assert';
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

  'create a journald log driver with options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver({
        tag: 'hello',
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
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
    }));

    test.done();
  },

  'create a journald log driver without options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
          },
        },
      ],
    }));

    test.done();
  },

  'create a journald log driver using journald'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.journald(),
      memoryLimitMiB: 128,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
            Options: {},
          },
        },
      ],
    }));

    test.done();
  },
});
