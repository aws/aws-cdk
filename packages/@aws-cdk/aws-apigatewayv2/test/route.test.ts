import { expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

// tslint:disable:max-line-length

test('route', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    protocolType: apigw.ProtocolType.WEBSOCKET,
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', `arn:aws:lambda:${stack.region}:${stack.account}:function:my-function`),
  });
  integration.addRoute(apigw.KnownRouteKey.CONNECT, {
    modelSelectionExpression: apigw.KnownModelKey.DEFAULT,
    requestModels: {
      [apigw.KnownModelKey.DEFAULT]: api.addModel({ schema: apigw.JsonSchemaVersion.DRAFT4, title: "statusInputModel", type: apigw.JsonSchemaType.OBJECT, properties: { action: { type: apigw.JsonSchemaType.STRING } } })
    },
    routeResponseSelectionExpression: apigw.KnownRouteResponseKey.DEFAULT
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Route", {
    ApiId: { Ref: "myapi4C7BF186" },
    RouteKey: "$connect",
    Target: { "Fn::Join": ["", [ "integrations/", { Ref: "myapimyFunction27BC3796" } ] ] },
    ModelSelectionExpression: "$default",
    RequestModels: {
      $default: "statusInputModel"
    }
  }));

  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Model", {
    ApiId: { Ref: "myapi4C7BF186" },
    ContentType: apigw.KnownContentTypes.JSON,
    Name: "statusInputModel"
  }));
});

test('route (no model)', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    protocolType: apigw.ProtocolType.HTTP,
    deploy: false
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', `arn:aws:lambda:${stack.region}:${stack.account}:function:my-function`),
  });
  integration.addRoute('POST /');

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Route", {
    ApiId: { Ref: "myapi4C7BF186" },
    RouteKey: "POST /",
    Target: { "Fn::Join": ["", [ "integrations/", { Ref: "myapimyFunction27BC3796" } ] ] }
  }));
});

test('route response', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const api = new apigw.Api(stack, 'my-api', {
    protocolType: apigw.ProtocolType.WEBSOCKET,
    routeSelectionExpression: apigw.KnownRouteSelectionExpression.CONTEXT_ROUTE_KEY,
    deploy: false
  });
  const integration = api.addLambdaIntegration('myFunction', {
    handler: lambda.Function.fromFunctionArn(stack, 'handler', `arn:aws:lambda:${stack.region}:${stack.account}:function:my-function`)
  });
  const route = integration.addRoute(apigw.KnownRouteKey.CONNECT, {});
  route.addResponse(apigw.KnownRouteKey.CONNECT, {
    modelSelectionExpression: apigw.KnownModelKey.DEFAULT,
    responseModels: {
      [apigw.KnownModelKey.DEFAULT]: api.addModel({ schema: apigw.JsonSchemaVersion.DRAFT4, title: "statusResponse", type: apigw.JsonSchemaType.NUMBER, properties: { status: { type: apigw.JsonSchemaType.STRING }, message: { type: apigw.JsonSchemaType.STRING } } })
    }
  });

  // THEN
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::RouteResponse", {
    ApiId: { Ref: "myapi4C7BF186" },
    RouteId: { Ref: "myapimyFunctionRouteconnectA2AF3242" },
    RouteResponseKey: "$connect",
    ModelSelectionExpression: "$default",
    ResponseModels: {
      $default: "statusResponse"
    }
  }));

  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Model", {
    ApiId: { Ref: "myapi4C7BF186" },
    ContentType: apigw.KnownContentTypes.JSON,
    Name: "statusResponse"
  }));
});