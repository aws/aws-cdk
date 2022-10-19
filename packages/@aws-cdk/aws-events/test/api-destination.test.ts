import { Template } from '@aws-cdk/assertions';
import { Stack, SecretValue } from '@aws-cdk/core';
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
