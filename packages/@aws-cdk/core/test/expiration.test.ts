import { nodeunitShim, Test } from 'nodeunit-shim';
import { Duration, Expiration } from '../lib';

nodeunitShim({
  'from string'(test: Test) {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expiration.fromString('Sun, 26 Jan 2020 00:53:20 GMT').date.getDate(), date.getDate());
    test.done();
  },

  'at specified date'(test: Test) {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expiration.atDate(new Date('Sun, 26 Jan 2020 00:53:20 GMT')).date.toUTCString(), 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expiration.atDate(new Date(1580000000000)).date.toUTCString(), 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expiration.atDate(new Date(date)).date.toUTCString(), 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.done();
  },

  'at time stamp'(test: Test) {
    test.equal(Expiration.atDate(new Date(1580000000000)).date.toUTCString(), 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.done();
  },

  'after'(test: Test) {
    test.ok(Math.abs(new Date(Expiration.after(Duration.minutes(10)).date.toUTCString()).getTime() - (Date.now() + 600000)) < 15000);
    test.done();
  },

  'toEpoch returns correct value'(test: Test) {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expiration.atDate(date).toEpoch(), 1580000000);
    test.done();
  },

  'isBefore'(test: Test) {
    const expire = Expiration.after(Duration.days(2));
    test.ok(!expire.isBefore(Duration.days(1)));
    test.ok(expire.isBefore(Duration.days(3)));
    test.done();
  },

  'isAfter'(test: Test) {
    const expire = Expiration.after(Duration.days(2));
    test.ok(expire.isAfter(Duration.days(1)));
    test.ok(!expire.isAfter(Duration.days(3)));
    test.done();
  },

});
