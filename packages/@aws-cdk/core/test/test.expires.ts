import * as nodeunit from 'nodeunit';
import { Duration, Expires } from '../lib';

export = nodeunit.testCase({
  'from string'(test: nodeunit.Test) {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expires.fromString('Sun, 26 Jan 2020 00:53:20 GMT').date.getDate(), date.getDate());
    test.done();
  },

  'at specified date'(test: nodeunit.Test) {
    const date = new Date('Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expires.atDate(new Date('Sun, 26 Jan 2020 00:53:20 GMT')).value, 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expires.atDate(new Date(1580000000000)).value, 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.equal(Expires.atDate(new Date(date)).value, 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.done();
  },

  'at time stamp'(test: nodeunit.Test) {
    test.equal(Expires.atDate(new Date(1580000000000)).value, 'Sun, 26 Jan 2020 00:53:20 GMT');
    test.done();
  },

  'after'(test: nodeunit.Test) {
    test.ok(Math.abs(new Date(Expires.after(Duration.minutes(10)).value).getTime() - (Date.now() + 600000)) < 15000);
    test.done();
  },

});
