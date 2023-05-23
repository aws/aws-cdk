import { Template } from 'aws-cdk-lib/assertions';
import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Stack } from 'aws-cdk-lib';
import { WebSocketMockIntegration } from '../../lib';

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
});
