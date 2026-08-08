import { Annotations, Match, Template } from '../../assertions';
import { Duration, Stack } from '../../core';
import { Alarm, AlarmMuteRule, CompositeAlarm, Metric, MuteSchedule } from '../lib';

const testMetric = new Metric({
  namespace: 'CDK/Test',
  metricName: 'Metric',
});

describe('AlarmMuteRule', () => {
  test('can create a basic alarm mute rule with cron schedule', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'cron(0 2 * * *)',
          Duration: 'PT1H',
        },
      },
    });
  });

  test('can create a mute rule with at() schedule', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.at({ year: 2025, month: 6, day: 15, hour: 3, minute: 30 }),
      duration: Duration.minutes(90),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Expression: 'at(2025-06-15T03:30)',
          Duration: 'PT1H30M',
        },
      },
    });
  });

  test('can create a mute rule with custom name', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      alarmMuteRuleName: 'MyMuteRule',
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Name: 'MyMuteRule',
    });
  });

  test('can create a mute rule with description', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      description: 'Mute during maintenance window',
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Description: 'Mute during maintenance window',
    });
  });

  test('can create a mute rule with timezone', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
      timezone: 'Asia/Tokyo',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      Rule: {
        Schedule: {
          Timezone: 'Asia/Tokyo',
        },
      },
    });
  });

  test('can add alarms to mute rule via props', () => {
    const stack = new Stack();

    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
      alarms: [alarm],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      MuteTargets: {
        AlarmNames: [{ Ref: 'Alarm7103F465' }],
      },
    });
  });

  test('can add alarms after construction using addAlarm()', () => {
    const stack = new Stack();

    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    const muteRule = new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
    });

    muteRule.addAlarm(alarm);

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      MuteTargets: {
        AlarmNames: [{ Ref: 'Alarm7103F465' }],
      },
    });
  });

  test('can add multiple alarms', () => {
    const stack = new Stack();

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

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
      alarms: [alarm1, alarm2],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      MuteTargets: {
        AlarmNames: Match.arrayWith([
          { Ref: 'Alarm1F9009D71' },
          { Ref: 'Alarm2A7122E13' },
        ]),
      },
    });
  });

  test('no MuteTargets when no alarms are added', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      MuteTargets: Match.absent(),
    });
  });

  test('can create a mute rule with startDate and expireDate', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
      startDate: { year: 2025, month: 1, day: 1, hour: 0, minute: 0 },
      expireDate: { year: 2025, month: 12, day: 31, hour: 23, minute: 59 },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      StartDate: '2025-01-01T00:00',
      ExpireDate: '2025-12-31T23:59',
    });
  });

  test('can add CompositeAlarm as mute target', () => {
    const stack = new Stack();

    const alarm = new Alarm(stack, 'Alarm', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    const compositeAlarm = new CompositeAlarm(stack, 'CompositeAlarm', {
      alarmRule: alarm,
    });

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
      alarms: [compositeAlarm],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::AlarmMuteRule', {
      MuteTargets: {
        AlarmNames: Match.arrayWith([
          { Ref: 'CompositeAlarmF4C3D082' },
        ]),
      },
    });
  });
});

describe('AlarmMuteRule validation', () => {
  test('throws when duration is less than 1 minute', () => {
    const stack = new Stack();

    expect(() => {
      new AlarmMuteRule(stack, 'MuteRule', {
        schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
        duration: Duration.seconds(30),
      });
    }).toThrow(/Duration must be at least 1 minute/);
  });

  test('throws when duration exceeds 15 days', () => {
    const stack = new Stack();

    expect(() => {
      new AlarmMuteRule(stack, 'MuteRule', {
        schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
        duration: Duration.days(16),
      });
    }).toThrow(/Duration must be at most 15 days/);
  });

  test('throws when startDate is after expireDate', () => {
    const stack = new Stack();

    expect(() => {
      new AlarmMuteRule(stack, 'MuteRule', {
        schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
        duration: Duration.hours(1),
        startDate: { year: 2025, month: 12, day: 31, hour: 0, minute: 0 },
        expireDate: { year: 2025, month: 1, day: 1, hour: 0, minute: 0 },
      });
    }).toThrow(/startDate must be before expireDate/);
  });

  test('throws when startDate equals expireDate', () => {
    const stack = new Stack();

    expect(() => {
      new AlarmMuteRule(stack, 'MuteRule', {
        schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
        duration: Duration.hours(1),
        startDate: { year: 2025, month: 6, day: 15, hour: 10, minute: 0 },
        expireDate: { year: 2025, month: 6, day: 15, hour: 10, minute: 0 },
      });
    }).toThrow(/startDate must be before expireDate/);
  });

  test('throws when adding more than 100 alarms', () => {
    const stack = new Stack();

    const alarms = [];
    for (let i = 0; i < 100; i++) {
      alarms.push(new Alarm(stack, `Alarm${i}`, {
        metric: testMetric,
        threshold: 100,
        evaluationPeriods: 3,
      }));
    }

    const muteRule = new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2', minute: '0' }),
      duration: Duration.hours(1),
      alarms,
    });

    const extraAlarm = new Alarm(stack, 'ExtraAlarm', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    expect(() => {
      muteRule.addAlarm(extraAlarm);
    }).toThrow(/maximum of 100 alarms/);
  });
});

describe('MuteSchedule', () => {
  test('cron() generates correct expression', () => {
    const schedule = MuteSchedule.cron({ minute: '0', hour: '2', day: '1', month: '6' });
    expect(schedule.expressionString).toBe('cron(0 2 1 6 *)');
  });

  test('cron() defaults to * for unspecified fields', () => {
    const schedule = MuteSchedule.cron({ minute: '30' });
    expect(schedule.expressionString).toBe('cron(30 * * * *)');
  });

  test('cron() throws when both day and weekDay are specified', () => {
    expect(() => {
      MuteSchedule.cron({ minute: '0', hour: '2', day: '1', weekDay: 'MON' });
    }).toThrow(/Cannot supply both 'day' and 'weekDay'/);
  });

  test('cron() with weekDay', () => {
    const schedule = MuteSchedule.cron({ minute: '0', hour: '2', weekDay: 'MON-FRI' });
    expect(schedule.expressionString).toBe('cron(0 2 * * MON-FRI)');
  });

  test('cron() without minute warns about every-minute execution', () => {
    const stack = new Stack();

    new AlarmMuteRule(stack, 'MuteRule', {
      schedule: MuteSchedule.cron({ hour: '2' }),
      duration: Duration.hours(1),
    });

    Annotations.fromStack(stack).hasWarning('/Default/MuteRule', Match.stringLikeRegexp('scheduleWillRunEveryMinute'));
  });

  test('at() generates correct expression', () => {
    const schedule = MuteSchedule.at({ year: 2025, month: 1, day: 15, hour: 2, minute: 0 });
    expect(schedule.expressionString).toBe('at(2025-01-15T02:00)');
  });

  test('at() pads single-digit values', () => {
    const schedule = MuteSchedule.at({ year: 2025, month: 3, day: 5, hour: 8, minute: 5 });
    expect(schedule.expressionString).toBe('at(2025-03-05T08:05)');
  });

  test('at() throws for invalid month', () => {
    expect(() => {
      MuteSchedule.at({ year: 2025, month: 13, day: 1, hour: 0, minute: 0 });
    }).toThrow(/month must be between 1 and 12/);
  });

  test('at() throws for invalid day', () => {
    expect(() => {
      MuteSchedule.at({ year: 2025, month: 1, day: 0, hour: 0, minute: 0 });
    }).toThrow(/day must be between 1 and 31/);
  });

  test('at() throws for invalid hour', () => {
    expect(() => {
      MuteSchedule.at({ year: 2025, month: 1, day: 1, hour: 24, minute: 0 });
    }).toThrow(/hour must be between 0 and 23/);
  });

  test('at() throws for invalid minute', () => {
    expect(() => {
      MuteSchedule.at({ year: 2025, month: 1, day: 1, hour: 0, minute: 60 });
    }).toThrow(/minute must be between 0 and 59/);
  });

  test('expression() passes through raw expression', () => {
    const schedule = MuteSchedule.expression('rate(1 hour)');
    expect(schedule.expressionString).toBe('rate(1 hour)');
  });
});

describe('AlarmMuteRule import', () => {
  test('fromAlarmMuteRuleArn', () => {
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });

    const imported = AlarmMuteRule.fromAlarmMuteRuleArn(
      stack, 'Imported',
      'arn:aws:cloudwatch:us-east-1:123456789012:alarm-mute-rule:MyRule',
    );

    expect(imported.alarmMuteRuleArn).toBe('arn:aws:cloudwatch:us-east-1:123456789012:alarm-mute-rule:MyRule');
    expect(imported.alarmMuteRuleName).toBe('MyRule');
  });

  test('fromAlarmMuteRuleName', () => {
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1', account: '123456789012' } });

    const imported = AlarmMuteRule.fromAlarmMuteRuleName(stack, 'Imported', 'MyRule');

    expect(imported.alarmMuteRuleName).toBe('MyRule');
    expect(imported.alarmMuteRuleArn).toMatch(
      /arn:.*:cloudwatch:us-east-1:123456789012:alarm-mute-rule:MyRule/,
    );
  });
});
