import { expect, haveResource } from '@aws-cdk/assert';
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  'create an aws log driver'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const driver = new ecs.AwsLogDriver(stack, 'Log', {
      datetimeFormat: 'format',
      logRetentionDays: logs.RetentionDays.OneMonth,
      multilinePattern: 'pattern',
      streamPrefix: 'hello'
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::LogGroup', {
      RetentionInDays: logs.RetentionDays.OneMonth
    }));

    test.deepEqual(
      stack.node.resolve(driver.renderLogDriver()),
      {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': { Ref: 'LogLogGroup427F779C' },
          'awslogs-stream-prefix': 'hello',
          'awslogs-region': { Ref: 'AWS::Region' },
          'awslogs-datetime-format': 'format',
          'awslogs-multiline-pattern': 'pattern'
        }
      }
    );

    test.done();
  },

  'with a defined log group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // WHEN
    const driver = new ecs.AwsLogDriver(stack, 'Log', {
      logGroup,
      streamPrefix: 'hello'
    });

    // THEN
    test.deepEqual(
      stack.node.resolve(driver.renderLogDriver()),
      {
        logDriver: 'awslogs',
        options: {
          'awslogs-group': { Ref: 'LogGroupF5B46931' },
          'awslogs-stream-prefix': 'hello',
          'awslogs-region': { Ref: 'AWS::Region' }
        }
      }
    );

    test.done();
  },

  'throws when specifying log retention and log group'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // THEN
    test.throws(() => new ecs.AwsLogDriver(stack, 'Log', {
      logGroup,
      logRetentionDays: logs.RetentionDays.FiveDays,
      streamPrefix: 'hello'
    }), /`logGroup`.*`logRetentionDays`/);

    test.done();
  }
};
