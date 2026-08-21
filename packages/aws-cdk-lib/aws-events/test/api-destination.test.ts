import { Template } from '../../assertions';
import { Stack, SecretValue } from '../../core';
import * as events from '../lib';

test('creates an api destination for an EventBus', () => {
  // GIVEN
  const stack = new Stack();
  const connection = new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.basic('username', SecretValue.unsafePlainText('password')),
    connectionName: 'testConnection',
    description: 'ConnectionDescription',
  });

  // WHEN
  new events.ApiDestination(stack, 'ApiDestination', {
    apiDestinationName: 'ApiDestination',
    connection,
    description: 'ApiDestination',
    httpMethod: events.HttpMethod.GET,
    endpoint: 'someendpoint',
    rateLimitPerSecond: 60,
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Events::ApiDestination', {
    ConnectionArn: { 'Fn::GetAtt': ['Connection07624BCD', 'Arn'] },
    Description: 'ApiDestination',
    HttpMethod: 'GET',
    InvocationEndpoint: 'someendpoint',
    InvocationRateLimitPerSecond: 60,
    Name: 'ApiDestination',
  });
});

test('imports an api destination from its arn', () => {
  // GIVEN
  const stack = new Stack();
  const connection = events.Connection.fromEventBusArn(
    stack,
    'Connection',
    'arn:aws:events:us-east-1:123456789012:event-bus/EventBusName',
    'arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-f3gDy9',
  );

  // WHEN
  const apiDestinationArnForPolicy = 'arn:aws:events:us-east-1:123456789012:api-destination/DestinationName';
  const apiDestinationArn = `${apiDestinationArnForPolicy}/11111111-1111-1111-1111-111111111111`;
  const destination = events.ApiDestination.fromApiDestinationAttributes(
    stack,
    'ApiDestination',
    { apiDestinationArn, connection, apiDestinationArnForPolicy },
  );

  // THEN
  expect(destination.apiDestinationArn).toEqual(apiDestinationArn);
  expect(destination.apiDestinationArnForPolicy).toEqual(apiDestinationArnForPolicy);
  expect(destination.apiDestinationName).toEqual('DestinationName/11111111-1111-1111-1111-111111111111');
});

test('throws if imported api destination ARN is invalid', () => {
  // GIVEN
  const stack = new Stack();
  const connection = events.Connection.fromEventBusArn(
    stack,
    'Connection',
    'arn:aws:events:us-east-1:123456789012:event-bus/EventBusName',
    'arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-f3gDy9',
  );

  // THEN
  const apiDestinationArn = 'arn:aws:events:us-east-1:123456789012:api-destination';
  expect(() => {
    events.ApiDestination.fromApiDestinationAttributes(
      stack,
      'ApiDestination',
      { apiDestinationArn, connection },
    );
  }).toThrow("Could not extract Api Destionation name from ARN: 'arn:aws:events:us-east-1:123456789012:api-destination'");
});

// Regression coverage for issue #37996: under `exactOptionalPropertyTypes`,
// `ApiDestination` must stay assignable to the optional
// `IApiDestination.apiDestinationArnForPolicy`. The `IApiDestination` annotations
// are the type-level guard; the runtime expectations confirm the getter ->
// readonly-field refactor preserves behavior.
test('a concrete ApiDestination is assignable to IApiDestination and exposes apiDestinationArnForPolicy', () => {
  // GIVEN
  const stack = new Stack();
  const connection = new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.basic('username', SecretValue.unsafePlainText('password')),
  });

  // WHEN
  const apiDestination = new events.ApiDestination(stack, 'ApiDestination', {
    connection,
    endpoint: 'someendpoint',
  });

  // THEN
  const asInterface: events.IApiDestination = apiDestination;
  expect(asInterface.apiDestinationArnForPolicy).toBeDefined();
});

test('imported api destination has no apiDestinationArnForPolicy when not provided', () => {
  // GIVEN
  const stack = new Stack();
  const connection = events.Connection.fromEventBusArn(
    stack,
    'Connection',
    'arn:aws:events:us-east-1:123456789012:event-bus/EventBusName',
    'arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-f3gDy9',
  );

  // WHEN
  const destination: events.IApiDestination = events.ApiDestination.fromApiDestinationAttributes(
    stack,
    'ApiDestination',
    {
      apiDestinationArn: 'arn:aws:events:us-east-1:123456789012:api-destination/DestinationName/11111111-1111-1111-1111-111111111111',
      connection,
    },
  );

  // THEN
  expect(destination.apiDestinationArnForPolicy).toBeUndefined();
});
