import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { WebSocketMockIntegration } from '../../lib';

/*
 * Stack verification steps:
 * 1. Verify manually that the integration has type "MOCK"
 */

const app = new App();
const stack = new Stack(app, 'integ-mock-websocket-integration');

const webSocketApi = new WebSocketApi(stack, 'mywsapi', {
  defaultRouteOptions: { integration: new WebSocketMockIntegration('DefaultIntegration') },
});
const stage = new WebSocketStage(stack, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

webSocketApi.addRoute('sendmessage', { integration: new WebSocketMockIntegration('SendMessageIntegration') });

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });
