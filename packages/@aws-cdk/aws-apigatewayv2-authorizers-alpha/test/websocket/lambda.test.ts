import { Template } from 'aws-cdk-lib/assertions';
import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { DEFAULT_UNITTEST_RUNTIME } from 'aws-cdk-lib/aws-lambda/lib/helpers-internal';
import { Stack } from 'aws-cdk-lib';
import { WebSocketLambdaAuthorizer } from '../../lib';

describe('WebSocketLambdaAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    const handler = new Function(stack, 'auth-function', {
      runtime: DEFAULT_UNITTEST_RUNTIME,
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
