import { expect, haveResource } from '@aws-cdk/assert';
import { Construct, Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import {Alarm, Expression, IAlarm, IAlarmAction, Metric} from '../lib';

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

const testExpression = new Expression({
  id: 'e1',
  expression: 'SUM(METRICS())'
});

export = {
  'can make simple alarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 3,
      MetricName: "Metric",
      Namespace: "CDK/Test",
      Period: 300,
      Statistic: 'Average',
      Threshold: 1000,
    }));

    test.done();
  },

  'override metric period in Alarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      period: Duration.minutes(10),
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 3,
      MetricName: "Metric",
      Namespace: "CDK/Test",
      Period: 600,
      Statistic: 'Average',
      Threshold: 1000,
    }));

    test.done();
  },

  'override statistic Alarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      statistic: 'max',
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 3,
      MetricName: "Metric",
      Namespace: "CDK/Test",
      Period: 300,
      Statistic: 'Maximum',
      Threshold: 1000,
    }));

    test.done();
  },

  'can use percentile in Alarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      statistic: 'P99',
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 3,
      MetricName: "Metric",
      Namespace: "CDK/Test",
      Period: 300,
      ExtendedStatistic: 'p99',
      Threshold: 1000,
    }));

    test.done();
  },

  'can set DatapointsToAlarm'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: "GreaterThanOrEqualToThreshold",
      EvaluationPeriods: 3,
      DatapointsToAlarm: 2,
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

    alarm.addAlarmAction(new TestAlarmAction('A'));
    alarm.addInsufficientDataAction(new TestAlarmAction('B'));
    alarm.addOkAction(new TestAlarmAction('C'));

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
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 2,
      statistic: 'min',
      period: Duration.seconds(10)
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
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 2,
      statistic: 'p99.9'
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      ExtendedStatistic: 'p99.9',
    }));

    test.done();
  },

  'can create an alarm with a metric and an expression'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const metricDataQueryList = [testMetric, testExpression].map(ts => ts.toAlarmTimeSeries());

    // WHEN
    new Alarm(stack, 'Alarm', {
      alarmTimeSeries: metricDataQueryList,
      threshold: 1000,
      evaluationPeriods: 2
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: "metric",
          MetricStat: {
            Metric: {
              Dimensions: [],
              MetricName: "Metric",
              Namespace: "CDK/Test"
            },
            Period: 300,
            Stat: "Average"
          }
        },
        {
          Expression: "SUM(METRICS())",
          Id: "e1"
        }
      ]
    }));

    test.done();
  }
};

class TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {
  }

  public bind(_scope: Construct, _alarm: IAlarm) {
    return { alarmActionArn: this.arn };
  }
}
