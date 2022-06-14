import { Duration, Stack, Lazy } from '@aws-cdk/core';
import * as events from '../lib';

describe('schedule', () => {
  test('cron expressions day and dow are mutex: given weekday', () => {
    // Run every 10 minutes Monday through Friday
    expect('cron(0/10 * ? * MON-FRI *)').toEqual(events.Schedule.cron({
      minute: '0/10',
      weekDay: 'MON-FRI',
    }).expressionString);
  });

  test('cron expressions day and dow are mutex: given month day', () => {
    // Run at 8:00 am (UTC) every 1st day of the month
    expect('cron(0 8 1 * ? *)').toEqual(events.Schedule.cron({
      minute: '0',
      hour: '8',
      day: '1',
    }).expressionString);
  });

  test('cron expressions day and dow are mutex: given neither', () => {
    // Run at 10:00 am (UTC) every day
    expect('cron(0 10 * * ? *)').toEqual(events.Schedule.cron({
      minute: '0',
      hour: '10',
    }).expressionString);
  });

  test('rate cannot be 0', () => {
    expect(() => {
      events.Schedule.rate(Duration.days(0));
    }).toThrow(/Duration cannot be 0/);
  });

  test('rate can be from a token', () => {
    const stack = new Stack();
    const lazyDuration = Duration.minutes(Lazy.number({ produce: () => 5 }));
    const rate = events.Schedule.rate(lazyDuration);
    expect('rate(5 minutes)').toEqual(stack.resolve(rate).expressionString);
  });

  test('rate can be in minutes', () => {
    expect('rate(10 minutes)').toEqual(
      events.Schedule.rate(Duration.minutes(10))
        .expressionString);
  });

  test('rate can be in days', () => {
    expect('rate(10 days)').toEqual(
      events.Schedule.rate(Duration.days(10))
        .expressionString);
  });

  test('rate can be in hours', () => {
    expect('rate(10 hours)').toEqual(
      events.Schedule.rate(Duration.hours(10))
        .expressionString);
  });

  test('rate can be in seconds', () => {
    expect('rate(2 minutes)').toEqual(
      events.Schedule.rate(Duration.seconds(120))
        .expressionString);
  });

  test('rate must not be in seconds when specified as a token', () => {
    expect(() => {
      events.Schedule.rate(Duration.seconds(Lazy.number({ produce: () => 5 })));
    }).toThrow(/Allowed units for scheduling/);
  });

  test('rate cannot be a fractional amount of minutes (defined with seconds)', () => {
    expect(() => {
      events.Schedule.rate(Duration.seconds(150));
    }).toThrow(/'150 seconds' cannot be converted into a whole number of minutes./);
  });

  test('rate cannot be a fractional amount of minutes (defined with minutes)', () => {
    expect(()=> {
      events.Schedule.rate(Duration.minutes(5/3));
    }).toThrow(/Duration must be a whole number of minutes, Duration provided was 1.6666666666666667 minutes/);
  });

  test('rate cannot be less than 1 minute (defined with seconds)', () => {
    expect(() => {
      events.Schedule.rate(Duration.seconds(30));
    }).toThrow(/'30 seconds' cannot be converted into a whole number of minutes./);
  });

  test('rate cannot be less than 1 minute (defined with minutes as fractions)', () => {
    expect(() => {
      events.Schedule.rate(Duration.minutes(1/2));
    }).toThrow(/Duration must be a whole number of minutes, Duration provided was 0.5 minutes/);
  });

  test('rate cannot be less than 1 minute (defined with minutes as decimals)', () => {
    expect(() => {
      events.Schedule.rate(Duration.minutes(0.25));
    }).toThrow(/Duration must be a whole number of minutes, Duration provided was 0.25 minutes/);
  });
});