import { Template } from '@aws-cdk/assertions';
import { HttpApi, HttpIntegrationType, HttpRouteIntegrationBindOptions, HttpRouteIntegration, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { UserPool } from '@aws-cdk/aws-cognito';
import { Stack } from '@aws-cdk/core';
import { HttpUserPoolAuthorizer } from '../../lib';

describe('HttpUserPoolAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const userPool = new UserPool(stack, 'UserPool');
    const userPoolClient = userPool.addClient('UserPoolClient');
    const authorizer = new HttpUserPoolAuthorizer({
      userPool,
      userPoolClients: [userPoolClient],
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerType: 'JWT',
      IdentitySource: ['$request.header.Authorization'],
      JwtConfiguration: {
        Audience: [stack.resolve(userPoolClient.userPoolClientId)],
        Issuer: {
          'Fn::Join': [
            '',
            [
              'https://cognito-idp.',
              { Ref: 'AWS::Region' },
              '.amazonaws.com/',
              stack.resolve(userPool.userPoolId),
            ],
          ],
        },
      },
    });
  });

  test('same authorizer is used when bound to multiple routes', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const userPool = new UserPool(stack, 'UserPool');
    const userPoolClient = userPool.addClient('UserPoolClient');
    const authorizer = new HttpUserPoolAuthorizer({
      userPool,
      userPoolClients: [userPoolClient],
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/pets',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Authorizer', 1);
  });

  test('multiple userPoolClients are attached', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const userPool = new UserPool(stack, 'UserPool');
    const userPoolClient1 = userPool.addClient('UserPoolClient1');
    const userPoolClient2 = userPool.addClient('UserPoolClient2');
    const authorizer = new HttpUserPoolAuthorizer({
      userPool,
      userPoolClients: [userPoolClient1, userPoolClient2],
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerType: 'JWT',
      IdentitySource: ['$request.header.Authorization'],
      JwtConfiguration: {
        Audience: [stack.resolve(userPoolClient1.userPoolClientId), stack.resolve(userPoolClient2.userPoolClientId)],
        Issuer: {
          'Fn::Join': [
            '',
            [
              'https://cognito-idp.',
              { Ref: 'AWS::Region' },
              '.amazonaws.com/',
              stack.resolve(userPool.userPoolId),
            ],
          ],
        },
      },
    });
  });
});

class DummyRouteIntegration extends HttpRouteIntegration {
  public bind(_: HttpRouteIntegrationBindOptions) {
    return {
      payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
      type: HttpIntegrationType.HTTP_PROXY,
      uri: 'some-uri',
    };
  }
}
