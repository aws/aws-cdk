import '@aws-cdk/assert-internal/jest';
import { Stack } from '@aws-cdk/core';
import {
  HttpApi, HttpAuthorizer, HttpAuthorizerType,
} from '../../lib';

describe('HttpAuthorizer', () => {
  test('default', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    new HttpAuthorizer(stack, 'HttpAuthorizer', {
      httpApi,
      identitySource: ['identitysource.1', 'identitysource.2'],
      type: HttpAuthorizerType.JWT,
      jwtAudience: ['audience.1', 'audience.2'],
      jwtIssuer: 'issuer',
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      ApiId: stack.resolve(httpApi.apiId),
      Name: 'HttpAuthorizer',
      AuthorizerType: 'JWT',
      IdentitySource: ['identitysource.1', 'identitysource.2'],
    });
  });

  test('authorizer name', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    new HttpAuthorizer(stack, 'HttpAuthorizer', {
      httpApi,
      authorizerName: 'my-authorizer',
      identitySource: ['identitysource.1', 'identitysource.2'],
      type: HttpAuthorizerType.JWT,
      jwtAudience: ['audience.1', 'audience.2'],
      jwtIssuer: 'issuer',
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      Name: 'my-authorizer',
    });
  });

  describe('jwt configuration', () => {
    test('audience and issuer', () => {
      const stack = new Stack();
      const httpApi = new HttpApi(stack, 'HttpApi');

      new HttpAuthorizer(stack, 'HttpAuthorizer', {
        httpApi,
        identitySource: ['identitysource.1', 'identitysource.2'],
        type: HttpAuthorizerType.JWT,
        jwtAudience: ['audience.1', 'audience.2'],
        jwtIssuer: 'issuer',
      });

      expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
        JwtConfiguration: {
          Audience: ['audience.1', 'audience.2'],
          Issuer: 'issuer',
        },
      });
    });
  });
});
