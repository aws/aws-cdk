import { Test } from 'nodeunit';
import appscaling = require('../lib');

export = {
  'test utc cron, hour only'(test: Test) {
    test.equals(appscaling.Cron.dailyUtc(18), 'cron(0 18 * * ?)');
    test.done();
  },

  'test utc cron, hour and minute'(test: Test) {
    test.equals(appscaling.Cron.dailyUtc(18, 24), 'cron(24 18 * * ?)');
    test.done();
  }
};