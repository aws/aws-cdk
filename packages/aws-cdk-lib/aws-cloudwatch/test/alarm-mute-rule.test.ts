import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as cloudwatch from '../lib';

const testMetric = new cloudwatch.Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

describe('Alarm mute rule', () => {
  let stack: cdk.Stack;
  let alarm: cloudwatch.Alarm;

  beforeEach(() => {
    stack = new cdk.Stack();
    alarm = new cloudwatch.Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 1,
      evaluationPeriods: 1,
    });
  });

  test('full configurations', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarmMuteRuleName: 'RuleName',
      description: 'RuleDescription',
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0', timeZone: cdk.TimeZone.ASIA_TOKYO }),
      duration: cdk.Duration.hours(1),
      start: new Date(2026, 0, 1, 0, 0, 0),
      expire: new Date(2026, 11, 31, 23, 59, 59),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Name: 'RuleName',
      Description: 'RuleDescription',
      MuteTargets: {
        AlarmNames: [{ Ref: 'Alarm7103F465' }],
      },
      Rule: {
        Schedule: {
          Duration: 'PT1H',
          Expression: 'cron(0 * * * *)',
          Timezone: 'Asia/Tokyo',
        },
      },
      StartDate: '2026-01-01T00:00',
      ExpireDate: '2026-12-31T23:59',
    });
  });

  test('addAlarm', () => {
    // GIVEN
    const alarmMuteRule = new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0' }),
      duration: cdk.Duration.hours(1),
    });

    // WHEN
    alarmMuteRule.addAlarm(alarm);
    alarmMuteRule.addAlarm(new cloudwatch.Alarm(stack, 'Alarm2', { metric: testMetric, threshold: 1, evaluationPeriods: 1 }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      MuteTargets: {
        AlarmNames: [{ Ref: 'Alarm7103F465' }, { Ref: 'Alarm2A7122E13' }],
      },
    });
  });

  test('cron schedule without time zone', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0', hour: '0' }),
      duration: cdk.Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'cron(0 0 * * *)',
          Timezone: Match.absent(),
        },
      },
    });
  });

  test('cron schedule with time zone', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0', hour: '0', timeZone: cdk.TimeZone.ASIA_TOKYO }),
      duration: cdk.Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'cron(0 0 * * *)',
          Timezone: 'Asia/Tokyo',
        },
      },
    });
  });

  test('cron schedule with day and month', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0', hour: '0', day: '1', month: 'JAN' }),
      duration: cdk.Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'cron(0 0 1 JAN *)',
        },
      },
    });
  });

  test('cron schedule with weekday', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0', hour: '0', weekDay: 'SUN' }),
      duration: cdk.Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'cron(0 0 * * SUN)',
        },
      },
    });
  });

  test('throws when both day and weekDay are specified', () => {
    expect(() => {
      new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
        alarms: [alarm],
        schedule: cloudwatch.ScheduleExpression.cron({ minute: '0', day: '1', weekDay: 'SUN' }),
        duration: cdk.Duration.hours(1),
      });
    }).toThrow("Cannot supply both 'day' and 'weekDay', use at most one");
  });

  test('at schedule without time zone', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.at(new Date(2026, 0, 2, 3, 4)),
      duration: cdk.Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'at(2026-01-02T03:04)',
          Timezone: Match.absent(),
        },
      },
    });
  });

  test('at schedule with time zone', () => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.at(new Date(2026, 0, 2, 3, 4), cdk.TimeZone.ASIA_TOKYO),
      duration: cdk.Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'at(2026-01-02T03:04)',
          Timezone: 'Asia/Tokyo',
        },
      },
    });
  });

  test.each([
    [cdk.Duration.minutes(10), 'PT10M'],
    [cdk.Duration.hours(10), 'PT10H'],
    [cdk.Duration.days(10), 'P10D'],
  ])('configures duration %s', (duration, durationString) => {
    // WHEN
    new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
      alarms: [alarm],
      schedule: cloudwatch.ScheduleExpression.cron({ minute: '0' }),
      duration,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Duration: durationString,
        },
      },
    });
  });

  test('throws when duration is less than 1 minute', () => {
    expect(() => {
      new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
        alarms: [alarm],
        schedule: cloudwatch.ScheduleExpression.cron({ minute: '0' }),
        duration: cdk.Duration.minutes(0),
      });
    }).toThrow('Duration must be greater than or equal to 1 minute');
  });

  test('throws when duration is greater than 15 days', () => {
    expect(() => {
      new cloudwatch.AlarmMuteRule(stack, 'AlarmMuteRule', {
        alarms: [alarm],
        schedule: cloudwatch.ScheduleExpression.cron({ minute: '0' }),
        duration: cdk.Duration.hours(24 * 15 + 1),
      });
    }).toThrow('Duration must be less than or equal to 15 days');
  });
});
