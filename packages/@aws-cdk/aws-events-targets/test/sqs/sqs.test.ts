import { expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/cdk';
import targets = require('../../lib');

test('sns topic as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(cdk.Duration.hours(1)),
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
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl"
          ],
          Condition: {
            ArnEquals: {
              "aws:SourceArn": {
                "Fn::GetAtt": [
                  "MyRuleA44AB831",
                  "Arn"
                ]
              }
            }
          },
          Effect: "Allow",
          Principal: { Service: { "Fn::Join": ["", ["events.", { Ref: "AWS::URLSuffix" }]] } },
          Resource: {
            "Fn::GetAtt": [
              "MyQueueE6CA6235",
              "Arn"
            ]
          }
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
        Arn: {
          "Fn::GetAtt": [
            "MyQueueE6CA6235",
            "Arn"
          ]
        },
        Id: "MyQueue"
      }
    ]
  }));
});

test('multiple uses of a queue as a target results in multi policy statement because of condition', () => {
  // GIVEN
  const stack = new Stack();
  const queue = new sqs.Queue(stack, 'MyQueue');

  // WHEN
  for (let i = 0; i < 2; ++i) {
    const rule = new events.Rule(stack, `Rule${i}`, {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
    });
    rule.addTarget(new targets.SqsQueue(queue));
  }

  // THEN
  expect(stack).to(haveResource('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "sqs:SendMessage",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl"
          ],
          Condition: {
            ArnEquals: {
              "aws:SourceArn": {
                "Fn::GetAtt": [
                  "Rule071281D88",
                  "Arn"
                ]
              }
            }
          },
          Effect: "Allow",
          Principal: { Service: { "Fn::Join": ["", ["events.", { Ref: "AWS::URLSuffix" }]] } },
          Resource: {
            "Fn::GetAtt": [
              "MyQueueE6CA6235",
              "Arn"
            ]
          }
        },
        {
          Action: [
            "sqs:SendMessage",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl"
          ],
          Condition: {
            ArnEquals: {
              "aws:SourceArn": {
                "Fn::GetAtt": [
                  "Rule136483A30",
                  "Arn"
                ]
              }
            }
          },
          Effect: "Allow",
          Principal: { Service: { "Fn::Join": ["", ["events.", { Ref: "AWS::URLSuffix" }]] } },
          Resource: {
            "Fn::GetAtt": [
              "MyQueueE6CA6235",
              "Arn"
            ]
          }
        }
      ],
      Version: "2012-10-17"
    },
    Queues: [{ Ref: "MyQueueE6CA6235" }]
  }));
});
