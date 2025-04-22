import { Construct } from 'constructs';
import { Match, Template, Annotations } from '../../assertions';
import { Ec2Action, Ec2InstanceAction } from '../../aws-cloudwatch-actions/lib';
import { Duration, Stack, App } from '../../core';
import { ENABLE_PARTITION_LITERALS } from '../../cx-api';
import { Alarm, IAlarm, IAlarmAction, Metric, MathExpression, IMetric, Stats, ComparisonOperator, CfnAlarm, TreatMissingData, THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION } from '../lib';

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

describe('Alarm', () => {
  test('alarm does not accept a math expression with more than 10 metrics', () => {
    const stack = new Stack();

    const usingMetrics: Record<string, IMetric> = {};

    for (const i of [...Array(15).keys()]) {
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
      new Alarm(stack, 'Alarm', {
        metric: math,
        threshold: 1000,
        evaluationPeriods: 3,
      });
    }).toThrow(/Alarms on math expressions cannot contain more than 10 individual metrics/);
  });

  test('non ec2 instance related alarm does not accept EC2 action', () => {
    const stack = new Stack();
    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 2,
    });

    expect(() => {
      alarm.addAlarmAction(new Ec2TestAlarmAction('arn:aws:automate:us-east-1:ec2:reboot'));
    }).toThrow(/EC2 alarm actions requires an EC2 Per-Instance Metric. \(.+ does not have an 'InstanceId' dimension\)/);
  });

  test('non ec2 instance related alarm does not accept EC2 action in other partitions', () => {
    const stack = new Stack();
    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 2,
    });

    expect(() => {
      alarm.addAlarmAction(new Ec2TestAlarmAction('arn:aws-us-gov:automate:us-east-1:ec2:reboot'));
    }).toThrow(/EC2 alarm actions requires an EC2 Per-Instance Metric. \(.+ does not have an 'InstanceId' dimension\)/);
    expect(() => {
      alarm.addAlarmAction(new Ec2TestAlarmAction('arn:aws-cn:automate:us-east-1:ec2:reboot'));
    }).toThrow(/EC2 alarm actions requires an EC2 Per-Instance Metric. \(.+ does not have an 'InstanceId' dimension\)/);
  });

  test('can make simple alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 3,
      MetricName: 'Metric',
      Namespace: 'CDK/Test',
      Period: 300,
      Statistic: 'Average',
      Threshold: 1000,
    });
  });

  test('override metric period in Alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric.with({ period: Duration.minutes(10) }),
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 3,
      MetricName: 'Metric',
      Namespace: 'CDK/Test',
      Period: 600,
      Statistic: 'Average',
      Threshold: 1000,
    });
  });

  test('override statistic Alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric.with({ statistic: 'max' }),
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 3,
      MetricName: 'Metric',
      Namespace: 'CDK/Test',
      Period: 300,
      Statistic: 'Maximum',
      ExtendedStatistic: Match.absent(),
      Threshold: 1000,
    });
  });

  test('can use percentile in Alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Alarm(stack, 'Alarm', {
      metric: testMetric.with({ statistic: 'P99' }),
      threshold: 1000,
      evaluationPeriods: 3,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 3,
      MetricName: 'Metric',
      Namespace: 'CDK/Test',
      Period: 300,
      Statistic: Match.absent(),
      ExtendedStatistic: 'p99',
      Threshold: 1000,
    });
  });

  test('can set DatapointsToAlarm', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 3,
      DatapointsToAlarm: 2,
      MetricName: 'Metric',
      Namespace: 'CDK/Test',
      Period: 300,
      Statistic: 'Average',
      Threshold: 1000,
    });
  });

  test('can add actions to alarms', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
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
    }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 2,
      MetricName: 'Metric',
      Namespace: 'CDK/Test',
      Period: 10,
      Statistic: 'Minimum',
      Threshold: 1000,
    });
  });

  test('EC2 alarm actions with InstanceId dimension', () => {
    // GIVEN
    const app = new App({ context: { [ENABLE_PARTITION_LITERALS]: true } });
    const stack = new Stack(app, 'EC2AlarmStack', { env: { region: 'us-west-2', account: '123456789012' } });

    // WHEN
    const metric = new Metric({
      namespace: 'CWAgent',
      metricName: 'disk_used_percent',
      dimensionsMap: {
        InstanceId: 'instance-id',
      },
      period: Duration.minutes(5),
      statistic: 'Average',
    });

    const sev3Alarm = new Alarm(stack, 'DISK_USED_PERCENT_SEV3', {
      alarmName: 'DISK_USED_PERCENT_SEV3',
      actionsEnabled: true,
      metric: metric,
      threshold: 1,
      evaluationPeriods: 1,
    });

    expect(() => {
      sev3Alarm.addAlarmAction(new Ec2Action(Ec2InstanceAction.REBOOT));
    }).not.toThrow();
  });

  test('EC2 alarm actions without InstanceId dimension', () => {
    // GIVEN
    const app = new App({ context: { [ENABLE_PARTITION_LITERALS]: true } });
    const stack = new Stack(app, 'EC2AlarmStack', { env: { region: 'us-west-2', account: '123456789012' } });

    // WHEN
    const metric = new Metric({
      namespace: 'CWAgent',
      metricName: 'disk_used_percent',
      dimensionsMap: {
        ImageId: 'image-id',
        InstanceType: 't2.micro',
      },
      period: Duration.minutes(5),
      statistic: 'Average',
    });

    const sev3Alarm = new Alarm(stack, 'DISK_USED_PERCENT_SEV3', {
      alarmName: 'DISK_USED_PERCENT_SEV3',
      actionsEnabled: true,
      metric: metric,
      threshold: 1,
      evaluationPeriods: 1,
    });

    expect(() => {
      sev3Alarm.addAlarmAction(new Ec2Action(Ec2InstanceAction.REBOOT));
    }).toThrow(/EC2 alarm actions requires an EC2 Per-Instance Metric/);
  });

  test('can use percentile string to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: 'p99.9',
    }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ExtendedStatistic: 'p99.9',
    });
  });

  test('can use a generic string for extended statistic to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: 'tm99.9999999999',
    }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Statistic: Match.absent(),
      ExtendedStatistic: 'tm99.9999999999',
    });
  });

  test('can use a generic pair string for extended statistic to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: 'TM(10%:90%)',
    }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Statistic: Match.absent(),
      ExtendedStatistic: 'TM(10%:90%)',
    });
  });

  test('can use stats class to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: Stats.p(99.9),
    }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ExtendedStatistic: 'p99.9',
    });
  });

  test('can use stats class pair to make alarm', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    testMetric.with({
      statistic: Stats.ts(10, 90),
    }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ExtendedStatistic: 'TS(10%:90%)',
    });
  });

  test('metric warnings are added to Alarm for unrecognized statistic', () => {
    const stack = new Stack(undefined, 'MyStack');
    const m = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
      statistic: 'invalid',
    });

    // WHEN
    new Alarm(stack, 'MyAlarm', {
      metric: m,
      evaluationPeriods: 1,
      threshold: 1,
    });

    // THEN
    const template = Annotations.fromStack(stack);
    template.hasWarning('/MyStack/MyAlarm', Match.stringLikeRegexp('Unrecognized statistic.*Preferably use the `aws_cloudwatch.Stats` helper class to specify a statistic'));
  });

  test('metric warnings are added to Alarm for math expressions', () => {
    const stack = new Stack(undefined, 'MyStack');
    const m = new MathExpression({ expression: 'oops' });

    // WHEN
    new Alarm(stack, 'MyAlarm', {
      metric: m,
      evaluationPeriods: 1,
      threshold: 1,
    });

    // THEN
    const template = Annotations.fromStack(stack);
    template.hasWarning('/MyStack/MyAlarm', Match.stringLikeRegexp("Math expression 'oops' references unknown identifiers"));
  });

  test('check alarm for p100 statistic', () => {
    const stack = new Stack(undefined, 'MyStack');
    new Alarm(stack, 'MyAlarm', {
      metric: new Metric({
        dimensionsMap: {
          Boop: 'boop',
        },
        metricName: 'MyMetric',
        namespace: 'MyNamespace',
        period: Duration.minutes(1),
        statistic: Stats.p(100),
      }),
      evaluationPeriods: 1,
      threshold: 1,
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ExtendedStatistic: 'p100',
    });
  });

  test('imported alarm arn and name generated correctly', () => {
    const stack = new Stack();

    const alarmFromArn = Alarm.fromAlarmArn(stack, 'AlarmFromArn', 'arn:aws:cloudwatch:us-west-2:123456789012:alarm:TestAlarmName');

    expect(alarmFromArn.alarmName).toEqual('TestAlarmName');
    expect(alarmFromArn.alarmArn).toMatch(/:alarm:TestAlarmName$/);

    const alarmFromName = Alarm.fromAlarmName(stack, 'AlarmFromName', 'TestAlarmName');

    expect(alarmFromName.alarmName).toEqual('TestAlarmName');
    expect(alarmFromName.alarmArn).toMatch(/:alarm:TestAlarmName$/);
  });
});

describe('Anomaly Detection Alarms', () => {
  describe('Creation Methods', () => {
    test('can create an anomaly detection alarm with default settings', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
      });

      // WHEN
      metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
        EvaluationPeriods: 3,
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: 'ANOMALY_DETECTION_BAND(m0, 2)',
            Id: 'expr_1',
            Label: 'Anomaly Detection Band',
            ReturnData: true,
          }),
          Match.objectLike({
            Id: 'm0',
            MetricStat: {
              Metric: {
                Namespace: 'AWS/EC2',
                MetricName: 'CPUUtilization',
              },
              Period: 300,
              Stat: 'Average',
            },
            ReturnData: true,
          }),
        ]),
      });
    });

    test('can create an anomaly detection alarm with custom settings', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
      });

      // WHEN
      metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
        stdDevs: 3,
        evaluationPeriods: 2,
        datapointsToAlarm: 2,
        comparisonOperator: ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
        treatMissingData: TreatMissingData.BREACHING,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'GreaterThanUpperThreshold',
        EvaluationPeriods: 2,
        DatapointsToAlarm: 2,
        ThresholdMetricId: 'expr_1',
        TreatMissingData: 'breaching',
        Metrics: Match.arrayWith([
          Match.objectLike({
            Expression: 'ANOMALY_DETECTION_BAND(m0, 3)',
            Id: 'expr_1',
            Label: 'Anomaly Detection Band',
            ReturnData: true,
          }),
          Match.objectLike({
            Id: 'm0',
            MetricStat: {
              Metric: {
                Namespace: 'AWS/EC2',
                MetricName: 'CPUUtilization',
              },
              Period: 300,
              Stat: 'Average',
            },
            ReturnData: true,
          }),
        ]),
      });
    });

    test('createAnomalyDetectionAlarm can create an alarm with correct properties based on a Metric', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });

      // WHEN
      const alarm = metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
        stdDevs: 1,
        evaluationPeriods: 3,
        datapointsToAlarm: 2,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      });

      // THEN
      const cfnAlarm = alarm.node.defaultChild as CfnAlarm;
      expect(cfnAlarm.comparisonOperator).toEqual('LessThanLowerOrGreaterThanUpperThreshold');
      expect(cfnAlarm.threshold).toBeUndefined();
      expect(cfnAlarm.thresholdMetricId).toEqual('expr_1');
      expect(cfnAlarm.metrics).toHaveLength(2);
      expect(cfnAlarm.metrics![0].returnData).toBeTruthy();
      expect(cfnAlarm.metrics![1].returnData).toBeTruthy();
      expect(cfnAlarm.metrics![0].expression).toEqual('ANOMALY_DETECTION_BAND(m0, 1)');
    });

    test('createAnomalyDetectionAlarm can create an alarm with correct properties based on a MathExpression', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new MathExpression({
        expression: 'm1 + 1',
        usingMetrics: { m1: new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' }) },
      });

      // WHEN
      const alarm = metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
        stdDevs: 10,
        evaluationPeriods: 3,
        datapointsToAlarm: 2,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      });

      // THEN
      const cfnAlarm = alarm.node.defaultChild as CfnAlarm;
      expect(cfnAlarm.comparisonOperator).toEqual('LessThanLowerOrGreaterThanUpperThreshold');
      expect(cfnAlarm.threshold).toBeUndefined();
      expect(cfnAlarm.thresholdMetricId).toEqual('expr_1');
      expect(cfnAlarm.metrics).toHaveLength(3);
      expect(cfnAlarm.metrics![0].returnData).toBeTruthy();
      expect(cfnAlarm.metrics![1].returnData).toBeTruthy();
      expect(cfnAlarm.metrics![0].expression).toEqual('ANOMALY_DETECTION_BAND(m0, 10)');
    });
    test('can create an anomaly detection alarm on a complex metric composition', () => {
      // GIVEN
      const stack = new Stack();
      const metric1 = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });
      const metric2 = new Metric({ namespace: 'AWS/EC2', metricName: 'NetworkIn' });
      const metric3 = new Metric({ namespace: 'AWS/EC2', metricName: 'NetworkOut' });

      const combinedMetric = new MathExpression({
        expression: 'm1 + m2 + m3',
        usingMetrics: {
          m1: metric1,
          m2: metric2,
          m3: metric3,
        },
      });

      // WHEN
      combinedMetric.createAnomalyDetectionAlarm(stack, 'Alarm', {
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
        ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
        EvaluationPeriods: 3,
        ThresholdMetricId: 'expr_1',
        Metrics: Match.arrayWith([
          // The anomaly detection band should have returnData: true
          Match.objectLike({
            Expression: Match.stringLikeRegexp('ANOMALY_DETECTION_BAND'),
            Id: 'expr_1',
            ReturnData: true,
          }),
          // The combined metric should have returnData: true
          Match.objectLike({
            Expression: 'm1 + m2 + m3',
            Id: 'm0',
            ReturnData: true,
          }),
          // The source metrics should not have returnData: true
          Match.objectLike({
            Id: 'm1',
            MetricStat: Match.objectLike({
              Metric: Match.objectLike({
                MetricName: 'CPUUtilization',
              }),
            }),
            ReturnData: false,
          }),
        ]),
      });
    });
  });

  describe('Operator Handling', () => {
    test('isAnomalyDetectionOperator returns correct values', () => {
      // GIVEN
      const anomalyOperators = [
        ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
        ComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
      ];
      const nonAnomalyOperators = [
        ComparisonOperator.GREATER_THAN_THRESHOLD,
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        ComparisonOperator.LESS_THAN_THRESHOLD,
        ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      ];

      // WHEN / THEN
      for (const operator of anomalyOperators) {
        expect(Alarm.isAnomalyDetectionOperator(operator)).toBeTruthy();
      }
      for (const operator of nonAnomalyOperators) {
        expect(Alarm.isAnomalyDetectionOperator(operator)).toBeFalsy();
      }
    });

    test('createAnomalyDetectionAlarm throws error for non-anomaly detection operators', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });

      const nonAnomalyOperators = [
        ComparisonOperator.GREATER_THAN_THRESHOLD,
        ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        ComparisonOperator.LESS_THAN_THRESHOLD,
        ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      ];
      for (const operator of nonAnomalyOperators) {
        expect(() => {
          // WHEN
          metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
            stdDevs: 1,
            evaluationPeriods: 3,
            datapointsToAlarm: 2,
            comparisonOperator: operator,
          });
          // THEN
        }).toThrow(/Invalid comparison operator for anomaly detection alarm/);
      }
    });

    test('throws error when anomaly detection operator is used without anomaly detection metric', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
      });

      // WHEN/THEN
      expect(() => {
        new Alarm(stack, 'Alarm', {
          metric: metric,
          threshold: 100,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        });
      }).toThrow(/Anomaly detection operators require an anomaly detection metric/);
    });
    test('throws error for invalid comparison operator', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
      });

      // WHEN/THEN
      expect(() => {
        metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
          stdDevs: 2,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
        });
      }).toThrow(/Invalid comparison operator for anomaly detection alarm/);
    });
  });
  describe('Validation', () => {
    test('validates that thresholdMetricId exists in the metrics configuration', () => {
      // GIVEN
      const stack = new Stack();

      // Create a metric with anomaly detection band to pass the initial validation
      const baseMetric = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });
      const anomalyMetric = new MathExpression({
        expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
        usingMetrics: {
          m1: baseMetric,
        },
      });

      // WHEN/THEN
      expect(() => {
        new Alarm(stack, 'Alarm', {
          metric: anomalyMetric,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
          thresholdMetricId: 'non_existent_id',
          threshold: THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION, // This value will be ignored for anomaly detection alarms
        });
      }).toThrow(/The specified thresholdMetricId "non_existent_id" does not exist in the metric configuration/);
    });
    test('validates that thresholdMetricId points to an anomaly detection band using protected method', () => {
      // GIVEN
      const stack = new Stack();

      // Create a metric with anomaly detection band
      const baseMetric = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });
      const anomalyMetric = new MathExpression({
        expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
        usingMetrics: {
          m1: baseMetric,
        },
      });

      // Manually create a CfnAlarm to test the validation
      // This is needed because we need to have both an anomaly detection band and a regular metric
      // in the same alarm, which is hard to do with the L2 constructs
      const cfnAlarm = new CfnAlarm(stack, 'TestAlarm', {
        comparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
        evaluationPeriods: 3,
        metrics: [
          {
            id: 'expr_1',
            expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
            returnData: true,
          },
          {
            id: 'm1',
            metricStat: {
              metric: {
                namespace: 'AWS/EC2',
                metricName: 'CPUUtilization',
              },
              period: 300,
              stat: 'Average',
            },
            returnData: false,
          },
          {
            id: 'expr_2',
            expression: 'SUM(METRICS())',
            returnData: false,
          },
        ],
        thresholdMetricId: 'expr_1',
      });

      // Create a subclass of Alarm to expose the protected method for testing
      class TestAlarm extends Alarm {
        public testValidateThresholdMetricId(metrics: CfnAlarm.MetricDataQueryProperty[], thresholdMetricId: string): void {
          return this.validateThresholdMetricId(metrics, thresholdMetricId);
        }
      }

      // Create the test alarm
      const testAlarm = new TestAlarm(stack, 'Alarm', {
        metric: anomalyMetric,
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        threshold: THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION,
      });

      // WHEN/THEN - Try to validate a non-anomaly detection metric
      expect(() => {
        testAlarm.testValidateThresholdMetricId(cfnAlarm.metrics as CfnAlarm.MetricDataQueryProperty[], 'expr_2');
      }).toThrow(/The metric with ID "expr_2" is not an anomaly detection band/);
    });
    test('throws error for invalid stdDevs value', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
      });

      // WHEN/THEN
      expect(() => {
        metric.createAnomalyDetectionAlarm(stack, 'Alarm', {
          stdDevs: -1,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        });
      }).toThrow(/stdDevs must be greater than 0/);
    });
  });
  describe('Threshold Behavior', () => {
    test('warns when threshold is not the ignored value for anomaly detection alarms', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });

      // Create an anomaly detection band
      const anomalyMetric = new MathExpression({
        expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
        usingMetrics: {
          m1: metric,
        },
      });

      // WHEN
      new Alarm(stack, 'Alarm', {
        metric: anomalyMetric,
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        threshold: 100, // Not using the THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION value
      });

      // THEN
      const annotations = Annotations.fromStack(stack);
      annotations.hasWarning('/Default/Alarm', Match.stringLikeRegexp('threshold is not used for anomaly detection alarms and will be ignored'));
    });
    test('does not warn when threshold is the ignored value for anomaly detection alarms', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({ namespace: 'AWS/EC2', metricName: 'CPUUtilization' });

      // Create an anomaly detection band
      const anomalyMetric = new MathExpression({
        expression: 'ANOMALY_DETECTION_BAND(m1, 2)',
        usingMetrics: {
          m1: metric,
        },
      });

      // WHEN
      new Alarm(stack, 'Alarm', {
        metric: anomalyMetric,
        evaluationPeriods: 3,
        comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        threshold: THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION, // Using the correct ignored value
      });

      // THEN
      const annotations = Annotations.fromStack(stack);
      annotations.hasNoWarning('/Default/Alarm', 'aws-cdk-lib/aws-cloudwatch:thresholdIgnoredForAnomalyDetection');
    });
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
