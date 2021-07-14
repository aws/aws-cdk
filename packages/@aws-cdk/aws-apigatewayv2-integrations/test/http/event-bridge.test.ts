import '@aws-cdk/assert-internal/jest';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Stack } from '@aws-cdk/core';
import { EventBridgePutEventsIntegration } from '../../lib/http/event-bridge';

describe('AwsServiceIntegration', () => {
  describe('EventBridge', () => {
    test('basic integration', () => {
      const stack = new Stack();
      const api = new HttpApi(stack, 'API', {
        defaultIntegration: new EventBridgePutEventsIntegration(),
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Integration', {
        ApiId: api.apiId,
        IntegrationType: 'AWS_PROXY',
        IntegrationSubType: 'EventBridge-PutEvents',
        PayloadFormatVersion: '1.0',
        RequestParameters: {
          Detail: '$request.body',
          DetailType: '$request.body.type',
          Source: 'MySource',
        },
      });
    });
  });
});