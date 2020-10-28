import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import {
  HttpApi, HttpJwtAuthorizer,
} from '../../lib';

describe('JwtAuthorizer', () => {
  test('default', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    new HttpJwtAuthorizer(stack, 'HttpAuthorizer', {
      httpApi,
      jwtConfiguration: {
        audience: ['cognito-pool'],
        issuer: 'http://congnito.aws',
      },
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      ApiId: stack.resolve(httpApi.httpApiId),
      Name: 'HttpAuthorizer',
      AuthorizerType: 'JWT',
      IdentitySource: ['$request.header.Authorization'],
      JwtConfiguration: {
        Audience: ['cognito-pool'],
        Issuer: 'http://congnito.aws',
      },
    });
  });

  test('can set authorizer name', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    new HttpJwtAuthorizer(stack, 'HttpAuthorizer', {
      httpApi,
      authorizerName: 'my-authorizer',
      jwtConfiguration: {
        audience: ['cognito-pool'],
        issuer: 'http://congnito.aws',
      },
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      Name: 'my-authorizer',
    });
  });
});
