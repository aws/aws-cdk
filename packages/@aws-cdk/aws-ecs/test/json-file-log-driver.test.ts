import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('json file log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');


  });

  test('create a json-file log driver with options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JsonFileLogDriver({
        env: ['hello'],
      }),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'json-file',
            Options: {
              env: 'hello',
            },
          },
        }),
      ],
    });
  });

  test('create a json-file log driver without options', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.JsonFileLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'json-file',
          },
        }),
      ],
    });
  });

  test('create a json-file log driver using json-file', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.jsonFile(),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'json-file',
            Options: {},
          },
        }),
      ],
    });
  });
});
