import { Resource } from 'aws-cdk-lib';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { IGroup } from '../group';
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

  /**
   * The schedule's group.
   *
   * @deafult - By default a schedule will be associated with the `default` group.
   */
  readonly group?: IGroup;
}

/**
 * An EventBridge Schedule
 */
export class Schedule extends Resource implements ISchedule {
  public readonly group?: IGroup;

  constructor(scope: Construct, id: string, props: ScheduleProps) {
    super(scope, id);

    this.group = props.group;

    new CfnSchedule(this, 'Resource', {
      flexibleTimeWindow: { mode: 'OFF' },
      scheduleExpression: props.schedule.expressionString,
      scheduleExpressionTimezone: props.schedule.timeZone?.timezoneName,
      groupName: this.group?.groupName,
      target: {
        ...props.target.bind(this),
      },
    });
  }
}