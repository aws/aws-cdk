import { Duration } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as appscaling from '../lib';

export = {
  'test utc cron, hour only'(test: Test) {
    test.equals(appscaling.Schedule.cron({ hour: '18', minute: '0' }).expressionString, 'cron(0 18 * * ? *)');
    test.done();
  },

  'test utc cron, hour and minute'(test: Test) {
    test.equals(appscaling.Schedule.cron({ hour: '18', minute: '24' }).expressionString, 'cron(24 18 * * ? *)');
    test.done();
  },

  'rate must be whole number of minutes'(test: Test) {
    test.throws(() => {
      appscaling.Schedule.rate(Duration.seconds(12345));
    }, /'12345 seconds' cannot be converted into a whole number of minutes/);
    test.done();
  },

  'rate cannot be 0'(test: Test) {
    test.throws(() => {
      appscaling.Schedule.rate(Duration.days(0));
    }, /Duration cannot be 0/);
    test.done();
  },
};
