import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as events from '@aws-cdk/aws-events';
import { Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('use aws batch job as an eventrule target', () => {
  // GIVEN
  const stack = new Stack();

  const connection = new events.Connection(stack, 'Connection', {
    authorizationType: events.AuthorizationType.BASIC,
    authParameters: {
      basicAuthParameters: {
        password: 'password',
        username: 'username',
      },
    },
    description: 'ConnectionDescription',
    connectionName: 'testConnection',
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.expression('rate(1 min)'),
  });

  // WHEN
  rule.addTarget(new targets.ApiDestination(connection));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 min)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'Connection07624BCD',
            'Arn',
          ],
        },
        Id: 'Target0',
        HttpParameters: {},
      },
    ],
  }));
});
