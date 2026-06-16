import { Match, Template } from '../../../assertions';
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

  test('reusing a single integration across multiple routes creates a permission for each route', () => {
    // GIVEN
    const stack = new Stack();
    const fooFn = fooFunction(stack, 'Fn');
    const integration = new WebSocketLambdaIntegration('Integration', fooFn);

    // WHEN - the same integration instance is shared across $connect, $disconnect and $default
    new WebSocketApi(stack, 'Api', {
      connectRouteOptions: { integration },
      disconnectRouteOptions: { integration },
      defaultRouteOptions: { integration },
    });

    // THEN - a single shared integration resource
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::ApiGatewayV2::Integration', 1);

    // THEN - one Lambda permission per route, each scoped to that route key
    template.resourceCountIs('AWS::Lambda::Permission', 3);
    for (const routeKey of ['$connect', '$disconnect', '$default']) {
      template.hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        Principal: 'apigateway.amazonaws.com',
        SourceArn: {
          'Fn::Join': ['', Match.arrayWith([`/*${routeKey}`])],
        },
      });
    }
  });

  test('reusing a single integration across constructor routes and addRoute creates a permission for each route', () => {
    // GIVEN
    const stack = new Stack();
    const fooFn = fooFunction(stack, 'Fn');
    const integration = new WebSocketLambdaIntegration('Integration', fooFn);

    // WHEN
    const api = new WebSocketApi(stack, 'Api', {
      connectRouteOptions: { integration },
    });
    api.addRoute('custom', { integration });

    // THEN - shared integration, one permission for $connect and one for the custom route
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::ApiGatewayV2::Integration', 1);
    template.resourceCountIs('AWS::Lambda::Permission', 2);
    for (const routeKey of ['$connect', 'custom']) {
      template.hasResourceProperties('AWS::Lambda::Permission', {
        SourceArn: {
          'Fn::Join': ['', Match.arrayWith([`/*${routeKey}`])],
        },
      });
    }
  });
});

function fooFunction(stack: Stack, id: string) {
  return new Function(stack, id, {
    code: Code.fromInline('foo'),
    runtime: lambda.Runtime.NODEJS_LATEST,
    handler: 'index.handler',
  });
}
