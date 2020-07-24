import * as nodeunit from 'nodeunit';
import { BaseSchedule, CronOptions, Duration } from '../lib';

abstract class TestSchedule extends BaseSchedule {
  public static expression(expression: string){
    return super.createExpression(expression);
  }
  public static rate(duration: Duration) {
    return super.createRate(duration);
  }
  public static cron(options: CronOptions, unix?: boolean) {
    return super.createCron(options, unix);
  }
  public static at(moment: Date) {
    return super.createAt(moment);
  }
}

export = nodeunit.testCase({
  'createExpression works'(test: nodeunit.Test) {
    test.equal(TestSchedule.expression('rate(1 hour)').expressionString, 'rate(1 hour)');
    test.done();
  },
  'createRate works'(test: nodeunit.Test) {
    test.equal(TestSchedule.rate(Duration.hours(3)).expressionString, 'rate(3 hours)');
    test.done();
  },
  'createRate fails with duration of 0'(test: nodeunit.Test) {
    test.throws(() => TestSchedule.rate(Duration.hours(0)), /Duration cannot be 0/);
    test.done();
  },
  'createCron works'(test: nodeunit.Test) {
    test.equals(TestSchedule.cron({ hour: '18', minute: '24' }).expressionString, 'cron(24 18 * * ? *)');
    test.done();
  },
  'createCron works with UNIX format'(test: nodeunit.Test) {
    test.equals(TestSchedule.cron({ hour: '18', minute: '24' }, true).expressionString, '24 18 * * *');
    test.done();
  },
  'createCron fails when both days and weekdays supplied'(test: nodeunit.Test) {
    test.throws(() => TestSchedule.cron({ day: '4', weekDay: '3'}), /Cannot supply both \'day\' and \'weekDay\', use at most one/);
    test.done();
  },
  'createAt works'(test: nodeunit.Test) {
    test.equals(TestSchedule.at(new Date('2020-01-01')).expressionString, 'at(2020-01-01T00:00:00)');
    test.done();
  },
});