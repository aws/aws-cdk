import { Duration, Lazy, Schedule, Stack } from '../lib';

describe('cron', () => {
  test('cron expressions day and dow are mutex: given weekday', () => {
    // Run every 10 minutes Monday through Friday
    expect(Schedule.cron({
      minute: '0/10',
      weekDay: 'MON-FRI',
    }).expressionString).toEqual('cron(0/10 * ? * MON-FRI *)');
  });

  test('cron expressions day and dow are mutex: given month day', () => {
    // Run at 8:00 am (UTC) every 1st day of the month
    expect(Schedule.cron({
      minute: '0',
      hour: '8',
      day: '1',
    }).expressionString).toEqual('cron(0 8 1 * ? *)');
  });

  test('cron expressions day and dow are mutex: given neither', () => {
    // Run at 10:00 am (UTC) every day
    expect(Schedule.cron({
      minute: '0',
      hour: '10',
    }).expressionString).toEqual('cron(0 10 * * ? *)');
  });

  test('test utc cron, hour only', () => {
    expect(Schedule.cron({ hour: '18', minute: '0' }).expressionString).toEqual('cron(0 18 * * ? *)');

  });

  test('test utc cron, hour and minute', () => {
    expect(Schedule.cron({ hour: '18', minute: '24' }).expressionString).toEqual('cron(24 18 * * ? *)');

  });
});

describe('rate', () => {
  test('rate must be whole number of minutes', () => {
    expect(() => {
      Schedule.rate(Duration.minutes(0.13456));
    }).toThrow(/'0.13456 minutes' cannot be converted into a whole number of seconds/);
  });

  test('rate must be whole number', () => {
    expect(() => {
      Schedule.rate(Duration.minutes(1/8));
    }).toThrow(/'0.125 minutes' cannot be converted into a whole number of seconds/);
  });

  test('rate can be in seconds', () => {
    const duration = Schedule.rate(Duration.seconds(120));
    expect('rate(2 minutes)').toEqual(duration.expressionString);

  });

  test('rate must not be in seconds when specified as a token', () => {
    expect(() => {
      Schedule.rate(Duration.seconds(Lazy.number({ produce: () => 5 })));
    }).toThrow(/Allowed units for scheduling/);

  });

  test('rate cannot be 0', () => {
    expect(() => {
      Schedule.rate(Duration.days(0));
    }).toThrow(/Duration cannot be 0/);

  });

  test('rate can be token', () => {
    const stack = new Stack();
    const lazyDuration = Duration.minutes(Lazy.number({ produce: () => 5 }));
    const rate = Schedule.rate(lazyDuration);
    expect('rate(5 minutes)').toEqual(stack.resolve(rate).expressionString);

  });

  test('rate can be in allowed type hours', () => {
    expect('rate(1 hour)').toEqual(Schedule.rate(Duration.hours(1))
      .expressionString);
  });

  test('rate can be in minutes', () => {
    expect('rate(10 minutes)').toEqual(
      Schedule.rate(Duration.minutes(10))
        .expressionString);
  });

  test('rate can be in days', () => {
    expect('rate(10 days)').toEqual(
      Schedule.rate(Duration.days(10))
        .expressionString);
  });

  test('rate can be in hours', () => {
    expect('rate(10 hours)').toEqual(
      Schedule.rate(Duration.hours(10))
        .expressionString);
  });

  test('rate can be in seconds', () => {
    expect('rate(2 minutes)').toEqual(
      Schedule.rate(Duration.seconds(120))
        .expressionString);
  });
});

describe('expression', () => {
  test('test using a literal schedule expression', () => {
    expect(Schedule.expression('cron(0 18 * * ? *)').expressionString).toEqual('cron(0 18 * * ? *)');

  });
});

describe('at', () => {
  test('test using at with a specific Date', () => {
    expect(Schedule.at(new Date(Date.UTC(2021, 10, 26))).expressionString).toEqual('at(2021-11-26T00:00:00)');
  });
});
