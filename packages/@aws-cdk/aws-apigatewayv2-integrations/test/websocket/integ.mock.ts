import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { MockWebSocketIntegration } from '../../lib';

/*
 * Stack verification steps:
 * 1. Connect: 'wscat -c <endpoint-in-the-stack-output>'. Should connect successfully and print event data containing connectionId in cloudwatch
 * 2. SendMessage: '> {"action": "sendmessage", "data": "some-data"}'. Should send the message successfully
 * 3. Default: '> {"data": "some-data"}'. Should send the message successfully
 * 4. Disconnect: disconnect from the wscat. Should disconnect successfully
 */

const app = new App();
const stack = new Stack(app, 'integ-mock-websocket-integration');

const webSocketApi = new WebSocketApi(stack, 'mywsapi', {
  connectRouteOptions: { integration: new MockWebSocketIntegration({ }) },
  disconnectRouteOptions: { integration: new MockWebSocketIntegration({ }) },
  defaultRouteOptions: { integration: new MockWebSocketIntegration({ }) },
});
const stage = new WebSocketStage(stack, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

webSocketApi.addRoute('sendmessage', { integration: new MockWebSocketIntegration({ }) });

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });
