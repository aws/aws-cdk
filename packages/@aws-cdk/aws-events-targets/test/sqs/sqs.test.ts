import { expect as cdkExpect, haveResource } from '@aws-cdk/assert-internal';
import * as events from '@aws-cdk/aws-events';
import * as sqs from '@aws-cdk/aws-sqs';
import { Duration, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('sqs queue as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue));

  // THEN
  cdkExpect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
          ],
          Condition: {
            ArnEquals: {
              'aws:SourceArn': {
                'Fn::GetAtt': [
                  'MyRuleA44AB831',
                  'Arn',
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    Queues: [{ Ref: 'MyQueueE6CA6235' }],
  }));

  cdkExpect(stack).to(haveResource('AWS::Events::Rule', {
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
      },
    ],
  }));
});

test('multiple uses of a queue as a target results in multi policy statement because of condition', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');

  // WHEN
  for (let i = 0; i < 2; ++i) {
    const rule = new events.Rule(stack, `Rule${i}`, {
      schedule: events.Schedule.rate(Duration.hours(1)),
    });
    rule.addTarget(new targets.SqsQueue(queue));
  }

  // THEN
  cdkExpect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
          ],
          Condition: {
            ArnEquals: {
              'aws:SourceArn': {
                'Fn::GetAtt': [
                  'Rule071281D88',
                  'Arn',
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'Arn',
            ],
          },
        },
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
          ],
          Condition: {
            ArnEquals: {
              'aws:SourceArn': {
                'Fn::GetAtt': [
                  'Rule136483A30',
                  'Arn',
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: {
            'Fn::GetAtt': [
              'MyQueueE6CA6235',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    Queues: [{ Ref: 'MyQueueE6CA6235' }],
  }));
});

test('fail if messageGroupId is specified on non-fifo queues', () => {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');

  expect(() => new targets.SqsQueue(queue, { messageGroupId: 'MyMessageGroupId' }))
    .toThrow(/messageGroupId cannot be specified/);
});

test('fifo queues are synthesized correctly', () => {
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue', { fifo: true });
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue, {
    messageGroupId: 'MyMessageGroupId',
  }));

  cdkExpect(stack).to(haveResource('AWS::Events::Rule', {
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
        SqsParameters: {
          MessageGroupId: 'MyMessageGroupId',
        },
      },
    ],
  }));
});
