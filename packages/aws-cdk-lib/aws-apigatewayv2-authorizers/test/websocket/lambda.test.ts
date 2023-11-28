import { Template } from '../../../assertions';
import { WebSocketApi } from '../../../aws-apigatewayv2';
import { WebSocketLambdaIntegration } from '../../../aws-apigatewayv2-integrations';
import { Code, Function } from '../../../aws-lambda';
import * as lambda from '../../../aws-lambda';
import { Stack } from '../../../core';
import { WebSocketLambdaAuthorizer } from './../../lib/websocket/lambda';

describe('WebSocketLambdaAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });
    const integration = new WebSocketLambdaIntegration(
      'Integration',
      handler,
    );

    const authorizer = new WebSocketLambdaAuthorizer('default-authorizer', handler);

    // WHEN
    new WebSocketApi(stack, 'WebSocketApi', {
      connectRouteOptions: {
        integration,
        authorizer,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      Name: 'default-authorizer',
      AuthorizerType: 'REQUEST',
      IdentitySource: [
        'route.request.header.Authorization',
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      AuthorizationType: 'CUSTOM',
    });
  });
});
