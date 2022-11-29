import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as cloudwatch from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'InsightRuleIntegrationTestStack');

const insightRule = new cloudwatch.InsightRule(stack, 'InsightRule', {
  insightRuleName: 'myInsightRule',
  keys: ['$.myKey'],
  logGroupNames: ['myLogGroup'],
});

new cdk.CfnOutput(stack, 'InsightRuleArn', {
  value: insightRule.insightRuleArn,
});

new integ.IntegTest(app, 'InsightRuleIntegrationTest', {
  testCases: [stack],
});

app.synth();