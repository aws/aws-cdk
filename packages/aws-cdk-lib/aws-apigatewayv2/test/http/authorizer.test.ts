import { Template } from '../../../assertions';
import { Role, ServicePrincipal } from '../../../aws-iam';
import { Stack } from '../../../core';
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

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
        JwtConfiguration: {
          Audience: ['audience.1', 'audience.2'],
          Issuer: 'issuer',
        },
      });
    });
  });

  describe('lambda', () => {
    it('default', () => {
      const stack = new Stack();
      const httpApi = new HttpApi(stack, 'HttpApi');

      new HttpAuthorizer(stack, 'HttpAuthorizer', {
        httpApi,
        identitySource: ['identitysource.1', 'identitysource.2'],
        type: HttpAuthorizerType.LAMBDA,
        authorizerUri: 'arn:cool-lambda-arn',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
        AuthorizerType: 'REQUEST',
        AuthorizerPayloadFormatVersion: '2.0',
        AuthorizerUri: 'arn:cool-lambda-arn',
      });
    });
  });

  describe('role', () => {
    test('should throw error if role is provided for JWT authorizer', () => {
      // GIVEN
      const stack = new Stack();
      const api = new HttpApi(stack, 'HttpApi');

      // THEN
      expect(() => new HttpAuthorizer(stack, 'HttpAuthorizer', {
        httpApi: api,
        identitySource: ['$request.header.Authorization'],
        type: HttpAuthorizerType.JWT,
        jwtAudience: ['3131231'],
        jwtIssuer: 'https://test.us.auth0.com',
        role: new Role(stack, 'Role', { assumedBy: new ServicePrincipal('apigateway.amazonaws.com') }),
      })).toThrow(/role is supported only for Lambda authorizers/);
    });

    test('should throw error if role is provided for IAM authorizer', () => {
      // GIVEN
      const stack = new Stack();
      const api = new HttpApi(stack, 'HttpApi');

      // THEN
      expect(() => new HttpAuthorizer(stack, 'HttpAuthorizer', {
        httpApi: api,
        identitySource: ['$request.header.Authorization'],
        type: HttpAuthorizerType.IAM,
        role: new Role(stack, 'Role', { assumedBy: new ServicePrincipal('apigateway.amazonaws.com') }),
      })).toThrow(/role is supported only for Lambda authorizers/);
    });
  });
});
