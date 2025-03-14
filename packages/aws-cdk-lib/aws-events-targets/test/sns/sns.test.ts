import { Template } from '../../../assertions';
import * as events from '../../../aws-events';
import * as iam from '../../../aws-iam';
import * as sns from '../../../aws-sns';
import * as sqs from '../../../aws-sqs';
import { Duration, Stack } from '../../../core';
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
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyTopicEventsRole0D2D3332', 'Arn'] },
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
        },
      ],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: { Ref: 'MyTopic86869434' },
        },
      ],
      Version: '2012-10-17',
    },
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
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyTopicEventsRole0D2D3332', 'Arn'] },
      },
    ],
  });
});

test('specifying custom role for sns project target', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });
  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topic, { role }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
      },
    ],
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

