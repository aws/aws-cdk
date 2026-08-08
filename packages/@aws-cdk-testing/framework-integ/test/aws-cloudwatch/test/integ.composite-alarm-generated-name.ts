import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CLOUDWATCH_COMPOSITE_ALARM_GENERATED_NAME } from 'aws-cdk-lib/cx-api';
import { Alarm, AlarmRule, AlarmState, CompositeAlarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';

// With the feature flag enabled and no explicit name, the CompositeAlarm omits the
// `AlarmName` property and lets CloudFormation generate a unique name. This avoids the
// name collision that occurs when the same template is deployed more than once into the
// same account and region.
const app = new App({
  context: {
    [CLOUDWATCH_COMPOSITE_ALARM_GENERATED_NAME]: true,
  },
});

const stack = new Stack(app, 'CompositeAlarmGeneratedNameStack');

const alarm = new Alarm(stack, 'Alarm', {
  metric: new Metric({ namespace: 'CDK/Test', metricName: 'Metric' }),
  threshold: 100,
  evaluationPeriods: 3,
});

new CompositeAlarm(stack, 'CompositeAlarm', {
  alarmRule: AlarmRule.fromAlarm(alarm, AlarmState.ALARM),
});

new IntegTest(app, 'cdk-integ-composite-alarm-generated-name', {
  testCases: [stack],
});
