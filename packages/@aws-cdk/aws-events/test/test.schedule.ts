import { Duration } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as events from '../lib';

export = {
  'cron expressions day and dow are mutex: given weekday'(test: Test) {
    // Run every 10 minutes Monday through Friday
    test.equal('cron(0/10 * ? * MON-FRI *)', events.Schedule.cron({
      minute: '0/10',
      weekDay: 'MON-FRI'
    }).expressionString);
    test.done();
  },

  'cron expressions day and dow are mutex: given month day'(test: Test) {
    // Run at 8:00 am (UTC) every 1st day of the month
    test.equal('cron(0 8 1 * ? *)', events.Schedule.cron({
      minute: '0',
      hour: '8',
      day: '1',
    }).expressionString);
    test.done();
  },

  'cron expressions day and dow are mutex: given neither'(test: Test) {
    // Run at 10:00 am (UTC) every day
    test.equal('cron(0 10 * * ? *)', events.Schedule.cron({
      minute: '0',
      hour: '10',
    }).expressionString);
    test.done();
  },

  'rate must be whole number of minutes'(test: Test) {
    test.throws(() => {
      events.Schedule.rate(Duration.seconds(12345));
    }, /'12345 seconds' cannot be converted into a whole number of minutes/);
    test.done();
  },

  'rate cannot be 0'(test: Test) {
    test.throws(() => {
      events.Schedule.rate(Duration.days(0));
    }, /Duration cannot be 0/);
    test.done();
  },
};
