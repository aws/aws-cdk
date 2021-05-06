import '@aws-cdk/assert-internal/jest';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
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

  expect(stack).toHaveResource('AWS::Events::Rule', {
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
  expect(stack).toHaveResource('AWS::IAM::Policy', {
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

  expect(stack).toHaveResource('AWS::Events::Rule', {
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
  expect(stack).toHaveResource('AWS::IAM::Policy', {
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