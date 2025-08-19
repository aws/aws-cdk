import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { WebSocketApi, WebSocketStage, UsagePlan, ApiKey, RateLimitedApiKey, Period } from 'aws-cdk-lib/aws-apigatewayv2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-aws-apigatewayv2-websocket-usage-plan');

const webSocketApi = new WebSocketApi(stack, 'WebSocketApi');

const webSocketStage = new WebSocketStage(stack, 'WebSocketStage', {
  webSocketApi,
  stageName: 'dev',
});

const apiKey = new ApiKey(stack, 'ApiKey', {
  apiKeyName: 'my-api-key',
  value: 'MyApiKeyThatIsAtLeast20Characters',
  description: 'Basic api-key',
  customerId: 'my-customer',
  enabled: true,
  generateDistinctId: true,
});

const usagePlan = new UsagePlan(stack, 'UsagePlan', {
  apiStages: [{
    api: webSocketApi,
    stage: webSocketStage,
  }],
  description: 'Basic usage plan',
  quota: {
    limit: 10000,
    offset: 1,
    period: Period.MONTH,
  },
  throttle: {
    rateLimit: 100,
    burstLimit: 200,
  },
  usagePlanName: 'WebSocketUsagePlan',
});

const webSocketStage2 = new WebSocketStage(stack, 'WebSocketStage2', {
  webSocketApi,
  stageName: 'dev2',
});

usagePlan.addApiKey(apiKey);
usagePlan.addApiStage({ api: webSocketApi, stage: webSocketStage2 });

const webSocketStage3 = new WebSocketStage(stack, 'WebSocketStage3', {
  webSocketApi,
  stageName: 'dev3',
});

new RateLimitedApiKey(stack, 'RateLimitedApiKey', {
  apiKeyName: 'my-rate-limited-api-key',
  value: 'MyRateLimitedApiKeyThatIsAtLeast20Characters',
  description: 'Basic rate-limited-api-key',
  customerId: 'my-customer',
  enabled: true,
  generateDistinctId: true,
  apiStages: [{
    api: webSocketApi,
    stage: webSocketStage3,
  }],
  quota: {
    limit: 10000,
    offset: 1,
    period: Period.MONTH,
  },
  throttle: {
    rateLimit: 100,
    burstLimit: 200,
  },
});

new integ.IntegTest(app, 'WebSocketUsagePlanInteg', {
  testCases: [stack],
});
