import { HttpLambdaAuthorizer, HttpLambdaResponseType } from './../../lib/http/lambda';
import { DummyRouteIntegration } from './integration';
import { Match, Template } from '../../../assertions';
import { HttpApi } from '../../../aws-apigatewayv2';
import { Role, ServicePrincipal } from '../../../aws-iam';
import { Code, Function } from '../../../aws-lambda';
import * as lambda from '../../../aws-lambda';
import { Duration, Stack } from '../../../core';

describe('HttpLambdaAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler);

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      Name: 'BooksAuthorizer',
      AuthorizerType: 'REQUEST',
      AuthorizerResultTtlInSeconds: 300,
      AuthorizerPayloadFormatVersion: '1.0',
      IdentitySource: [
        '$request.header.Authorization',
      ],
      AuthorizerCredentialsArn: Match.absent(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      AuthorizationType: 'CUSTOM',
    });
  });

  test('should use format 2.0 and simple responses when simple response type is requested', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler, {
      responseTypes: [HttpLambdaResponseType.SIMPLE],
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerPayloadFormatVersion: '2.0',
      EnableSimpleResponses: true,
    });
  });

  test('should use format 1.0 when only IAM response type is requested', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler, {
      responseTypes: [HttpLambdaResponseType.IAM],
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerPayloadFormatVersion: '1.0',
      EnableSimpleResponses: Match.absent(),
    });
  });

  test('should use format 2.0 and simple responses when both response types are requested', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler, {
      responseTypes: [HttpLambdaResponseType.IAM, HttpLambdaResponseType.SIMPLE],
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerPayloadFormatVersion: '2.0',
      EnableSimpleResponses: true,
    });
  });

  test('can override cache ttl', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-functon', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler, {
      resultsCacheTtl: Duration.minutes(10),
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerResultTtlInSeconds: 600,
    });
  });

  test('should expose authorizer id after authorizer has been bound to route', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler);

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    expect(authorizer.authorizerId).toBeDefined();
  });

  test('should throw error when acessing authorizer before it been bound to route', () => {
    // GIVEN
    const stack = new Stack();

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const t = () => {
      const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler);
      void(authorizer.authorizerId);
    };

    // THEN
    expect(t).toThrow(Error);
  });

  test('should use role when role is provided', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');
    const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('apigateway.amazonaws.com') });

    const handler = new Function(stack, 'auth-function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer('BooksAuthorizer', handler, {
      responseTypes: [HttpLambdaResponseType.SIMPLE],
      role,
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerPayloadFormatVersion: '2.0',
      EnableSimpleResponses: true,
      AuthorizerCredentialsArn: {
        'Fn::GetAtt': [
          'Role1ABCC5F0',
          'Arn',
        ],
      },
    });
  });
});
