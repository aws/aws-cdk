import { Resource } from 'aws-cdk-lib';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { ISchedule } from '../schedule';
import { ScheduleExpression } from '../schedule-expression';

/**
 * DISCLAIMER: WORK IN PROGRESS, INTERFACE MIGHT CHANGE
 *
 * This unit is not yet finished. Only rudimentary Schedule is implemented in order
 * to be able to create some sensible unit tests
 */

export interface IScheduleTarget {
  bind(_schedule: ISchedule): CfnSchedule.TargetProperty;
}

/**
 * Construction properties for `Schedule`.
 */
export interface ScheduleProps {
  /**
   * The expression that defines when the schedule runs. Can be either a `at`, `rate`
   * or `cron` expression.
   */
  readonly schedule: ScheduleExpression;

  /**
   * The schedule's target details.
   */
  readonly target: IScheduleTarget;

  /**
   * The description you specify for the schedule.
   *
   * @default - no value
   */
  readonly description?: string;
}

/**
 * An EventBridge Schedule
 */
export class Schedule extends Resource implements ISchedule {
  constructor(scope: Construct, id: string, props: ScheduleProps) {
    super(scope, id);

    new CfnSchedule(this, 'Resource', {
      flexibleTimeWindow: { mode: 'OFF' },
      scheduleExpression: props.schedule.expressionString,
      scheduleExpressionTimezone: props.schedule.timeZone?.timezoneName,
      target: {
        ...props.target.bind(this),
      },
    });
  }
}