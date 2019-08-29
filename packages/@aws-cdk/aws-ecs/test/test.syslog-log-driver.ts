import { expect, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../lib');

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

export = {
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
        tag: 'hello'
      })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
            Options: {
              tag: 'hello'
            }
          }
        }
      ]
    }));

    test.done();
  },

  'create a syslog log driver without options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SyslogLogDriver()
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog'
          }
        }
      ]
    }));

    test.done();
  },

  "create a syslog log driver using syslog"(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.syslog()
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'syslog',
            Options: {}
          }
        }
      ]
    }));

    test.done();
  },
};
