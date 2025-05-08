import { Construct } from 'constructs';
import { Match, Template, Annotations } from '../../assertions';
import { Ec2Action, Ec2InstanceAction } from '../../aws-cloudwatch-actions/lib';
import { Duration, Stack, App } from '../../core';
import { ENABLE_PARTITION_LITERALS } from '../../cx-api';
import { Alarm, IAlarm, IAlarmAction, Metric, MathExpression, IMetric, Stats, ComparisonOperator } from '../lib';

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

  describe('Anomaly Detection', () => {
    test('Alarm rejects anomaly detection operators', () => {
      // GIVEN
      const stack = new Stack();
      const metric = new Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
      });

      // WHEN/THEN
      expect(() => {
        new Alarm(stack, 'Alarm', {
          metric,
          threshold: 100,
          evaluationPeriods: 3,
          comparisonOperator: ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
        });
      }).toThrow(/Anomaly detection operators require to use the construct AnomalyDetectionAlarm/);
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
