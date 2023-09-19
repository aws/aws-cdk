import { Annotations } from '../../assertions';
import { Stack } from '../lib/stack';
import { Duration } from '../lib/duration';
import { CronOptions, Schedule } from '../lib/schedule';
import { TimeZone } from '../lib/time-zone';

/**
 * Basic example of extending core.Schedule for testing purposes.
 */
abstract class TestSchedule extends Schedule {
  public static at(date: Date, timeZone?: TimeZone): Schedule {
    return Schedule.protectedAt(date, timeZone);
  }

  public static rate(duration: Duration): Schedule {
    return Schedule.protectedRate(duration);
  }

  public static expression(expression: string, timeZone?: TimeZone): Schedule {
    return Schedule.protectedExpression(expression, timeZone);
  }

  public static cron(options: CronOptions): Schedule {
    return Schedule.protectedCron(options);
  }
}

describe('schedules', () => {
  test('at - with default timezone', () => {
    const schedule = TestSchedule.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)));
    expectSchedule(schedule, 'at(1969-11-20T00:00:00)', TimeZone.ETC_UTC);
  });

  test('at - with timezone', () => {
    const schedule = TestSchedule.at(new Date(Date.UTC(1969, 10, 20, 0, 0, 0)), TimeZone.ASIA_TOKYO );
    expectSchedule(schedule, 'at(1969-11-20T00:00:00)', TimeZone.ASIA_TOKYO);
  });

  test('rate', () => {
    const schedule = TestSchedule.rate(Duration.days(1));
    expectSchedule(schedule, 'rate(1 day)', undefined);
  });

  test('expression - with default timezone', () => {
    const schedule = TestSchedule.expression('at(1969-11-20T00:00:00)');
    expectSchedule(schedule, 'at(1969-11-20T00:00:00)', TimeZone.ETC_UTC);
  });

  test('expression - with timezone', () => {
    const schedule = TestSchedule.expression('at(1969-11-20T00:00:00)', TimeZone.ASIA_SEOUL);
    expectSchedule(schedule, 'at(1969-11-20T00:00:00)', TimeZone.ASIA_SEOUL);
  });

  test('cron - with default timezone', () => {
    const schedule = TestSchedule.cron({
      minute: '0/10',
      weekDay: 'MON-FRI',
    });
    expectSchedule(schedule, 'cron(0/10 * ? * MON-FRI *)', TimeZone.ETC_UTC);
  });

  test('cron - with timezone', () => {
    const schedule = TestSchedule.cron({
      minute: '0/10',
      weekDay: 'MON-FRI',
      timeZone: TimeZone.ANTARCTICA_TROLL,
    });
    expectSchedule(schedule, 'cron(0/10 * ? * MON-FRI *)', TimeZone.ANTARCTICA_TROLL);
  });

  test('cron warning when minute not supplied', () => {
    const stack = new Stack();
    const schedule = TestSchedule.cron({
      weekDay: 'MON-FRI',
    });
    schedule._bind(stack);
    Annotations.fromStack(stack).hasWarning('/Default', "cron: If you don't pass 'minute', by default the event runs every minute. Pass 'minute: '*'' if that's what you intend, or 'minute: 0' to run once per hour instead. [ack: @aws-cdk/core:scheduleDefaultRunsEveryMinute]");
  });
});

function expectSchedule(schedule: Schedule, expectedExpression: string, expectedTimeZone?: TimeZone) {
  expect(schedule.expressionString).toEqual(expectedExpression);
  expect(schedule.timeZone).toEqual(expectedTimeZone);
}
