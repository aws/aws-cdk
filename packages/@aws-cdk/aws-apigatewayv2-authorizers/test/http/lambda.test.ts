import { Match, Template } from '@aws-cdk/assertions';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { DummyRouteIntegration } from './integration';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from '../../lib';

describe('HttpLambdaAuthorizer', () => {

  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-function', {
      runtime: Runtime.NODEJS_14_X,
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
      runtime: Runtime.NODEJS_14_X,
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
      runtime: Runtime.NODEJS_14_X,
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
      runtime: Runtime.NODEJS_14_X,
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
      runtime: Runtime.NODEJS_14_X,
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
});
