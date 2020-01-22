import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

export = {
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');

    cb();
  },

  'create a splunk log driver with minimum options'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.SplunkLogDriver({
        token: cdk.SecretValue.secretsManager('my-splunk-token'),
        url: 'my-splunk-url'
      }),
      memoryLimitMiB: 128
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-token': '{{resolve:secretsmanager:my-splunk-token:SecretString:::}}',
              'splunk-url': 'my-splunk-url'
            }
          }
        }
      ]
    }));

    test.done();
  },

  "create a splunk log driver using splunk with minimum options"(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.splunk({
        token: cdk.SecretValue.secretsManager('my-splunk-token'),
        url: 'my-splunk-url'
      }),
      memoryLimitMiB: 128
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'splunk',
            Options: {
              'splunk-token': '{{resolve:secretsmanager:my-splunk-token:SecretString:::}}',
              'splunk-url': 'my-splunk-url'
            }
          }
        }
      ]
    }));

    test.done();
  },
};
