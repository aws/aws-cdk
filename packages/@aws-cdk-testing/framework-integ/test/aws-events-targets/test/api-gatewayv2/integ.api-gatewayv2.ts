import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as events from 'aws-cdk-lib/aws-events';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-events-targets-api-gatewayv2-integ');

const httpApi = new apigwv2.HttpApi(stack, 'HttpApi');

const rule = new events.Rule(stack, 'Rule', {
  schedule: events.Schedule.rate(Duration.minutes(1)),
});

rule.addTarget(new targets.ApiGatewayV2(httpApi));

const integTest = new IntegTest(app, 'ApiGatewayTarget', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('EventBridge', 'listTargetsByRule', {
  Rule: rule.ruleName,
  EventBusName: 'default',
  Limit: 1,
}).expect(ExpectedResult.objectLike({
  Targets: [
    {
      HttpParameters: {},
    },
  ],
}));
