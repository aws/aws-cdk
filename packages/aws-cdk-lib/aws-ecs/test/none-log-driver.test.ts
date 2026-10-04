import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('none log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
  });

  test('create a none log driver using class', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.NoneLogDriver(),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'none',
          },
        }),
      ],
    });
  });

  test('create a none log driver using LogDrivers.none()', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.LogDrivers.none(),
      memoryLimitMiB: 128,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'none',
          },
        }),
      ],
    });
  });
});
