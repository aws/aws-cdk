import { Construct } from 'constructs';
import { Annotations, CronOptions as CoreCronOptions, Schedule as CoreSchedule, TimeZone } from '../../core';

/**
 * Schedule for scheduled scaling actions
 */
export abstract class Schedule extends CoreSchedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that AutoScaling will recognize
   * @see http://crontab.org/
   */
  public static expression(expression: string, timeZone?: TimeZone): Schedule {
    return super.protectedExpression(expression, timeZone);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  public static cron(options: CoreCronOptions): Schedule {
    const cron = super.protectedCron({
      weekDay: '*', // to override core.Schedule's default
      day: '*', // to override core.Schedule's default
      ...options,
    });
    const cronSplit = cron.expressionString.slice(5).split(' '); // remove "cron(" from start
    cronSplit.pop(); // remove year, since autoscaling does not accept it
    const autoscalingCron = cronSplit.join(' ');

    return new class extends Schedule {
      public readonly expressionString = autoscalingCron;
      public readonly timeZone = options.timeZone;
      public _bind(scope: Construct) {
        if (!options.minute) {
          Annotations.of(scope).addWarningV2('@aws-cdk/aws-autoscaling:scheduleDefaultRunsEveryMinute', 'cron: If you don\'t pass \'minute\', by default the event runs every minute. Pass \'minute: \'*\'\' if that\'s what you intend, or \'minute: 0\' to run once per hour instead.');
        }
        return Schedule.expression(this.expressionString, this.timeZone);
      }
    };
  }
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see http://crontab.org/
 * @deprecated use core.CronOptions
 */
export interface CronOptions extends CoreCronOptions {}
