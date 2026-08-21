import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
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

test('grantInvokeApiDestination grants events:InvokeApiDestination on a created api destination', () => {
  // GIVEN
  const stack = new Stack();
  const connection = new events.Connection(stack, 'Connection', {
    authorization: events.Authorization.basic('username', SecretValue.unsafePlainText('password')),
    connectionName: 'testConnection',
  });
  const destination = new events.ApiDestination(stack, 'ApiDestination', {
    apiDestinationName: 'ApiDestination',
    connection,
    endpoint: 'someendpoint',
  });
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
  });

  // WHEN
  destination.grantInvokeApiDestination(role);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'events:InvokeApiDestination',
          Effect: 'Allow',
          // The resource-format ARN (ArnForPolicy) is used for the policy Resource.
          Resource: { 'Fn::GetAtt': [Match.anyValue(), 'ArnForPolicy'] },
        },
      ]),
    },
  });
});

test('grantInvokeApiDestination grants events:InvokeApiDestination on an imported api destination', () => {
  // GIVEN
  const stack = new Stack();
  const connection = events.Connection.fromEventBusArn(
    stack,
    'Connection',
    'arn:aws:events:us-east-1:123456789012:event-bus/EventBusName',
    'arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-f3gDy9',
  );
  const apiDestinationArnForPolicy = 'arn:aws:events:us-east-1:123456789012:api-destination/DestinationName';
  const apiDestinationArn = `${apiDestinationArnForPolicy}/11111111-1111-1111-1111-111111111111`;
  const destination = events.ApiDestination.fromApiDestinationAttributes(
    stack,
    'ApiDestination',
    { apiDestinationArn, connection, apiDestinationArnForPolicy },
  );
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
  });

  // WHEN
  destination.grantInvokeApiDestination(role);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'events:InvokeApiDestination',
          Effect: 'Allow',
          Resource: apiDestinationArnForPolicy,
        },
      ]),
    },
  });
});

test('grantInvokeApiDestination falls back to the plain ARN when ArnForPolicy is absent', () => {
  // GIVEN
  const stack = new Stack();
  const connection = events.Connection.fromEventBusArn(
    stack,
    'Connection',
    'arn:aws:events:us-east-1:123456789012:event-bus/EventBusName',
    'arn:aws:secretsmanager:us-east-1:123456789012:secret:SecretName-f3gDy9',
  );
  const apiDestinationArn = 'arn:aws:events:us-east-1:123456789012:api-destination/DestinationName/11111111-1111-1111-1111-111111111111';
  const destination = events.ApiDestination.fromApiDestinationAttributes(
    stack,
    'ApiDestination',
    { apiDestinationArn, connection },
  );
  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
  });

  // WHEN
  destination.grantInvokeApiDestination(role);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'events:InvokeApiDestination',
          Effect: 'Allow',
          Resource: apiDestinationArn,
        },
      ]),
    },
  });
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
