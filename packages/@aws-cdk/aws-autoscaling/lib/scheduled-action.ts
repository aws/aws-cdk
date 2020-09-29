import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
import { CfnScheduledAction } from './autoscaling.generated';
import { Schedule } from './schedule';

/**
 * Properties for a scheduled scaling action
 */
export interface BasicScheduledActionProps {
  /**
   * When to perform this action.
   *
   * Supports cron expressions.
   *
   * For more information about cron expressions, see https://en.wikipedia.org/wiki/Cron.
   *
   * @example 0 8 * * ?
   */
  readonly schedule: Schedule;

  /**
   * When this scheduled action becomes active.
   *
   * @default - The rule is activate immediately.
   */
  readonly startTime?: Date

  /**
   * When this scheduled action expires.
   *
   * @default - The rule never expires.
   */
  readonly endTime?: Date;

  /**
   * The new minimum capacity.
   *
   * At the scheduled time, set the minimum capacity to the given capacity.
   *
   * At least one of maxCapacity, minCapacity, or desiredCapacity must be supplied.
   *
   * @default - No new minimum capacity.
   */
  readonly minCapacity?: number;

  /**
   * The new maximum capacity.
   *
   * At the scheduled time, set the maximum capacity to the given capacity.
   *
   * At least one of maxCapacity, minCapacity, or desiredCapacity must be supplied.
   *
   * @default - No new maximum capacity.
   */
  readonly maxCapacity?: number;

  /**
   * The new desired capacity.
   *
   * At the scheduled time, set the desired capacity to the given capacity.
   *
   * At least one of maxCapacity, minCapacity, or desiredCapacity must be supplied.
   *
   * @default - No new desired capacity.
   */
  readonly desiredCapacity?: number;
}

/**
 * Properties for a scheduled action on an AutoScalingGroup
 */
export interface ScheduledActionProps extends BasicScheduledActionProps {
  /**
   * The AutoScalingGroup to apply the scheduled actions to
   */
  readonly autoScalingGroup: IAutoScalingGroup;
}

/**
 * Define a scheduled scaling action
 */
export class ScheduledAction extends Resource {
  constructor(scope: Construct, id: string, props: ScheduledActionProps) {
    super(scope, id);

    if (props.minCapacity === undefined && props.maxCapacity === undefined && props.desiredCapacity === undefined) {
      throw new Error('At least one of minCapacity, maxCapacity, or desiredCapacity is required');
    }

    new CfnScheduledAction(this, 'Resource', {
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      startTime: formatISO(props.startTime),
      endTime: formatISO(props.endTime),
      minSize: props.minCapacity,
      maxSize: props.maxCapacity,
      desiredCapacity: props.desiredCapacity,
      recurrence: props.schedule.expressionString,
    });
  }
}

function formatISO(date?: Date) {
  if (!date) { return undefined; }

  return date.getUTCFullYear() +
    '-' + pad(date.getUTCMonth() + 1) +
    '-' + pad(date.getUTCDate()) +
    'T' + pad(date.getUTCHours()) +
    ':' + pad(date.getUTCMinutes()) +
    ':' + pad(date.getUTCSeconds()) +
    'Z';

  function pad(num: number) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }
}