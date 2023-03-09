import { Match, Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as kms from '@aws-cdk/aws-kms';
import * as sqs from '@aws-cdk/aws-sqs';
import { App, Duration, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
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
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
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
  });

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
      },
    ],
  });
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
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
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
  });
});

test('Encrypted queues result in a policy statement with aws:sourceAccount condition when the feature flag is on', () => {
  const app = new App();
  // GIVEN
  const ruleStack = new Stack(app, 'ruleStack', {
    env: {
      account: '111111111111',
      region: 'us-east-1',
    },
  });
  ruleStack.node.setContext(cxapi.EVENTS_TARGET_QUEUE_SAME_ACCOUNT, true);

  const rule = new events.Rule(ruleStack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  const queueStack = new Stack(app, 'queueStack', {
    env: {
      account: '222222222222',
      region: 'us-east-1',
    },
  });
  const queue = new sqs.Queue(queueStack, 'MyQueue', {
    encryptionMasterKey: kms.Key.fromKeyArn(queueStack, 'key', 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab'),
  });


  // WHEN
  rule.addTarget(new targets.SqsQueue(queue));

  // THEN
  Template.fromStack(queueStack).hasResourceProperties('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
          ],
          Condition: {
            StringEquals: {
              'aws:SourceAccount': '111111111111',
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
      ]),
      Version: '2012-10-17',
    },
    Queues: [{ Ref: 'MyQueueE6CA6235' }],
  });
});

test('Encrypted queues result in a permissive policy statement when the feature flag is off', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue', {
    encryptionMasterKey: kms.Key.fromKeyArn(stack, 'key', 'arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab'),
  });

  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'sqs:SendMessage',
            'sqs:GetQueueAttributes',
            'sqs:GetQueueUrl',
          ],
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
  });

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
      },
    ],
  });
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
        SqsParameters: {
          MessageGroupId: 'MyMessageGroupId',
        },
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
