import { App, Stack, Duration, TimeZone } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Alarm, AnomalyDetectionAlarm, EvaluationWindow, MathExpression, Metric } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'EvaluationWindowTestStack');

const metric = new Metric({
  namespace: 'AWS/EC2',
  metricName: 'CPUUtilization',
  statistic: 'Average',
  period: Duration.hours(1),
});

// Single metric alarm with a wall clock window and a timezone
const wallClockAlarm = new Alarm(stack, 'WallClockAlarm', {
  metric,
  threshold: 80,
  evaluationPeriods: 1,
  evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.AMERICA_NEW_YORK }),
});

// Metric math alarm with a wall clock window, no timezone (defaults to UTC)
const mathAlarm = new Alarm(stack, 'WallClockMathAlarm', {
  metric: new MathExpression({
    expression: 'a * 2',
    usingMetrics: {
      a: metric.with({ period: Duration.minutes(5) }),
    },
  }),
  threshold: 160,
  evaluationPeriods: 1,
  evaluationWindow: EvaluationWindow.wallClockWindow(),
});

// Metrics Insights alarm (SELECT query) with a wall clock window
const insightsAlarm = new Alarm(stack, 'WallClockInsightsAlarm', {
  metric: new MathExpression({
    expression: 'SELECT AVG(CPUUtilization) FROM SCHEMA("AWS/EC2", InstanceId)',
    period: Duration.minutes(5),
  }),
  threshold: 80,
  evaluationPeriods: 1,
  evaluationWindow: EvaluationWindow.wallClockWindow(),
});

// Anomaly detection alarm with a wall clock window
const anomalyAlarm = new AnomalyDetectionAlarm(stack, 'WallClockAnomalyAlarm', {
  metric,
  evaluationPeriods: 1,
  evaluationWindow: EvaluationWindow.wallClockWindow({ timeZone: TimeZone.AMERICA_NEW_YORK }),
});

// Explicit sliding window
const slidingAlarm = new Alarm(stack, 'SlidingWindowAlarm', {
  metric,
  threshold: 80,
  evaluationPeriods: 1,
  evaluationWindow: EvaluationWindow.slidingWindow(),
});

const integ = new IntegTest(app, 'EvaluationWindowIntegTest', {
  testCases: [stack],
});

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [wallClockAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        Period: 3600,
        EvaluationWindow: Match.objectLike({
          WallClockWindow: Match.objectLike({
            Timezone: 'America/New_York',
          }),
        }),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [mathAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        EvaluationWindow: Match.objectLike({
          WallClockWindow: Match.objectLike({}),
        }),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [insightsAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        EvaluationWindow: Match.objectLike({
          WallClockWindow: Match.objectLike({}),
        }),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [anomalyAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        ThresholdMetricId: 'expr_1',
        EvaluationWindow: Match.objectLike({
          WallClockWindow: Match.objectLike({
            Timezone: 'America/New_York',
          }),
        }),
      }),
    ]),
  }));

integ.assertions
  .awsApiCall('CloudWatch', 'describeAlarms', {
    AlarmNames: [slidingAlarm.alarmName],
  })
  .expect(ExpectedResult.objectLike({
    MetricAlarms: Match.arrayWith([
      Match.objectLike({
        EvaluationWindow: Match.objectLike({
          SlidingWindow: Match.objectLike({}),
        }),
      }),
    ]),
  }));
