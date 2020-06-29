import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

// tslint:disable:max-line-length

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ApiagtewayV2HttpApi');

const webSocketHandler = new lambda.Function(stack, 'MyFunc', {
  runtime: lambda.Runtime.PYTHON_3_7,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
import json
def handler(event, context):
      return {
        'status': 'ok',
        'message': 'success'
      }`),
});

// create a Web Socket API
const api = new apigatewayv2.WebSocketApi(stack, 'WebSocketApi', {
  routeSelectionExpression: '${request.body.action}',
  deployOptions: {
    stageName: 'integration',
  },
});

const defaultStatusIntegrationResponse: apigatewayv2.WebSocketIntegrationResponseOptions = {
  responseTemplates: {
    default: '#set($inputRoot = $input.path(\'$\')) { "status": "${inputRoot.status}", "message": "$util.escapeJavaScript(${inputRoot.message})" }',
  },
  templateSelectionExpression: 'default',
};

const defaultStatusRouteResponse: apigatewayv2.WebSocketRouteResponseOptions = {
  modelSelectionExpression: 'default',
  responseModels: {
    default: api.addModel({ schema: apigatewayv2.JsonSchemaVersion.DRAFT4, title: 'statusResponse', type: apigatewayv2.JsonSchemaType.OBJECT, properties: { status: { type: apigatewayv2.JsonSchemaType.STRING }, message: { type: apigatewayv2.JsonSchemaType.STRING } } }),
  },
};

const webSocketConnectIntegration = api.addLambdaIntegration('default', {
  handler: webSocketHandler,
  proxy: false,
  passthroughBehavior: apigatewayv2.WebSocketPassthroughBehavior.NEVER,
  requestTemplates: {
    connect: '{ "action": "${context.routeKey}", "userId": "${context.identity.cognitoIdentityId}", "connectionId": "${context.connectionId}", "domainName": "${context.domainName}", "stageName": "${context.stage}" }',
  },
  templateSelectionExpression: 'connect',
  description: 'WebSocket Api Connection Integration',
});
webSocketConnectIntegration.addResponse(apigatewayv2.WebSocketKnownRouteResponseKey.DEFAULT, defaultStatusIntegrationResponse);

api.addRoute(apigatewayv2.WebSocketKnownRouteKey.CONNECT, webSocketConnectIntegration, {
  authorizationType: apigatewayv2.WebSocketAuthorizationType.IAM,
  routeResponseSelectionExpression: apigatewayv2.WebSocketKnownRouteResponseKey.DEFAULT,
}).addResponse(apigatewayv2.WebSocketKnownRouteResponseKey.DEFAULT, defaultStatusRouteResponse);
