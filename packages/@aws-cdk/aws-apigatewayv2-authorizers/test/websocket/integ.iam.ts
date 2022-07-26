import { Template } from '@aws-cdk/assertions';
import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { WebSocketIamAuthorizer } from '../../lib';

describe('WebSocketLambdaAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    const handler = new Function(stack, 'auth-function', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });
    const integration = new WebSocketLambdaIntegration('Integration', handler);

    const authorizer = new WebSocketIamAuthorizer();

    // WHEN
    new WebSocketApi(stack, 'WebSocketApi', {
      connectRouteOptions: {
        integration,
        authorizer,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::ApiGatewayV2::Authorizer',
      {
        Name: 'default-authorizer',
        AuthorizerType: 'REQUEST',
        IdentitySource: ['route.request.header.Authorization'],
      },
    );

    Template.fromStack(stack).hasResourceProperties(
      'AWS::ApiGatewayV2::Route',
      {
        AuthorizationType: 'CUSTOM',
      },
    );
  });
});
