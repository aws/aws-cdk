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

  Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0); // no role created if not specified
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

test('role is explicitly passed', () => {
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
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'events.amazonaws.com' },
      }],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'sns:Publish',
        Effect: 'Allow',
        Resource: { Ref: 'MyTopic86869434' },
      }],
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::SNS::TopicPolicy', 0); // no topic policy needed
});

test('authorizeUsingRole is enabled', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topic, { authorizeUsingRole: true }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopic86869434' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyRuleEventsRoleF186CAE5', 'Arn'] },
      },
    ],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'events.amazonaws.com' },
      }],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'sns:Publish',
        Effect: 'Allow',
        Resource: { Ref: 'MyTopic86869434' },
      }],
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::SNS::TopicPolicy', 0); // no topic policy needed
});

test('error is thrown when authorizeUsingRole is false and role is provided', () => {
  // GIVEN
  const stack = new Stack();
  const topic = new sns.Topic(stack, 'MyTopic');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });
  const role = new iam.Role(stack, 'MyRole', {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
  });

  // THEN
  expect(() => {
    // WHEN
    rule.addTarget(new targets.SnsTopic(topic, { role, authorizeUsingRole: false }));
  }).toThrow(/Cannot provide a role when authorizeUsingRole is false/);
});

test('multiple topics as targets (using a role) for a single event rule results in a single role and policy', () => {
  // GIVEN
  const stack = new Stack();
  const topicA = new sns.Topic(stack, 'MyTopicA');
  const topicB = new sns.Topic(stack, 'MyTopicB');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topicA, { authorizeUsingRole: true }));
  rule.addTarget(new targets.SnsTopic(topicB, { authorizeUsingRole: true }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopicA5E3E2E83' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyRuleEventsRoleF186CAE5', 'Arn'] },
      },
      {
        Arn: { Ref: 'MyTopicBE570F033' },
        Id: 'Target1',
        RoleArn: { 'Fn::GetAtt': ['MyRuleEventsRoleF186CAE5', 'Arn'] },
      },
    ],
  });

  Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'events.amazonaws.com' },
      }],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: { Ref: 'MyTopicA5E3E2E83' },
        },
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: { Ref: 'MyTopicBE570F033' },
        },
      ],
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::SNS::TopicPolicy', 0); // no topic policy needed
});

test('one target with a role and one without', () => {
  // GIVEN
  const stack = new Stack();
  const topicA = new sns.Topic(stack, 'MyTopicA');
  const topicB = new sns.Topic(stack, 'MyTopicB');
  const rule = new events.Rule(stack, 'MyRule', {
    schedule: events.Schedule.rate(Duration.hours(1)),
  });

  // WHEN
  rule.addTarget(new targets.SnsTopic(topicA, { authorizeUsingRole: true }));
  rule.addTarget(new targets.SnsTopic(topicB, { authorizeUsingRole: false }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: { Ref: 'MyTopicA5E3E2E83' },
        Id: 'Target0',
        RoleArn: { 'Fn::GetAtt': ['MyRuleEventsRoleF186CAE5', 'Arn'] },
      },
      {
        Arn: { Ref: 'MyTopicBE570F033' },
        Id: 'Target1',
      },
    ],
  });

  Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: { Service: 'events.amazonaws.com' },
      }],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sns:Publish',
          Effect: 'Allow',
          Resource: { Ref: 'MyTopicA5E3E2E83' },
        },
      ],
    },
  });

  Template.fromStack(stack).resourceCountIs('AWS::SNS::TopicPolicy', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [
        {
          Sid: '0',
          Action: 'sns:Publish',
          Effect: 'Allow',
          Principal: { Service: 'events.amazonaws.com' },
          Resource: { Ref: 'MyTopicBE570F033' },
        },
      ],
      Version: '2012-10-17',
    },
    Topics: [{ Ref: 'MyTopicBE570F033' }],
  });
});
