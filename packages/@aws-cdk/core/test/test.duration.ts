import * as nodeunit from 'nodeunit';
import { Duration, Lazy, Stack, Token } from '../lib';

export = nodeunit.testCase({
  'negative amount'(test: nodeunit.Test) {
    test.throws(() => Duration.seconds(-1), /negative/);

    test.done();
  },

  'unresolved amount'(test: nodeunit.Test) {
    const stack = new Stack();
    const lazyDuration = Duration.seconds(Token.asNumber({ resolve: () => 1337 }));
    test.equals(stack.resolve(lazyDuration.toSeconds()), 1337);
    test.throws(
      () => stack.resolve(lazyDuration.toMinutes()),
      /Unable to perform time unit conversion on un-resolved token/,
    );

    test.done();
  },

  'Duration in seconds'(test: nodeunit.Test) {
    const duration = Duration.seconds(300);

    test.equal(duration.toSeconds(), 300);
    test.equal(duration.toMinutes(), 5);
    test.throws(() => duration.toDays(), /'300 seconds' cannot be converted into a whole number of days/);
    floatEqual(test, duration.toDays({ integral: false }), 300 / 86_400);

    test.equal(Duration.seconds(60 * 60 * 24).toDays(), 1);

    test.done();
  },

  'Duration in minutes'(test: nodeunit.Test) {
    const duration = Duration.minutes(5);

    test.equal(duration.toSeconds(), 300);
    test.equal(duration.toMinutes(), 5);
    test.throws(() => duration.toDays(), /'5 minutes' cannot be converted into a whole number of days/);
    floatEqual(test, duration.toDays({ integral: false }), 300 / 86_400);

    test.equal(Duration.minutes(60 * 24).toDays(), 1);

    test.done();
  },

  'Duration in hours'(test: nodeunit.Test) {
    const duration = Duration.hours(5);

    test.equal(duration.toSeconds(), 18_000);
    test.equal(duration.toMinutes(), 300);
    test.throws(() => duration.toDays(), /'5 hours' cannot be converted into a whole number of days/);
    floatEqual(test, duration.toDays({ integral: false }), 5 / 24);

    test.equal(Duration.hours(24).toDays(), 1);

    test.done();
  },

  'seconds to milliseconds'(test: nodeunit.Test) {
    const duration = Duration.seconds(5);

    test.equal(duration.toMilliseconds(), 5_000);

    test.done();
  },

  'Duration in days'(test: nodeunit.Test) {
    const duration = Duration.days(1);

    test.equal(duration.toSeconds(), 86_400);
    test.equal(duration.toMinutes(), 1_440);
    test.equal(duration.toDays(), 1);

    test.done();
  },

  'toISOString'(test: nodeunit.Test) {
    test.equal(Duration.millis(0).toISOString(), 'PT0S');
    test.equal(Duration.seconds(0).toISOString(), 'PT0S');
    test.equal(Duration.minutes(0).toISOString(), 'PT0S');
    test.equal(Duration.hours(0).toISOString(), 'PT0S');
    test.equal(Duration.days(0).toISOString(), 'PT0S');

    test.equal(Duration.millis(5).toISOString(), 'PT0.005S');
    test.equal(Duration.seconds(5).toISOString(), 'PT5S');
    test.equal(Duration.minutes(5).toISOString(), 'PT5M');
    test.equal(Duration.hours(5).toISOString(), 'PT5H');
    test.equal(Duration.days(5).toISOString(), 'PT5D');

    test.equal(Duration.seconds(1 + 60 * (1 + 60 * (1 + 24))).toISOString(), 'PT1D1H1M1S');

    test.done();
  },

  'toIsoString'(test: nodeunit.Test) {
    test.equal(Duration.millis(0).toIsoString(), 'PT0S');
    test.equal(Duration.seconds(0).toIsoString(), 'PT0S');
    test.equal(Duration.minutes(0).toIsoString(), 'PT0S');
    test.equal(Duration.hours(0).toIsoString(), 'PT0S');
    test.equal(Duration.days(0).toIsoString(), 'PT0S');

    test.equal(Duration.millis(5).toIsoString(), 'PT0.005S');
    test.equal(Duration.seconds(5).toIsoString(), 'PT5S');
    test.equal(Duration.minutes(5).toIsoString(), 'PT5M');
    test.equal(Duration.hours(5).toIsoString(), 'PT5H');
    test.equal(Duration.days(5).toIsoString(), 'PT5D');

    test.equal(Duration.seconds(1 + 60 * (1 + 60 * (1 + 24))).toIsoString(), 'PT1D1H1M1S');

    test.done();
  },

  'parse'(test: nodeunit.Test) {
    test.equal(Duration.parse('PT0S').toSeconds(), 0);
    test.equal(Duration.parse('PT0M').toSeconds(), 0);
    test.equal(Duration.parse('PT0H').toSeconds(), 0);
    test.equal(Duration.parse('PT0D').toSeconds(), 0);

    test.equal(Duration.parse('PT5S').toSeconds(), 5);
    test.equal(Duration.parse('PT5M').toSeconds(), 300);
    test.equal(Duration.parse('PT5H').toSeconds(), 18_000);
    test.equal(Duration.parse('PT5D').toSeconds(), 432_000);

    test.equal(Duration.parse('PT1D1H1M1S').toSeconds(), 1 + 60 * (1 + 60 * (1 + 24)));

    test.done();
  },

  'to human string'(test: nodeunit.Test) {
    test.equal(Duration.minutes(0).toHumanString(), '0 minutes');
    test.equal(Duration.minutes(Lazy.numberValue({ produce: () => 5 })).toHumanString(), '<token> minutes');

    test.equal(Duration.minutes(10).toHumanString(), '10 minutes');
    test.equal(Duration.minutes(1).toHumanString(), '1 minute');

    test.equal(Duration.minutes(62).toHumanString(), '1 hour 2 minutes');

    test.equal(Duration.seconds(3666).toHumanString(), '1 hour 1 minute');

    test.equal(Duration.millis(3000).toHumanString(), '3 seconds');
    test.equal(Duration.millis(3666).toHumanString(), '3 seconds 666 millis');

    test.equal(Duration.millis(3.6).toHumanString(), '3.6 millis');

    test.done();
  },

  'add two durations'(test: nodeunit.Test) {
    test.equal(Duration.minutes(1).plus(Duration.seconds(30)).toSeconds(), Duration.seconds(90).toSeconds());
    test.equal(Duration.minutes(1).plus(Duration.seconds(30)).toMinutes({ integral: false }), Duration.seconds(90).toMinutes({ integral: false }));

    test.done();
  },
});

function floatEqual(test: nodeunit.Test, actual: number, expected: number) {
  test.ok(
    // Floats are subject to rounding errors up to Number.ESPILON
    actual >= expected - Number.EPSILON && actual <= expected + Number.EPSILON,
    `${actual} == ${expected}`,
  );
}
