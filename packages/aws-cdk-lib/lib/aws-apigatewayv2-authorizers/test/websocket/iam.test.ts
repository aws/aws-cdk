import { Template } from '../../../assertions';
import { WebSocketApi } from '../../../aws-apigatewayv2';
import { WebSocketLambdaIntegration } from '../../../aws-apigatewayv2-integrations';
import { Code, Function, Runtime } from '../../../aws-lambda';
import { Stack } from '../../../core';
import { WebSocketIamAuthorizer } from '../../lib';

describe('WebSocketLambdaAuthorizer', () => {
  test('default', () => {
    const stack = new Stack();

    const handler = new Function(stack, 'auth-function', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });
    const integration = new WebSocketLambdaIntegration('Integration', handler);

    const authorizer = new WebSocketIamAuthorizer();

    new WebSocketApi(stack, 'WebSocketApi', {
      connectRouteOptions: {
        integration,
        authorizer,
      },
    });

    Template.fromStack(stack).hasResourceProperties(
      'AWS::ApiGatewayV2::Route',
      {
        RouteKey: '$connect',
        AuthorizationType: 'AWS_IAM',
      },
    );
  });
});
