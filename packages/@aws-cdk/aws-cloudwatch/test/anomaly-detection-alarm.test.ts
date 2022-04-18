import { Match, Template, Annotations } from '@aws-cdk/assertions';
import { Duration, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AnomalyDetectionAlarm, IAlarm, IAlarmAction, Metric, MathExpression, IMetric } from '../lib';

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

describe('AnomalyDetectionAlarm', () => {
  test('alarm does not accept a math expression with more than 9 metrics', () => {
    const stack = new Stack();

    const usingMetrics: Record<string, IMetric> = {};

    for (const i of [...Array(10).keys()]) {
      const metricName = `metric${i}`;
      usingMetrics[metricName] = new Metric({
        namespace: 'CDK/Test',
        metricName: metricName,
      });
    }

    const math = new MathExpression({
      expression: 'a',
      usingMetrics,
    });

    expect(() => {
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric: math,
        threshold: 2,
        evaluationPeriods: 3,
      });
    }).toThrow(/Anomaly Detection Alarms on math expressions cannot contain more than 9 individual metrics/);
  });

  test('non ec2 instance related alarm does not accept EC2 action', () => {
    const stack = new Stack();
    const alarm = new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 2,
      evaluationPeriods: 2,
    });

    expect(() => {
      alarm.addAlarmAction(new Ec2TestAlarmAction('arn:aws:automate:us-east-1:ec2:reboot'));
    }).toThrow(/EC2 alarm actions requires an EC2 Per-Instance Metric. \(.+ does not have an 'InstanceId' dimension\)/);
  });

  test('can make simple alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 2,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'Average',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 3,
      ThresholdMetricId: 'ad1',
    });
  });

  test('can target MathExpression in alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: new MathExpression({
        expression: 'testMetric / 60',
        usingMetrics: {
          testMetric,
        },
      }),

      threshold: 2,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'expr_2',
          Expression: 'testMetric / 60',
          ReturnData: true,
        },
        {
          Id: 'testMetric',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'Average',
          },
          ReturnData: false,
        },
        {
          Id: 'expr_1',
          Expression: 'ANOMALY_DETECTION_BAND(expr_2, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 3,
      ThresholdMetricId: 'expr_1',
    });
  });

  test('override metric period in Alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric.with({ period: Duration.minutes(10) }),
      threshold: 2,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 600,
            Stat: 'Average',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 3,
      ThresholdMetricId: 'ad1',
    });
  });

  test('override statistic', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric.with({ statistic: 'max' }),
      threshold: 2,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'Maximum',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],
    });
  });

  test('can use percentile', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric.with({ statistic: 'P99' }),
      threshold: 2,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'p99',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 3,
      ThresholdMetricId: 'ad1',
    });
  });

  test('can set DatapointsToAlarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 2,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'Average',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 3,
      DatapointsToAlarm: 2,
      ThresholdMetricId: 'ad1',
    });
  });

  test('can add actions to alarms', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 2,
      evaluationPeriods: 2,
    });

    alarm.addAlarmAction(new TestAlarmAction('A'));
    alarm.addInsufficientDataAction(new TestAlarmAction('B'));
    alarm.addOkAction(new TestAlarmAction('C'));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmActions: ['A'],
      InsufficientDataActions: ['B'],
      OKActions: ['C'],
    });
  });

  test('can make alarm directly from metric', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: 'min',
      period: Duration.seconds(10),
    }).createAnomalyDetectionAlarm(stack, 'Alarm', {
      threshold: 2,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 10,
            Stat: 'Minimum',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 2,
      ThresholdMetricId: 'ad1',
    });
  });

  test('can use percentile string to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: 'p99.9',
    }).createAnomalyDetectionAlarm(stack, 'Alarm', {
      threshold: 2,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'p99.9',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 2,
      ThresholdMetricId: 'ad1',
    });
  });

  test('can use a generic string for extended statistic to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: 'tm99.9999999999',
    }).createAnomalyDetectionAlarm(stack, 'Alarm', {
      threshold: 2,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Metrics: [
        {
          Id: 'm1',
          MetricStat: {
            Metric: {
              MetricName: 'Metric',
              Namespace: 'CDK/Test',
            },
            Period: 300,
            Stat: 'tm99.9999999999',
          },
        },
        {
          Id: 'ad1',
          Expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
          Label: 'Expected',
          ReturnData: true,
        },
      ],

      ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
      EvaluationPeriods: 2,
      ThresholdMetricId: 'ad1',
    });
  });

  test('metric warnings are added to Alarm', () => {
    const stack = new Stack(undefined, 'MyStack');
    const m = new MathExpression({ expression: 'oops' });

    // WHEN
    new AnomalyDetectionAlarm(stack, 'MyAlarm', {
      metric: m,
      evaluationPeriods: 1,
      threshold: 1,
    });

    // THEN
    const template = Annotations.fromStack(stack);
    template.hasWarning('/MyStack/MyAlarm', Match.stringLikeRegexp("Math expression 'oops' references unknown identifiers"));
  });

  test('cross account metrics are not allowed', () => {
    const stack = new Stack(undefined, undefined, {
      env: {
        account: 'a',
      },
    });

    expect(() => {
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric: testMetric.with({
          account: 'b',
        }),
        threshold: 2,
        evaluationPeriods: 3,
      });
    }).toThrow(/Cannot create an Anomaly Detection Alarm in account 'a' based on metric 'Metric' in 'b'/);
  });

  test('cross region metrics are not allowed', () => {
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'a',
      },
    });

    expect(() => {
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric: testMetric.with({
          region: 'b',
        }),
        threshold: 2,
        evaluationPeriods: 3,
      });
    }).toThrow(/Cannot create an Anomaly Detection Alarm in region 'a' based on metric 'Metric' in 'b'/);
  });


  test('cross account metric search is not allowed', () => {
    const stack = new Stack(undefined, undefined, {
      env: {
        account: 'a',
      },
    });

    expect(() => {
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric: new MathExpression({
          searchAccount: 'b',
          expression: '60',
        }),
        threshold: 2,
        evaluationPeriods: 3,
      });
    }).toThrow(/Cannot create an Anomaly Detection Alarm based on a MathExpression which specifies a searchAccount or searchRegion/);
  });

  test('cross region metric search is not allowed', () => {
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'a',
      },
    });

    expect(() => {
      new AnomalyDetectionAlarm(stack, 'Alarm', {
        metric: new MathExpression({
          searchRegion: 'b',
          expression: '60',
        }),
        threshold: 2,
        evaluationPeriods: 3,
      });
    }).toThrow(/Cannot create an Anomaly Detection Alarm based on a MathExpression which specifies a searchAccount or searchRegion/);
  });
});

class TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {
  }

  public bind(_scope: Construct, _alarm: IAlarm) {
    return { alarmActionArn: this.arn };
  }
}

class Ec2TestAlarmAction implements IAlarmAction {
  constructor(private readonly arn: string) {
  }

  public bind(_scope: Construct, _alarm: IAlarm) {
    return { alarmActionArn: this.arn };
  }
}
