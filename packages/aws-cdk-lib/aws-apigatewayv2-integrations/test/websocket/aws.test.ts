import { Template } from '../../../assertions';
import { ContentHandling, PassthroughBehavior, WebSocketApi } from '../../../aws-apigatewayv2';
import * as iam from '../../../aws-iam';
import { Duration, Stack } from '../../../core';
import { WebSocketAwsIntegration } from './../../lib/websocket/aws';

describe('AwsWebSocketIntegration', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new WebSocketApi(stack, 'Api', {
      defaultRouteOptions: {
        integration: new WebSocketAwsIntegration('AwsIntegration', {
          integrationUri: 'arn:aws:apigateway:us-west-2:dynamodb:action/PutItem',
          integrationMethod: 'POST',
        }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS',
      IntegrationUri: 'arn:aws:apigateway:us-west-2:dynamodb:action/PutItem',
      IntegrationMethod: 'POST',
    });
  });

  test('can set custom properties', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });

    // WHEN
    new WebSocketApi(stack, 'Api', {
      defaultRouteOptions: {
        integration: new WebSocketAwsIntegration('AwsIntegration', {
          integrationUri: 'arn:aws:apigateway:us-west-2:dynamodb:action/PutItem',
          integrationMethod: 'POST',
          credentialsRole: role,
          requestParameters: {
            'integration.request.header.Content-Type': '\'application/x-www-form-urlencoded\'',
          },
          requestTemplates: { 'application/json': '{ "statusCode": 200 }' },
          templateSelectionExpression: '\\$default',
          passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
          contentHandling: ContentHandling.CONVERT_TO_BINARY,
          timeout: Duration.seconds(10),
        }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'AWS',
      IntegrationUri: 'arn:aws:apigateway:us-west-2:dynamodb:action/PutItem',
      IntegrationMethod: 'POST',
      CredentialsArn: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
      RequestParameters: {
        'integration.request.header.Content-Type': '\'application/x-www-form-urlencoded\'',
      },
      RequestTemplates: { 'application/json': '{ "statusCode": 200 }' },
      TemplateSelectionExpression: '\\$default',
      PassthroughBehavior: 'WHEN_NO_TEMPLATES',
      ContentHandlingStrategy: 'CONVERT_TO_BINARY',
      TimeoutInMillis: 10000,
    });
  });
});
