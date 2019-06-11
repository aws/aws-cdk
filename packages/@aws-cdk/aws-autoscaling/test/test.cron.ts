import { Test } from 'nodeunit';
import autoscaling = require('../lib');

export = {
  'test utc cron, hour only'(test: Test) {
    test.equals(autoscaling.Cron.dailyUtc(18), '0 18 * * * *');
    test.done();
  },

  'test utc cron, hour and minute'(test: Test) {
    test.equals(autoscaling.Cron.dailyUtc(18, 24), '24 18 * * * *');
    test.done();
  }
};