import { Template } from '@aws-cdk/assertions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('Use EventBus as an event rule target', () => {
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  rule.addTarget(new targets.EventBus(events.EventBus.fromEventBusArn(
    stack,
    'External',
    'arn:aws:events:us-east-1:111111111111:default',
  ),
  ));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [
      {
        Arn: 'arn:aws:events:us-east-1:111111111111:default',
        Id: 'Target0',
        RoleArn: {
          'Fn::GetAtt': [
            'RuleEventsRoleC51A4248',
            'Arn',
          ],
        },
      },
    ],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Action: 'events:PutEvents',
        Resource: 'arn:aws:events:us-east-1:111111111111:default',
      }],
      Version: '2012-10-17',
    },
    Roles: [{
      Ref: 'RuleEventsRoleC51A4248',
    }],
  });
});

test('with supplied role', () => {
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
    roleName: 'GivenRole',
  });

  rule.addTarget(new targets.EventBus(
    events.EventBus.fromEventBusArn(
      stack,
      'External',
      'arn:aws:events:us-east-1:123456789012:default',
    ),
    { role },
  ));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [{
      Arn: 'arn:aws:events:us-east-1:123456789012:default',
      Id: 'Target0',
      RoleArn: {
        'Fn::GetAtt': [
          'Role1ABCC5F0',
          'Arn',
        ],
      },
    }],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Effect: 'Allow',
        Action: 'events:PutEvents',
        Resource: 'arn:aws:events:us-east-1:123456789012:default',
      }],
      Version: '2012-10-17',
    },
    Roles: [{
      Ref: 'Role1ABCC5F0',
    }],
  });
});

test('with a Dead Letter Queue specified', () => {
  const stack = new Stack();
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });
  const queue = new sqs.Queue(stack, 'Queue');

  rule.addTarget(new targets.EventBus(
    events.EventBus.fromEventBusArn(
      stack,
      'External',
      'arn:aws:events:us-east-1:123456789012:default',
    ),
    { deadLetterQueue: queue },
  ));

  Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
    Targets: [{
      Arn: 'arn:aws:events:us-east-1:123456789012:default',
      Id: 'Target0',
      RoleArn: {
        'Fn::GetAtt': [
          'RuleEventsRoleC51A4248',
          'Arn',
        ],
      },
      DeadLetterConfig: {
        Arn: {
          'Fn::GetAtt': [
            'Queue4A7E3555',
            'Arn',
          ],
        },
      },
    }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::QueuePolicy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'sqs:SendMessage',
          Condition: {
            ArnEquals: {
              'aws:SourceArn': {
                'Fn::GetAtt': [
                  'Rule4C995B7F',
                  'Arn',
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: {
            Service: 'events.amazonaws.com',
          },
          Resource: {
            'Fn::GetAtt': [
              'Queue4A7E3555',
              'Arn',
            ],
          },
          Sid: 'AllowEventRuleRule',
        },
      ],
      Version: '2012-10-17',
    },
    Queues: [
      {
        Ref: 'Queue4A7E3555',
      },
    ],
  });
});
