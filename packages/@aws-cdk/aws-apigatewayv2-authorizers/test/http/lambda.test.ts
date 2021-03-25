import '@aws-cdk/assert/jest';
import { AuthorizerPayloadVersion, HttpApi, HttpIntegrationType, HttpRouteIntegrationBindOptions, IHttpRouteIntegration, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Duration, Stack } from '@aws-cdk/core';
import { HttpLambdaAuthorizer, HttpLambdaAuthorizerType } from '../../lib';

describe('HttpLambdaAuthorizer', () => {
  test('default simple', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-functon', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer({
      type: HttpLambdaAuthorizerType.SIMPLE,
      handler,
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      Name: 'LambdaAuthorizer',
      AuthorizerType: 'REQUEST',
      AuthorizerResultTtlInSeconds: 300,
      AuthorizerPayloadFormatVersion: '2.0',
      EnableSimpleResponses: true,
      IdentitySource: [
        '$request.header.Authorization',
      ],
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      AuthorizationType: 'CUSTOM',
    });
  });

  test('default iam', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-functon', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer({
      type: HttpLambdaAuthorizerType.AWS_IAM,
      handler,
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      Name: 'LambdaAuthorizer',
      AuthorizerType: 'REQUEST',
      AuthorizerResultTtlInSeconds: 300,
      AuthorizerPayloadFormatVersion: '2.0',
      EnableSimpleResponses: false,
      IdentitySource: [
        '$request.header.Authorization',
      ],
    });

    expect(stack).toHaveResource('AWS::ApiGatewayV2::Route', {
      AuthorizationType: 'CUSTOM',
    });
  });

  test('can override cache ttl', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-functon', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer({
      type: HttpLambdaAuthorizerType.SIMPLE,
      handler,
      resultsCacheTtl: Duration.minutes(10),
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerResultTtlInSeconds: 600,
    });
  });

  test('can override payload version', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const handler = new Function(stack, 'auth-functon', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    const authorizer = new HttpLambdaAuthorizer({
      type: HttpLambdaAuthorizerType.AWS_IAM,
      handler,
      payloadFormatVersion: AuthorizerPayloadVersion.VERSION_1_0,
    });

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ApiGatewayV2::Authorizer', {
      AuthorizerPayloadFormatVersion: '1.0',
    });
  });

  test('should throw error when using 1.0 with simple responses', () => {
    // GIVEN
    const stack = new Stack();

    const handler = new Function(stack, 'auth-functon', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromInline('exports.handler = () => {return true}'),
      handler: 'index.handler',
    });

    expect(() => new HttpLambdaAuthorizer({
      type: HttpLambdaAuthorizerType.SIMPLE,
      handler,
      payloadFormatVersion: AuthorizerPayloadVersion.VERSION_1_0,
    })).toThrow('The simple authorizer type can only be used with payloadFormatVersion 2.0');
  });
});

class DummyRouteIntegration implements IHttpRouteIntegration {
  public bind(_: HttpRouteIntegrationBindOptions) {
    return {
      payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
      type: HttpIntegrationType.HTTP_PROXY,
      uri: 'some-uri',
    };
  }
}
