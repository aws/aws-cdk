import { App, Stack, StackProps } from '@aws-cdk/core';
import { Alarm, AlarmState, AndAlarmRule, BooleanAlarmRule, CompositeAlarm, Metric, NotAlarmRule, OrAlarmRule } from '../lib';

class CompositeAlarmIntegrationTest extends Stack {

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    const alarm1 = new Alarm(this, 'Alarm1', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    const alarm2 = new Alarm(this, 'Alarm2', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
    });

    const alarm3 = new Alarm(this, 'Alarm3', {
      metric: testMetric,
      threshold: 10000,
      evaluationPeriods: 3,
    });

    const alarm4 = new Alarm(this, 'Alarm4', {
      metric: testMetric,
      threshold: 100000,
      evaluationPeriods: 3,
    });

    const alarmRule = new OrAlarmRule(
      new AndAlarmRule(
        new OrAlarmRule(
          alarm1.toAlarmRule(AlarmState.ALARM),
          alarm2.toAlarmRule(AlarmState.OK),
          alarm3.toAlarmRule(AlarmState.ALARM),
        ),
        new NotAlarmRule(alarm4.toAlarmRule(AlarmState.INSUFFICIENT_DATA)),
      ),
      new BooleanAlarmRule(false),
    );

    new CompositeAlarm(this, 'CompositeAlarm', {
      alarmRule,
    });
  }

}

const app = new App();

new CompositeAlarmIntegrationTest(app, 'CompositeAlarmIntegrationTest');

app.synth();
