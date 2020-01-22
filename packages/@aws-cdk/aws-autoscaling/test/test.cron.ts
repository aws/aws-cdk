import { Test } from 'nodeunit';
import * as autoscaling from '../lib';

export = {
  'test utc cron, hour only'(test: Test) {
    test.equals(autoscaling.Schedule.cron({ hour: '18', minute: '0' }).expressionString, '0 18 * * *');
    test.done();
  },

  'test utc cron, hour and minute'(test: Test) {
    test.equals(autoscaling.Schedule.cron({ hour: '18', minute: '24' }).expressionString, '24 18 * * *');
    test.done();
  }
};
