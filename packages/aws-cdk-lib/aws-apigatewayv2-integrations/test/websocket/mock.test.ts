import { Template } from '../../../assertions';
import { WebSocketApi } from '../../../aws-apigatewayv2';
import { Stack } from '../../../core';
import { WebSocketMockIntegration } from './../../lib/websocket/mock';

describe('MockWebSocketIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'Api', {
      defaultRouteOptions: { integration: new WebSocketMockIntegration('DefaultIntegration') },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'MOCK',
      IntegrationUri: '',
    });
  });

  test('can set custom properties', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'Api', {
      defaultRouteOptions: {
        integration: new WebSocketMockIntegration('DefaultIntegration', {
          requestTemplates: { 'application/json': '{ "statusCode": 200 }' },
          templateSelectionExpression: '\\$default',
        }),
        returnResponse: true,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'MOCK',
      IntegrationUri: '',
      RequestTemplates: { 'application/json': '{ "statusCode": 200 }' },
      TemplateSelectionExpression: '\\$default',
    });
  });
});
