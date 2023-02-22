import { Template } from '@aws-cdk/assertions';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Stack } from '@aws-cdk/core';
import { DummyRouteIntegration } from './integration';
import { HttpJwtAuthorizer } from '../../lib';

describe('HttpJwtAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const authorizer = new HttpJwtAuthorizer('BooksAuthorizer', 'https://test.us.auth0.com', {
      jwtAudience: ['3131231'],
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
        Audience: ['3131231'],
        Issuer: 'https://test.us.auth0.com',
      },
      Name: 'BooksAuthorizer',
    });
  });

  test('same authorizer is used when bound to multiple routes', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const authorizer = new HttpJwtAuthorizer('BooksAuthorizer', 'https://test.us.auth0.com', {
      jwtAudience: ['3131231'],
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
});
