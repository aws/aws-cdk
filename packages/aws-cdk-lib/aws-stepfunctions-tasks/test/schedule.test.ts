import * as tasks from '../../aws-stepfunctions-tasks';
import { Duration } from '../../core';

describe('Schedule class', () => {
  test.each([
    { schedule: tasks.Schedule.rate(Duration.minutes(5)), expression: 'rate(5 minutes)' },
    { schedule: tasks.Schedule.rate(Duration.hours(5)), expression: 'rate(5 hours)' },
    { schedule: tasks.Schedule.rate(Duration.days(5)), expression: 'rate(5 days)' },
    { schedule: tasks.Schedule.cron({ minute: '0', hour: '12' }), expression: 'cron(0 12 * * ? *)' },
    { schedule: tasks.Schedule.cron({ minute: '0', hour: '12', day: '29', month: '12' }), expression: 'cron(0 12 29 12 ? *)' },
    { schedule: tasks.Schedule.cron({ minute: '0', hour: '12', day: '29', month: '12', year: '2023' }), expression: 'cron(0 12 29 12 ? 2023)' },
    { schedule: tasks.Schedule.cron({ minute: '0', hour: '12', weekDay: 'MON' }), expression: 'cron(0 12 ? * MON *)' },
    { schedule: tasks.Schedule.oneTime(new Date('2023-12-29T11:55:00')), expression: '2023-12-29T11:55:00' },
    { schedule: tasks.Schedule.oneTime(new Date('2024-01-01T00:00:00')), expression: '2024-01-01T00:00:00' },
  ])('valid schedule', (schedule) => {
    expect(schedule.schedule.expressionString).toBe(schedule.expression);
  });

  test('throw error for duration smaller than 1 minutes', () => {
    expect(() => {
      tasks.Schedule.rate(Duration.seconds(59));
    }).toThrow('Duration cannot be less than 1 minute');
  });

  test('throw error for invalid cron expression', () => {
    expect(() => {
      tasks.Schedule.cron({ day: '15', weekDay: 'MON' });
    }).toThrow('Cannot supply both \'day\' and \'weekDay\', use at most one');
  });
});
