import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../lib');

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

export = {
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    td = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');

    cb();
  },

  'create a journald log driver with options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver({
        options: {
            tag: 'hello'
        }
      })
    });

    // THEN

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
            Options: {
              'tag': 'hello'
            }
          }
        }
      ]
    }));

    test.done();
  },

  'create a journald log driver without options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver()
    });

    // THEN

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald'
          }
        }
      ]
    }));

    test.done();
  },

  "create a journald log driver using journaldLogs"(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDriver.journaldLogs()
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.ONE_MONTH
    }));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awslogs'
          }
        }
      ]
    }));

    test.done();
  },
};
