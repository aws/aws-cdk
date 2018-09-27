import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Alarm, IAlarmAction, Metric } from '../lib';

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

export = {
  'can make simple alarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 2
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 2,
      MetricName: "Metric",
      Namespace: "CDK/Test",
      Period: 300,
      Statistic: 'Average',
      Threshold: 1000,
    }));

    test.done();
  },

  'can add actions to alarms'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 2
    });

    alarm.onAlarm(new TestAlarmAction('A'));
    alarm.onInsufficientData(new TestAlarmAction('B'));
    alarm.onOk(new TestAlarmAction('C'));

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      AlarmActions: ['A'],
      InsufficientDataActions: ['B'],
      OKActions: ['C'],
    }));

    test.done();
  },

  'can make alarm directly from metric'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.newAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
      statistic: 'min',
      periodSec: 10,
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 2,
      MetricName: "Metric",
      Namespace: "CDK/Test",
      Period: 10,
      Statistic: 'Minimum',
      Threshold: 1000,
    }));

    test.done();
  },

  'can use percentile string to make alarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.newAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
      statistic: 'p99.9'
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ExtendedStatistic: 'p99.9',
    }));

    test.done();
  }
};

class TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {
  }

  public get alarmActionArn(): string {
    return this.arn;
  }
}
