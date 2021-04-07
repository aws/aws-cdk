import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert-internal';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';

let stack: cdk.Stack;
let td: ecs.TaskDefinition;
const image = ecs.ContainerImage.fromRegistry('test-image');

nodeunitShim({
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    td = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');

    cb();
  },

  'create an aws log driver'(test: Test) {
    // WHEN
    td.addContainer('Container', {
      image,
      logging: new ecs.AwsLogDriver({
        datetimeFormat: 'format',
        logRetention: logs.RetentionDays.ONE_MONTH,
        multilinePattern: 'pattern',
        streamPrefix: 'hello',
      }),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.ONE_MONTH,
    }));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
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
        },
      ],
    }));

    test.done();
  },

  'create an aws log driver using awsLogs'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.ONE_MONTH,
    }));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
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
        },
      ],
    }));

    test.done();
  },

  'with a defined log group'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.TWO_YEARS,
    }));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'LogGroupF5B46931' },
              'awslogs-stream-prefix': 'hello',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
        },
      ],
    }));

    test.done();
  },

  'without a defined log group: creates one anyway'(test: Test) {
    // GIVEN
    td.addContainer('Container', {
      image,
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'hello',
      }),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {}));

    test.done();
  },

  'throws when specifying log retention and log group'(test: Test) {
    // GIVEN
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // THEN
    test.throws(() => new ecs.AwsLogDriver({
      logGroup,
      logRetention: logs.RetentionDays.FIVE_DAYS,
      streamPrefix: 'hello',
    }), /`logGroup`.*`logRetentionDays`/);

    test.done();
  },
});
