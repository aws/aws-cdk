import { Template } from '../../../assertions';
import { ContentHandling, WebSocketApi } from '../../../aws-apigatewayv2';
import { Code, Function } from '../../../aws-lambda';
import * as lambda from '../../../aws-lambda';
import { Duration, Stack } from '../../../core';
import { WebSocketLambdaIntegration } from './../../lib/websocket/lambda';

describe('LambdaWebSocketIntegration', () => {
  const IntegrationUri = {
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
  };

  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const fooFn = fooFunction(stack, 'Fn');

    // WHEN
    new WebSocketApi(stack, 'Api', {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration('Integration', fooFn),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationUri,
    });
  });

  test('can set custom properties', () => {
    // GIVEN
    const stack = new Stack();
    const fooFn = fooFunction(stack, 'Fn');

    // WHEN
    new WebSocketApi(stack, 'Api', {
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          'Integration',
          fooFn,
          {
            timeout: Duration.seconds(10),
            contentHandling: ContentHandling.CONVERT_TO_TEXT,
          },
        ),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS_PROXY',
      IntegrationUri,
      TimeoutInMillis: 10000,
      ContentHandlingStrategy: 'CONVERT_TO_TEXT',
    });
  });
});

function fooFunction(stack: Stack, id: string) {
  return new Function(stack, id, {
    code: Code.fromInline('foo'),
    runtime: lambda.Runtime.NODEJS_LATEST,
    handler: 'index.handler',
  });
}
