import { WebSocketApi } from '@aws-cdk/aws-apigatewayv2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { WebSocketMockIntegration } from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websockets');

const api = new WebSocketApi(stack, 'MyWebsocketApi');
api.addRoute('test', {
  integration: new WebSocketMockIntegration('SendMessageIntegration'),
  returnResponse: true,
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
