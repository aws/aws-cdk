import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../../lib';

// tslint:disable:max-line-length

test('route', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', `arn:aws:lambda:${stack.region}:${stack.account}:function:my-function`),
  });
  api.addRoute(apigw.WebSocketKnownRouteKey.CONNECT, integration, {
    modelSelectionExpression: apigw.WebSocketKnownModelKey.DEFAULT,
    requestModels: {
      [apigw.WebSocketKnownModelKey.DEFAULT]: api.addModel({ schema: apigw.JsonSchemaVersion.DRAFT4, title: 'statusInputModel', type: apigw.JsonSchemaType.OBJECT, properties: { action: { type: apigw.JsonSchemaType.STRING } } }),
    },
    routeResponseSelectionExpression: apigw.WebSocketKnownRouteResponseKey.DEFAULT,
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Route', {
    ApiId: { Ref: 'myapi4C7BF186' },
    RouteKey: '$connect',
    Target: { 'Fn::Join': ['', [ 'integrations/', { Ref: 'myapimyFunctionlambdaintegrationB6693307' } ] ] },
    ModelSelectionExpression: '$default',
    RequestModels: {
      $default: 'statusInputModel',
    },
  }));

  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Model', {
    ApiId: { Ref: 'myapi4C7BF186' },
    ContentType: apigw.WebSocketKnownContentTypes.JSON,
    Name: 'statusInputModel',
  }));
});

test('route response', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.WebSocketApi(stack, 'my-api', {
    routeSelectionExpression: apigw.WebSocketKnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false,
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', `arn:aws:lambda:${stack.region}:${stack.account}:function:my-function`),
  });
  const route = api.addRoute(apigw.WebSocketKnownRouteKey.CONNECT, integration, {});
  route.addResponse(apigw.WebSocketKnownRouteKey.CONNECT, {
    modelSelectionExpression: apigw.WebSocketKnownModelKey.DEFAULT,
    responseModels: {
      [apigw.WebSocketKnownModelKey.DEFAULT]: api.addModel({ schema: apigw.JsonSchemaVersion.DRAFT4, title: 'statusResponse', type: apigw.JsonSchemaType.NUMBER, properties: { status: { type: apigw.JsonSchemaType.STRING }, message: { type: apigw.JsonSchemaType.STRING } } }),
    },
  });

  // THEN
  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::RouteResponse', {
    ApiId: { Ref: 'myapi4C7BF186' },
    RouteId: { Ref: 'myapiconnectrouteC62A8B0B' },
    RouteResponseKey: '$connect',
    ModelSelectionExpression: '$default',
    ResponseModels: {
      $default: 'statusResponse',
    },
  }));

  cdkExpect(stack).to(haveResource('AWS::ApiGatewayV2::Model', {
    ApiId: { Ref: 'myapi4C7BF186' },
    ContentType: 'application/json',
    Name: 'statusResponse',
  }));
});