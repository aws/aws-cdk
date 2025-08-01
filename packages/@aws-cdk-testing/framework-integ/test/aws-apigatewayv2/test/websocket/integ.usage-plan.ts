import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { WebSocketApi, WebSocketStage, UsagePlan, ApiKey } from 'aws-cdk-lib/aws-apigatewayv2';
import { WebSocketMockIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websocket-usage-plan');

const webSocketApi = new WebSocketApi(stack, 'WebSocketApi');

webSocketApi.addRoute('$connect', {
  integration: new WebSocketMockIntegration('ConnectIntegration'),
});

webSocketApi.addRoute('sendMessage', {
  integration: new WebSocketMockIntegration('MessageIntegration'),
});

const webSocketStage = new WebSocketStage(stack, 'WebSocketStage', {
  webSocketApi,
  stageName: 'dev',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  detailedMetricsEnabled: true,
  description: 'My Stage',
});

const apiKey = new ApiKey(stack, 'ApiKey');

const usagePlan = new UsagePlan(stack, 'UsagePlan', {
  usagePlanName: 'WebSocketUsagePlan',
  apiStages: [{
    api: webSocketApi,
    stage: webSocketStage,
  }],
});

const webSocketStage2 = new WebSocketStage(stack, 'WebSocketStage2', {
  webSocketApi,
  stageName: 'dev2',
  throttle: {
    rateLimit: 1000,
    burstLimit: 1000,
  },
  detailedMetricsEnabled: true,
  description: 'My Stage 2',
});

usagePlan.addApiKey(apiKey);
usagePlan.addApiStage({ api: webSocketApi, stage: webSocketStage2 });

new integ.IntegTest(app, 'WebSocketUsagePlanInteg', {
  testCases: [stack],
});
