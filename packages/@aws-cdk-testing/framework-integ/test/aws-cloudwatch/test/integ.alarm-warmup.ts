import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-cloudwatch-alarm-warmup');

cdk.Validations.of(stack).acknowledge({
  id: 'CloudFormation-Validate::F3002',
  reason: 'WarmUpConfiguration is a newly launched property not yet in the bundled schema',
});

new cloudwatch.Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
}).createAlarm(stack, 'Alarm', {
  threshold: 100,
  evaluationPeriods: 3,
  warmupConfiguration: {
    warmupPeriod: cdk.Duration.minutes(5),
    onlyStartEvaluatingAfterWarmupPeriodEnds: true,
  },
});

new IntegTest(app, 'AlarmWarmupIntegTest', {
  testCases: [stack],
});
