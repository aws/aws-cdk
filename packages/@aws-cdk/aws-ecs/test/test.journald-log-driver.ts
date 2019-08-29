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

  'create a journald log driver with options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JournaldLogDriver({
        tag: 'hello'
      })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'journald',
            Options: {
              tag: 'hello'
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

  // "create a journald log driver using journald"(test: Test) {
  //   // WHEN
  //   td.addContainer('Container', {
  //     image,
  //     logging: ecs.JournaldLogDriver.journald()
  //   });

  //   // THEN
  //   expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
  //     ContainerDefinitions: [
  //       {
  //         LogConfiguration: {
  //           LogDriver: 'journald'
  //         }
  //       }
  //     ]
  //   }));

  //   test.done();
  // },
};
