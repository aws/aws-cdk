import { WebSocketLambdaIntegration } from './../../../aws-apigatewayv2-integrations/lib/websocket/lambda';
import { WebSocketIamAuthorizer } from './../../lib/websocket/iam';
import { Template } from '../../../assertions';
import { WebSocketApi } from '../../../aws-apigatewayv2';
import { Code, Function } from '../../../aws-lambda';
import * as lambda from '../../../aws-lambda';
import { Stack } from '../../../core';

describe('WebSocketLambdaAuthorizer', () => {
  test('default', () => {
    const stack = new Stack();

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
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
