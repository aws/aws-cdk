import { Duration, Lazy, Stack, TimeZone } from 'aws-cdk-lib';
import { ScheduleExpression } from '../lib';

describe('schedule expression', () => {
  test('cron expressions day and dow are mutex: given weekday', () => {
    // Run every 10 minutes Monday through Friday
    expect('cron(0/10 * ? * MON-FRI *)').toEqual(ScheduleExpression.cron({
      minute: '0/10',
      weekDay: 'MON-FRI',
    }).expressionString);
  });

  test('cron expressions day and dow are mutex: given month day', () => {
    // Run at 8:00 am (UTC) every 1st day of the month
    expect('cron(0 8 1 * ? *)').toEqual(ScheduleExpression.cron({
      minute: '0',
      hour: '8',
      day: '1',
    }).expressionString);
  });

  test('cron expressions day and dow are mutex: given neither', () => {
    // Run at 10:00 am (UTC) every day
    expect('cron(0 10 * * ? *)').toEqual(ScheduleExpression.cron({
      minute: '0',
      hour: '10',
    }).expressionString);
  });

  test('cron expressions saves timezone', () => {
    expect(TimeZone.EUROPE_LONDON).toEqual(ScheduleExpression.cron(
      {
        minute: '0',
        hour: '10',
        timeZone: TimeZone.EUROPE_LONDON,
      }).timeZone);
  });

  test('cron expressions timezone is UTC if not specified', () => {
    expect(TimeZone.ETC_UTC).toEqual(ScheduleExpression.cron(
      {
        minute: '0',
        hour: '10',
      }).timeZone);
  });

  test('rate cannot be 0', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.days(0));
    }).toThrow(/Duration cannot be 0/);
  });

  test('rate cannot be negative', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.minutes(-2));
    }).toThrow(/Duration amounts cannot be negative/);
  });

  test('rate can be from a token', () => {
    const stack = new Stack();
    const lazyDuration = Duration.minutes(Lazy.number({ produce: () => 5 }));
    const rate = ScheduleExpression.rate(lazyDuration);
    expect('rate(5 minutes)').toEqual(stack.resolve(rate).expressionString);
  });

  test('rate can be in minutes', () => {
    expect('rate(10 minutes)').toEqual(
      ScheduleExpression.rate(Duration.minutes(10))
        .expressionString);
  });

  test('rate can be in days', () => {
    expect('rate(10 days)').toEqual(
      ScheduleExpression.rate(Duration.days(10))
        .expressionString);
  });

  test('rate can be in hours', () => {
    expect('rate(10 hours)').toEqual(
      ScheduleExpression.rate(Duration.hours(10))
        .expressionString);
  });

  test('rate can be in seconds', () => {
    expect('rate(2 minutes)').toEqual(
      ScheduleExpression.rate(Duration.seconds(120))
        .expressionString);
  });

  test('rate must not be in seconds when specified as a token', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.seconds(Lazy.number({ produce: () => 5 })));
    }).toThrow(/Allowed units for scheduling/);
  });

  // these tests are volatile
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('one-time expression string has expected date', () => {
  //   const x = ScheduleExpression.at(new Date(2022, 10, 20, 19, 20, 23));
  //   expect(x.expressionString).toEqual('at(2022-11-20T19:20:23)');
  // });

  test('one-time expression time zone is UTC if not provided', () => {
    const x = ScheduleExpression.at(new Date(2022, 10, 20, 19, 20, 23));
    expect(x.timeZone).toEqual(TimeZone.ETC_UTC);
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('one-time expression has expected time zone if provided', () => {
  //   const x = ScheduleExpression.at(new Date(2022, 10, 20, 19, 20, 23), TimeZone.EUROPE_LONDON);
  //   expect(x.expressionString).toEqual('at(2022-11-20T19:20:23)');
  //   expect(x.timeZone).toEqual(TimeZone.EUROPE_LONDON);
  // });

  test('one-time expression milliseconds ignored', () => {
    const x = ScheduleExpression.at(new Date(Date.UTC(2022, 10, 20, 19, 20, 23, 111)));
    expect(x.expressionString).toEqual('at(2022-11-20T19:20:23)');
  });

  test('one-time expression with invalid date throws', () => {
    expect(() => ScheduleExpression.at(new Date('13-20-1969'))).toThrowError('Invalid date');
  });
});

describe('fractional minutes checks', () => {
  test('rate cannot be a fractional amount of minutes (defined with seconds)', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.seconds(150));
    }).toThrow(/cannot be converted into a whole number of/);
  });

  test('rate cannot be a fractional amount of minutes (defined with minutes)', () => {
    expect(()=> {
      ScheduleExpression.rate(Duration.minutes(5/3));
    }).toThrow(/must be a whole number of/);
  });

  test('rate cannot be a fractional amount of minutes (defined with hours)', () => {
    expect(()=> {
      ScheduleExpression.rate(Duration.hours(1.03));
    }).toThrow(/cannot be converted into a whole number of/);
  });

  test('rate cannot be less than 1 minute (defined with seconds)', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.seconds(30));
    }).toThrow(/'30 seconds' cannot be converted into a whole number of minutes./);
  });

  test('rate cannot be less than 1 minute (defined with minutes as fractions)', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.minutes(1/2));
    }).toThrow(/must be a whole number of/);
  });

  test('rate cannot be less than 1 minute (defined with minutes as decimals)', () => {
    expect(() => {
      ScheduleExpression.rate(Duration.minutes(0.25));
    }).toThrow(/must be a whole number of/);
  });

  test('rate can be in minutes', () => {
    expect('rate(10 minutes)').toEqual(
      ScheduleExpression.rate(Duration.minutes(10))
        .expressionString);
  });
});