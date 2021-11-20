import { Template } from '@aws-cdk/assertions';
import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2';
import { Stack } from '@aws-cdk/core';
import { MockWebSocketIntegration } from '../../lib';


describe('MockWebSocketIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'Api', {
      connectRouteOptions: {
        integration: new MockWebSocketIntegration({}),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'MOCK',
      IntegrationUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':apigateway:',
            {
              Ref: 'AWS::Region',
            },
            ':lambda:path/2015-03-31/functions/',
            {
              'Fn::GetAtt': [
                'Fn9270CBC0',
                'Arn',
              ],
            },
            '/invocations',
          ],
        ],
      },
    });
  });
});
