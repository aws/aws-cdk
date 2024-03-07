import { WebSocketAwsIntegration } from './../../lib/websocket/aws';
import { Template } from '../../../assertions';
import { WebSocketApi } from '../../../aws-apigatewayv2';
import { Stack } from '../../../core';

describe('MockWebSocketIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'Api', {
      defaultRouteOptions: {
        integration: new WebSocketAwsIntegration('AwsIntegration', {
          integrationUri: 'arn:aws:apigateway:us-west-2:dynamodb:action/PutItem',
          integrationMethod: 'POST',
        }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS',
      IntegrationUri: 'arn:aws:apigateway:us-west-2:dynamodb:action/PutItem',
      IntegrationMethod: 'POST',
    });
  });
});
