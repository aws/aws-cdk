import { Match, Template } from '@aws-cdk/assertions';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

describe('aws log driver', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    td = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');


  });

  test('create an aws log driver', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.AwsLogDriver({
        datetimeFormat: 'format',
        logRetention: logs.RetentionDays.ONE_MONTH,
        multilinePattern: 'pattern',
        streamPrefix: 'hello',
        mode: ecs.AwsLogDriverMode.NON_BLOCKING,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.ONE_MONTH,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'TaskDefinitionContainerLogGroup4D0A87C1' },
              'awslogs-stream-prefix': 'hello',
              'awslogs-region': { Ref: 'AWS::Region' },
              'awslogs-datetime-format': 'format',
              'awslogs-multiline-pattern': 'pattern',
              'mode': 'non-blocking',
            },
          },
        }),
      ],
    });
  });

  test('create an aws log driver using awsLogs', () => {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: ecs.AwsLogDriver.awsLogs({
        datetimeFormat: 'format',
        logRetention: logs.RetentionDays.ONE_MONTH,
        multilinePattern: 'pattern',
        streamPrefix: 'hello',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.ONE_MONTH,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'TaskDefinitionContainerLogGroup4D0A87C1' },
              'awslogs-stream-prefix': 'hello',
              'awslogs-region': { Ref: 'AWS::Region' },
              'awslogs-datetime-format': 'format',
              'awslogs-multiline-pattern': 'pattern',
            },
          },
        }),
      ],
    });
  });

  test('with a defined log group', () => {
    // GIVEN
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.AwsLogDriver({
        logGroup,
        streamPrefix: 'hello',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.TWO_YEARS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'LogGroupF5B46931' },
              'awslogs-stream-prefix': 'hello',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
        }),
      ],
    });
  });

  test('without a defined log group: creates one anyway', () => {
    // GIVEN
    td.addContainer('Container', {
      image,
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'hello',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {});
  });

  test('throws when specifying log retention and log group', () => {
    // GIVEN
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // THEN
    expect(() => new ecs.AwsLogDriver({
      logGroup,
      logRetention: logs.RetentionDays.FIVE_DAYS,
      streamPrefix: 'hello',
    })).toThrow(/`logGroup`.*`logRetentionDays`/);


  });

  test('allows cross-region log group', () => {
    // GIVEN
    const logGroupRegion = 'asghard';
    const logGroup = logs.LogGroup.fromLogGroupArn(stack, 'LogGroup',
      `arn:aws:logs:${logGroupRegion}:1234:log-group:my_log_group`);

    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.AwsLogDriver({
        logGroup,
        streamPrefix: 'hello',
      }),
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': logGroup.logGroupName,
              'awslogs-stream-prefix': 'hello',
              'awslogs-region': logGroupRegion,
            },
          },
        }),
      ],
    });
  });
});
