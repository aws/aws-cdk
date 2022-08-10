import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { Duration, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('sns topic as an event rule target', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topic));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Sid: '0',
          Action: 'sns:Publish',
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: { Ref: 'MyTopic86869434' },
        },
      ],
      Version: '2012-10-17',
    },
    Topics: [{ Ref: 'MyTopic86869434' }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
      },
    ],
  });
});

test('multiple uses of a topic as a target results in a single policy statement', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');

  // WHEN
  for (let i = 0; i < 5; ++i) {
    const rule = new events.Rule(stack, `Rule${i}`, {
      schedule: events.Schedule.rate(Duration.hours(1)),
    });
    rule.addTarget(new targets.SnsTopic(topic));
  }

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: { Ref: 'MyTopic86869434' },
          Sid: '0',
        },
      ],
      Version: '2012-10-17',
    },
    Topics: [{ Ref: 'MyTopic86869434' }],
  });
});

test('dead letter queue is configured correctly', () => {
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');
  const deadLetterQueue = new sqs.Queue(stack, 'MyDeadLetterQueue');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topic, {
    deadLetterQueue,
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
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