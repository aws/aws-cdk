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

  'create a gelf log driver with minimum options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.GelfLogDriver({
        address: 'my-gelf-address'
      })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'gelf',
            Options: {
              'gelf-address': 'my-gelf-address'
            }
          }
        }
      ]
    }));

    test.done();
  },

  "create a gelf log driver using gelf with minimum options"(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.gelf({
        address: 'my-gelf-address'
      })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'gelf',
            Options: {
              'gelf-address': 'my-gelf-address'
            }
          }
        }
      ]
    }));

    test.done();
  },
};
