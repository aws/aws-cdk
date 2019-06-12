import { Test } from 'nodeunit';
import events = require('../lib');

export = {
  'cron expressions day and dow are mutex: given weekday'(test: Test) {
    // Run every 10 minutes Monday through Friday
    test.equal('cron(0/10 * ? * MON-FRI *)', events.Schedule.fromCron({
      minute: '0/10',
      weekDay: 'MON-FRI'
    }).expression);
    test.done();
  },

  'cron expressions day and dow are mutex: given month day'(test: Test) {
    // Run at 8:00 am (UTC) every 1st day of the month
    test.equal('cron(0 8 1 * ? *)', events.Schedule.fromCron({
      minute: '0',
      hour: '8',
      day: '1',
    }).expression);
    test.done();
  },

  'cron expressions day and dow are mutex: given neither'(test: Test) {
    // Run at 10:00 am (UTC) every day
    test.equal('cron(0 10 * * ? *)', events.Schedule.fromCron({
      minute: '0',
      hour: '10',
    }).expression);
    test.done();
  },
};
