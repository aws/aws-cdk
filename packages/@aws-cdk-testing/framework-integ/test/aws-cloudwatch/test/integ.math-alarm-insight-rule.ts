import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Alarm, CfnInsightRule, MathExpression, Metric } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'MathAlarmInsightRuleIntegStack');

const rule = new CfnInsightRule(stack, 'InsightRule', {
  ruleName: 'cdk-integ-math-alarm-insight-rule',
  ruleState: 'ENABLED',
  ruleBody: JSON.stringify({
    Schema: { Name: 'CloudWatchLogRule', Version: 1 },
    LogGroupNames: ['/aws/lambda/*'],
    LogFormat: 'JSON',
    Contribution: { Keys: ['$.requestId'] },
    AggregateOn: 'Count',
  }),
});

// INSIGHT_RULE_METRIC combined with a submetric must still render the expression's Period
new Alarm(stack, 'Alarm', {
  threshold: 1,
  evaluationPeriods: 1,
  metric: new MathExpression({
    period: Duration.minutes(1),
    expression: `INSIGHT_RULE_METRIC("${rule.attrRuleName}", "MaxContributorValue") / m1`,
    usingMetrics: {
      m1: new Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Invocations',
        statistic: 'Sum',
      }),
    },
  }),
});

new IntegTest(app, 'cdk-cloudwatch-math-alarm-insight-rule-integ', {
  testCases: [stack],
});
