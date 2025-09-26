import { WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { WebSocketMockIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

/*
 * Stack verification steps:
 * 1. Verify that the new property 'disableExecuteApiEndpoint' is set to 'true', and that it is not callable.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-apigwv2-disable-execute-api-endpoint');

// API Gateway WebSocket API
const webSocketApi = new WebSocketApi(stack, 'webSocketApi', {
  description: 'Test stack for the disableExecuteApiEndpoint property.',
  disableExecuteApiEndpoint: true,
  defaultRouteOptions: { integration: new WebSocketMockIntegration('DefaultIntegration') },
});

// Optionally, create a WebSocket stage
new WebSocketStage(stack, 'DevStage', {
  webSocketApi: webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

new IntegTest(app, 'DisableExecuteApiEndpointPropIntegrationTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

app.synth();
