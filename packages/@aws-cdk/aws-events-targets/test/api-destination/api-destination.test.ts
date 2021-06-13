import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as events from '@aws-cdk/aws-events';
import { Duration, Stack } from '@aws-cdk/core';
import * as targets from '../../lib';

test('use api destination as an eventrule target', () => {
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

  const destination = new events.ApiDestination(stack, 'Destination', {
    apiDestinationName: 'apiDestinationName',
    connection: connection,
    invocationEndpoint: 'https://endpoint.com',
    invocationRateLimit: Duration.seconds(10),
    httpMethod: events.HttpMethod.POST,
  });

  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(Duration.minutes(1)),
  });

  // WHEN
  rule.addTarget(new targets.ApiDestination(destination));

  // THEN
  expect(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 minute)',
    State: 'ENABLED',
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'DestinationApiDestinationA879FAE5',
            'Arn',
          ],
        },
        Id: 'Target0',
        HttpParameters: {},
      },
    ],
  }));
});
