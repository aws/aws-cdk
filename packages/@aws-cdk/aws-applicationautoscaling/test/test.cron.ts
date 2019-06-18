import { Test } from 'nodeunit';
import appscaling = require('../lib');

export = {
  'test utc cron, hour only'(test: Test) {
    test.equals(appscaling.Schedule.cron({ hour: '18', minute: '0' }).expressionString, 'cron(0 18 * * ? *)');
    test.done();
  },

  'test utc cron, hour and minute'(test: Test) {
    test.equals(appscaling.Schedule.cron({ hour: '18', minute: '24' }).expressionString, 'cron(24 18 * * ? *)');
    test.done();
  }
};