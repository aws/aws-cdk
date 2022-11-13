import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { Duration, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('ssm automation as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });
  const automationArn = 'arn:aws:ssm:us-east-1:123456789012:automation-definition/MyAutomation:1';
  const automationAssumeRole = new iam.Role(stack, 'AutomationAssumeRole', {
    assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
  });

  // WHEN
  rule.addTarget(new targets.SsmAutomation(automationArn, {
    input: {
      MyParameter: ['MyParameterValue'],
    },
    automationAssumeRole,
  }));

  // THEN

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: automationArn,
        Id: 'Target0',
      },
    ],
  });
});

test('dead letter queue is configured correctly', () => {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
  const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue, {
    deadLetterQueue,
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'MyQueueE6CA6235',
            'Arn',
          ],
        },
        Id: 'Target0',
        DeadLetterConfig: {
          Arn: {
            'Fn::GetAtt': [
              'MyDeadLetterQueueD997968A',
              'Arn',
            ],
          },
        },
      },
    ],
  });
});

test('specifying retry policy', () => {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue, {
    retryAttempts: 2,
    maxEventAge: Duration.hours(2),
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'MyQueueE6CA6235',
            'Arn',
          ],
        },
        Id: 'Target0',
        RetryPolicy: {
          MaximumEventAgeInSeconds: 7200,
          MaximumRetryAttempts: 2,
        },
      },
    ],
  });
});

test('specifying retry policy with 0 retryAttempts', () => {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue, {
    retryAttempts: 0,
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'MyQueueE6CA6235',
            'Arn',
          ],
        },
        Id: 'Target0',
        RetryPolicy: {
          MaximumRetryAttempts: 0,
        },
      },
    ],
  });
});
