import { Match, Template } from '../../assertions';
import { Duration, Stack, TimeZone } from '../../core';
import { Alarm, AnomalyDetectionAlarm, EvaluationWindow, MathExpression, Metric } from '../lib';

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

describe('evaluation window', () => {
  test('alarm without evaluationWindow renders no EvaluationWindow', () => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: Match.absent(),
    });
  });

  test('single metric alarm with wall clock window and timezone', () => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: testMetric.with({ period: Duration.hours(1) }),
      threshold: 1000,
      evaluationPeriods: 3,
      evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.AMERICA_NEW_YORK }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Period: 3600,
      EvaluationWindow: {
        WallClockWindow: {
          Timezone: 'America/New_York',
        },
      },
    });
  });

  test('single metric alarm with wall clock window and no timezone', () => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: testMetric.with({ period: Duration.minutes(5) }),
      threshold: 1000,
      evaluationPeriods: 3,
      evaluationWindow: EvaluationWindow.wallClockWindow(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: {
        WallClockWindow: {},
      },
    });
  });

  test.each(['+05:30', 'Z', 'UTC+05:30', 'GMT-08:00'])('wall clock window passes the %s offset time zone through', (timezone) => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: testMetric.with({ period: Duration.hours(1) }),
      threshold: 1000,
      evaluationPeriods: 1,
      evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.of(timezone) }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: {
        WallClockWindow: {
          Timezone: timezone,
        },
      },
    });
  });

  test('explicit sliding window renders SlidingWindow member', () => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1000,
      evaluationPeriods: 3,
      evaluationWindow: EvaluationWindow.slidingWindow(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: {
        SlidingWindow: {},
      },
    });
  });

  test.each([60, 300, 3600, 86400, 604800])('wall clock window accepts supported period %d', (period) => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: testMetric.with({ period: Duration.seconds(period) }),
        threshold: 1000,
        evaluationPeriods: 1,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
    }).not.toThrow();
  });

  test('math expression alarm with wall clock window and supported periods', () => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: new MathExpression({
        expression: 'a + b',
        usingMetrics: {
          a: testMetric.with({ period: Duration.minutes(5) }),
          b: testMetric.with({ period: Duration.minutes(5) }),
        },
      }),
      threshold: 1000,
      evaluationPeriods: 3,
      evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.ETC_UTC }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: {
        WallClockWindow: {
          Timezone: 'Etc/UTC',
        },
      },
    });
  });

  test('metric insights alarm (SELECT expression) with wall clock window', () => {
    const stack = new Stack();

    new Alarm(stack, 'Alarm', {
      metric: new MathExpression({
        expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
        period: Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 1,
      evaluationWindow: EvaluationWindow.wallClockWindow(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: {
        WallClockWindow: {},
      },
      Metrics: [
        {
          Expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
          Period: 300,
        },
      ],
    });
  });

  test('anomaly detection alarm with wall clock window', () => {
    const stack = new Stack();

    new AnomalyDetectionAlarm(stack, 'Alarm', {
      metric: testMetric.with({ period: Duration.hours(1) }),
      evaluationPeriods: 1,
      evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.AMERICA_NEW_YORK }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      ThresholdMetricId: 'expr_1',
      EvaluationWindow: {
        WallClockWindow: {
          Timezone: 'America/New_York',
        },
      },
    });
  });

  test('metric.createAlarm forwards the evaluation window', () => {
    const stack = new Stack();

    testMetric.with({ period: Duration.hours(1) }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 1,
      evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.AMERICA_NEW_YORK }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: { WallClockWindow: { Timezone: 'America/New_York' } },
    });
  });

  test('MathExpression.createAlarm forwards the evaluation window', () => {
    const stack = new Stack();

    new MathExpression({ expression: 'm1', usingMetrics: { m1: testMetric } }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 1,
      evaluationWindow: EvaluationWindow.slidingWindow(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      EvaluationWindow: { SlidingWindow: {} },
    });
  });

  test('metric.createAlarm validates wall clock periods', () => {
    const stack = new Stack();

    expect(() => testMetric.with({ period: Duration.minutes(2) }).createAlarm(stack, 'Alarm', {
      threshold: 1000,
      evaluationPeriods: 1,
      evaluationWindow: EvaluationWindow.wallClockWindow(),
    })).toThrow(/all metric periods must be one of 60, 300, 3600, 86400, 604800 seconds, got 120/);
  });

  test('throws when wall clock window is used with an unsupported period', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: testMetric.with({ period: Duration.minutes(2) }),
        threshold: 1000,
        evaluationPeriods: 3,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
    }).toThrow(/all metric periods must be one of 60, 300, 3600, 86400, 604800 seconds, got 120/);
  });

  test('throws when a math expression has an unsupported period', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: new MathExpression({
          expression: 'a + b',
          period: Duration.minutes(15),
          usingMetrics: {
            a: testMetric,
            b: testMetric,
          },
        }),
        threshold: 1000,
        evaluationPeriods: 3,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
    }).toThrow(/all metric periods must be one of 60, 300, 3600, 86400, 604800 seconds, got 900/);
  });

  test('throws when a Metrics Insights query has an unsupported period with a wall clock window', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: new MathExpression({
          expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
          period: Duration.minutes(2),
        }),
        threshold: 80,
        evaluationPeriods: 1,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
    }).toThrow(/all metric periods must be one of 60, 300, 3600, 86400, 604800 seconds, got 120/);
  });

  test('throws when a Metrics Insights alarm with a wall clock window exceeds the 3 hour time range', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: new MathExpression({
          expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
          period: Duration.hours(1),
        }),
        threshold: 80,
        evaluationPeriods: 3,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
    }).toThrow(/period \* \(evaluationPeriods \+ 1\) of at most 10800 seconds \(3 hours\), got 3600 \* \(3 \+ 1\) = 14400/);
  });

  test('accepts a Metrics Insights alarm with a wall clock window within the 3 hour time range', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: new MathExpression({
          expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
          period: Duration.hours(1),
        }),
        threshold: 80,
        evaluationPeriods: 2,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
    }).not.toThrow();
  });

  test('the 3 hour wall clock limit does not apply to ordinary metric math or sliding windows', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'MathAlarm', {
        metric: new MathExpression({
          expression: 'a + b',
          usingMetrics: {
            a: testMetric.with({ period: Duration.hours(1) }),
            b: testMetric.with({ period: Duration.hours(1) }),
          },
        }),
        threshold: 1000,
        evaluationPeriods: 3,
        evaluationWindow: EvaluationWindow.wallClockWindow(),
      });
      new Alarm(stack, 'SlidingInsightsAlarm', {
        metric: new MathExpression({
          expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
          period: Duration.hours(1),
        }),
        threshold: 80,
        evaluationPeriods: 3,
        evaluationWindow: EvaluationWindow.slidingWindow(),
      });
    }).not.toThrow();
  });

  test('sliding window does not restrict periods', () => {
    const stack = new Stack();

    expect(() => {
      new Alarm(stack, 'Alarm', {
        metric: testMetric.with({ period: Duration.minutes(2) }),
        threshold: 1000,
        evaluationPeriods: 3,
        evaluationWindow: EvaluationWindow.slidingWindow(),
      });
    }).not.toThrow();
  });
});
