import { expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/cdk';
import targets = require('../../lib');

test('sqs queue as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');
  const rule = new events.Rule(stack, 'MyRule', {
    scheduleExpression: 'rate(1 hour)',
  });

  // WHEN
  rule.addTarget(new targets.SqsQueue(queue));

  // THEN
  expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "sqs:SendMessage",
            "sqs:SendMessageBatch",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl"
          ],
          Effect: "Allow",
          Principal: {
            Service: { "Fn::Join": ["", ["events.", { Ref: "AWS::URLSuffix" }]] },
          },
          Resource: { "Fn::GetAtt": ["MyQueueE6CA6235", "Arn"] },
        }
      ],
      Version: "2012-10-17"
    },
    Queues: [{ Ref: "MyQueueE6CA6235" }]
  }));

  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: "rate(1 hour)",
    State: "ENABLED",
    Targets: [
      {
        Arn: { "Fn::GetAtt": ["MyQueueE6CA6235", "Arn"] },
        Id: "MyQueue"
      }
    ]
  }));
});

test('multiple uses of a queue as a target results in a single policy statement', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');

  // WHEN
  for (let i = 0; i < 5; ++i) {
    const rule = new events.Rule(stack, `Rule${i}`, { scheduleExpression: 'rate(1 hour)' });
    rule.addTarget(new targets.SqsQueue(queue));
  }

  // THEN
  expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "sqs:SendMessage",
            "sqs:SendMessageBatch",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl"
          ],
          Effect: "Allow",
          Principal: { Service: { "Fn::Join": ["", ["events.", { Ref: "AWS::URLSuffix" }]] } },
          Resource: { "Fn::GetAtt": ["MyQueueE6CA6235", "Arn"] },
        }
      ],
      Version: "2012-10-17"
    },
    Queues: [{ Ref: "MyQueueE6CA6235" }]
  }));
});
