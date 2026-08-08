import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Alarm, AlarmMuteRule, AlarmRule, CompositeAlarm, Metric, MuteSchedule } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'AlarmMuteRuleIntegrationTest');

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

const alarm1 = new Alarm(stack, 'Alarm1', {
  metric: testMetric,
  threshold: 100,
  evaluationPeriods: 3,
});

const alarm2 = new Alarm(stack, 'Alarm2', {
  metric: testMetric,
  threshold: 200,
  evaluationPeriods: 3,
});

const compositeAlarm = new CompositeAlarm(stack, 'CompositeAlarm', {
  alarmRule: AlarmRule.anyOf(alarm1, alarm2),
});

// Recurring mute rule with cron schedule targeting multiple alarms
new AlarmMuteRule(stack, 'RecurringMuteRule', {
  alarmMuteRuleName: 'RecurringMuteRule',
  description: 'Mute alarms during daily maintenance window',
  schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
  duration: Duration.hours(1),
  timezone: 'UTC',
  alarms: [alarm1, alarm2],
});

// One-time mute rule with at() schedule
new AlarmMuteRule(stack, 'OneTimeMuteRule', {
  alarmMuteRuleName: 'OneTimeMuteRule',
  schedule: MuteSchedule.at({ year: 2026, month: 12, day: 15, hour: 3, minute: 30 }),
  duration: Duration.minutes(90),
  alarms: [alarm1],
});

// Mute rule with startDate, expireDate, and addAlarm()
const muteRuleWithDates = new AlarmMuteRule(stack, 'MuteRuleWithDates', {
  alarmMuteRuleName: 'MuteRuleWithDates',
  schedule: MuteSchedule.cron({ hour: '4', minute: '0', weekDay: 'SAT' }),
  duration: Duration.hours(2),
  startDate: { year: 2026, month: 1, day: 1, hour: 0, minute: 0 },
  expireDate: { year: 2027, month: 12, day: 31, hour: 23, minute: 59 },
});
muteRuleWithDates.addAlarm(compositeAlarm);

new IntegTest(app, 'cdk-integ-alarm-mute-rule', {
  testCases: [stack],
});
