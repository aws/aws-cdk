import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { EventBus } from '@aws-cdk/aws-events';
import { Role } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { EventBridgePutEventsIntegration, EventBusMappingExpression, MappingExpression } from '../../lib/http/aws-proxy';

describe('EventBridge PutEvents Integration', () => {
  test('basic integration', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'API');
    const role = Role.fromRoleArn(stack, 'TestRole', 'arn:aws:iam::123456789012:role/test');
    new HttpRoute(stack, 'Route', {
      httpApi: api,
      integration: new EventBridgePutEventsIntegration({
        detail: MappingExpression.staticValue('detail'),
        detailType: MappingExpression.staticValue('type'),
        source: MappingExpression.staticValue('source'),
        role,
      }),
      routeKey: HttpRouteKey.with('/event'),
    });
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'EventBridge-PutEvents',
      PayloadFormatVersion: '1.0',
      CredentialsArn: 'arn:aws:iam::123456789012:role/test',
      RequestParameters: {
        Detail: 'detail',
        DetailType: 'type',
        Source: 'source',
      },
    });
  });
  test('full integration', () => {
    const stack = new Stack();
    const api = new HttpApi(stack, 'API');
    const role = Role.fromRoleArn(stack, 'TestRole', 'arn:aws:iam::123456789012:role/test');
    const eventBus = EventBus.fromEventBusArn(stack,
      'EventBus',
      'arn:aws:events:eu-west-1:123456789012:event-bus/different',
    );
    new HttpRoute(stack, 'Route', {
      httpApi: api,
      integration: new EventBridgePutEventsIntegration({
        detail: MappingExpression.staticValue('detail'),
        detailType: MappingExpression.staticValue('detail-type'),
        source: MappingExpression.staticValue('source'),
        role,
        eventBus: EventBusMappingExpression.fromEventBus(eventBus),
        region: 'eu-west-1',
        resources: MappingExpression.staticValue('["arn:aws:s3:::bucket"]'),
        time: MappingExpression.staticValue('2021-07-14T20:18:15Z'),
        traceHeader: MappingExpression.staticValue('x-trace-header'),
      }),
      routeKey: HttpRouteKey.with('/event'),
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationSubtype: 'EventBridge-PutEvents',
      PayloadFormatVersion: '1.0',
      CredentialsArn: 'arn:aws:iam::123456789012:role/test',
      RequestParameters: {
        Detail: 'detail',
        DetailType: 'detail-type',
        Source: 'source',
        EventBusName: 'different',
        Region: 'eu-west-1',
        Resources: '["arn:aws:s3:::bucket"]',
        Time: '2021-07-14T20:18:15Z',
        TraceHeader: 'x-trace-header',
      },
    });
  });
});
