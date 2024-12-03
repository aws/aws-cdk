import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Duration, Lazy, Stack, Token } from '../lib';

describe('duration', () => {
  test('negative amount', () => {
    expect(() => Duration.seconds(-1)).toThrow(/negative/);
  });

  test('can stringify', () => {
    expect(`${Duration.hours(1)}`).toEqual('Duration.hours(1)');
  });

  test('unresolved amount', () => {
    const stack = new Stack();
    const lazyDuration = Duration.seconds(Token.asNumber({ resolve: () => 1337 }));
    expect(stack.resolve(lazyDuration.toSeconds())).toEqual(1337);
    expect(
      () => stack.resolve(lazyDuration.toMinutes())).toThrow(
      /Duration must be specified as 'Duration.minutes\(\)' here/,
    );
  });

  test('Duration in seconds', () => {
    const duration = Duration.seconds(300);

    expect(duration.toSeconds()).toEqual(300);
    expect(duration.toMinutes()).toEqual(5);
    expect(() => duration.toDays()).toThrow(/'300 seconds' cannot be converted into a whole number of days/);
    floatEqual(duration.toDays({ integral: false }), 300 / 86_400);

    expect(Duration.seconds(60 * 60 * 24).toDays()).toEqual(1);
  });

  test('Duration in minutes', () => {
    const duration = Duration.minutes(5);

    expect(duration.toSeconds()).toEqual(300);
    expect(duration.toMinutes()).toEqual(5);
    expect(() => duration.toDays()).toThrow(/'5 minutes' cannot be converted into a whole number of days/);
    floatEqual(duration.toDays({ integral: false }), 300 / 86_400);

    expect(Duration.minutes(60 * 24).toDays()).toEqual(1);
  });

  test('Duration in hours', () => {
    const duration = Duration.hours(5);

    expect(duration.toSeconds()).toEqual(18_000);
    expect(duration.toMinutes()).toEqual(300);
    expect(() => duration.toDays()).toThrow(/'5 hours' cannot be converted into a whole number of days/);
    floatEqual(duration.toDays({ integral: false }), 5 / 24);

    expect(Duration.hours(24).toDays()).toEqual(1);
  });

  test('seconds to milliseconds', () => {
    const duration = Duration.seconds(5);

    expect(duration.toMilliseconds()).toEqual(5_000);
  });

  test('Duration in days', () => {
    const duration = Duration.days(1);

    expect(duration.toSeconds()).toEqual(86_400);
    expect(duration.toMinutes()).toEqual(1_440);
    expect(duration.toDays()).toEqual(1);
  });

  testDeprecated('toISOString', () => {
    expect(Duration.millis(0).toISOString()).toEqual('PT0S');
    expect(Duration.seconds(0).toISOString()).toEqual('PT0S');
    expect(Duration.minutes(0).toISOString()).toEqual('PT0S');
    expect(Duration.hours(0).toISOString()).toEqual('PT0S');
    expect(Duration.days(0).toISOString()).toEqual('PT0S');

    expect(Duration.millis(5).toISOString()).toEqual('PT0.005S');
    expect(Duration.seconds(5).toISOString()).toEqual('PT5S');
    expect(Duration.minutes(5).toISOString()).toEqual('PT5M');
    expect(Duration.hours(5).toISOString()).toEqual('PT5H');
    expect(Duration.days(5).toISOString()).toEqual('P5D');

    expect(Duration.seconds(1 + 60 * (1 + 60 * (1 + 24))).toISOString()).toEqual('P1DT1H1M1S');
  });

  test('toIsoString', () => {
    expect(Duration.millis(0).toIsoString()).toEqual('PT0S');
    expect(Duration.seconds(0).toIsoString()).toEqual('PT0S');
    expect(Duration.minutes(0).toIsoString()).toEqual('PT0S');
    expect(Duration.hours(0).toIsoString()).toEqual('PT0S');
    expect(Duration.days(0).toIsoString()).toEqual('PT0S');

    expect(Duration.millis(5).toIsoString()).toEqual('PT0.005S');
    expect(Duration.seconds(5).toIsoString()).toEqual('PT5S');
    expect(Duration.minutes(5).toIsoString()).toEqual('PT5M');
    expect(Duration.hours(5).toIsoString()).toEqual('PT5H');
    expect(Duration.days(5).toIsoString()).toEqual('P5D');

    expect(Duration.seconds(65).toIsoString()).toEqual('PT1M5S');
    expect(Duration.seconds(1 + 60 * (1 + 60 * (1 + 24))).toIsoString()).toEqual('P1DT1H1M1S');
    expect(Duration.millis(1 + (1000 * (1 + 60 * (1 + 60 * (1 + 24))))).toIsoString()).toEqual('P1DT1H1M1.001S');
  });

  test('parse', () => {
    expect(Duration.parse('PT0.000S').toMilliseconds()).toEqual(0);
    expect(Duration.parse('PT0S').toSeconds()).toEqual(0);
    expect(Duration.parse('PT0M').toSeconds()).toEqual(0);
    expect(Duration.parse('PT0H').toSeconds()).toEqual(0);
    expect(Duration.parse('P0D').toSeconds()).toEqual(0);

    expect(Duration.parse('PT0.005S').toMilliseconds()).toEqual(5);
    expect(Duration.parse('PT0.5S').toMilliseconds()).toEqual(500);
    expect(Duration.parse('PT5S').toSeconds()).toEqual(5);
    expect(Duration.parse('PT5M').toSeconds()).toEqual(300);
    expect(Duration.parse('PT5H').toSeconds()).toEqual(18_000);
    expect(Duration.parse('P5D').toSeconds()).toEqual(432_000);

    expect(Duration.parse('P1DT1H1M1S').toSeconds()).toEqual(1 + 60 * (1 + 60 * (1 + 24)));
    expect(Duration.parse('P1DT1H1M1.001S').toMilliseconds()).toEqual(1 + (1000 * (1 + 60 * (1 + 60 * (1 + 24)))));
  });

  test('reject illegal parses', () => {
    const err = 'Not a valid ISO duration';
    expect(() => {
      Duration.parse('PT1D');
    }).toThrow(err);

    expect(() => {
      Duration.parse('P5S');
    }).toThrow(err);
  });

  test('to human string', () => {
    expect(Duration.minutes(0).toHumanString()).toEqual('0 minutes');
    expect(Duration.minutes(Lazy.number({ produce: () => 5 })).toHumanString()).toEqual('<token> minutes');

    expect(Duration.days(1).toHumanString()).toEqual('1 day');
    expect(Duration.hours(1).toHumanString()).toEqual('1 hour');
    expect(Duration.minutes(1).toHumanString()).toEqual('1 minute');
    expect(Duration.seconds(1).toHumanString()).toEqual('1 second');
    expect(Duration.millis(1).toHumanString()).toEqual('1 milli');

    expect(Duration.minutes(10).toHumanString()).toEqual('10 minutes');

    expect(Duration.minutes(62).toHumanString()).toEqual('1 hour 2 minutes');

    expect(Duration.seconds(3666).toHumanString()).toEqual('1 hour 1 minute');

    expect(Duration.millis(3000).toHumanString()).toEqual('3 seconds');
    expect(Duration.millis(3666).toHumanString()).toEqual('3 seconds 666 millis');

    expect(Duration.millis(3.6).toHumanString()).toEqual('3.6 millis');
  });

  test('add two durations', () => {
    expect(Duration.minutes(1).plus(Duration.seconds(30)).toSeconds()).toEqual(Duration.seconds(90).toSeconds());
    expect(Duration.minutes(1).plus(Duration.seconds(30)).toMinutes({ integral: false }))
      .toEqual(Duration.seconds(90).toMinutes({ integral: false }));
  });

  test('subtract two durations', () => {
    expect(Duration.minutes(1).minus(Duration.seconds(30)).toSeconds()).toEqual(Duration.seconds(30).toSeconds());
    expect(Duration.minutes(1).minus(Duration.seconds(30)).toMinutes({ integral: false }))
      .toEqual(Duration.seconds(30).toMinutes({ integral: false }));
  });

  test('get unit label from duration', () => {
    expect(Duration.minutes(Lazy.number({ produce: () => 10 })).unitLabel()).toEqual('minutes');
    expect(Duration.minutes(62).unitLabel()).toEqual('minutes');
    expect(Duration.seconds(10).unitLabel()).toEqual('seconds');
    expect(Duration.millis(1).unitLabel()).toEqual('millis');
    expect(Duration.hours(1000).unitLabel()).toEqual('hours');
    expect(Duration.days(2).unitLabel()).toEqual('days');
  });

  test('format number token to number', () => {
    const stack = new Stack();
    const lazyDuration = Duration.minutes(Lazy.number({ produce: () => 10 }));
    expect(stack.resolve(lazyDuration.formatTokenToNumber())).toEqual('10 minutes');
    expect(Duration.hours(10).formatTokenToNumber()).toEqual('10 hours');
    expect(Duration.days(5).formatTokenToNumber()).toEqual('5 days');
  });

  test('duration is unresolved', () => {
    const lazyDuration = Duration.minutes(Lazy.number({ produce: () => 10 }));
    expect(lazyDuration.isUnresolved()).toEqual(true);
    expect(Duration.hours(10).isUnresolved()).toEqual(false);
  });
});

describe('integral flag checks', () => {
  test('convert fractional minutes to minutes', () => {
    expect(() => {
      Duration.minutes(0.5).toMinutes();
    }).toThrow(/must be a whole number of/);
  });

  test('convert fractional minutes to minutes - integral: false', () => {
    expect(Duration.minutes(5.5).toMinutes({ integral: false })).toEqual(5.5);
  });

  test('convert whole minutes to minutes', () => {
    expect(Duration.minutes(5).toMinutes()).toEqual(5);
  });

  test('convert fractional minutes to fractional seconds', () => {
    expect(() => {
      Duration.minutes(9/8).toSeconds();
    }).toThrow(/cannot be converted into a whole number of/);
  });

  test('convert fractional minutes to fractional seconds - integral: false', () => {
    expect(Duration.minutes(9/8).toSeconds({ integral: false })).toEqual(67.5);
  });

  test('convert fractional minutes to whole seconds', () => {
    expect(Duration.minutes(5/4).toSeconds({ integral: false })).toEqual(75);
  });

  test('convert whole minutes to whole seconds', () => {
    expect(Duration.minutes(10).toSeconds({ integral: false })).toEqual(600);
  });

  test('convert seconds to fractional minutes', () => {
    expect(() => {
      Duration.seconds(45).toMinutes();
    }).toThrow(/cannot be converted into a whole number of/);
  });

  test('convert seconds to fractional minutes - integral: false', () => {
    expect(Duration.seconds(45).toMinutes({ integral: false })).toEqual(0.75);
  });

  test('convert seconds to whole minutes', () => {
    expect(Duration.seconds(120).toMinutes()).toEqual(2);
  });
});

function floatEqual(actual: number, expected: number) {
  expect(
    // Floats are subject to rounding errors up to Number.ESPILON
    actual >= expected - Number.EPSILON && actual <= expected + Number.EPSILON,
  ).toEqual(true);
}
