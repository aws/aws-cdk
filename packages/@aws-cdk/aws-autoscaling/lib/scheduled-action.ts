import cdk = require('@aws-cdk/cdk');
import { IAutoScalingGroup } from './auto-scaling-group';

import { cloudformation } from './autoscaling.generated';

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
  schedule: string;

  /**
   * When this scheduled action becomes active.
   *
   * @default The rule is activate immediately
   */
  startTime?: Date

  /**
   * When this scheduled action expires.
   *
   * @default The rule never expires.
   */
  endTime?: Date;

  /**
   * The new minimum capacity.
   *
   * At the scheduled time, set the minimum capacity to the given capacity.
   *
   * At least one of maxCapacity, minCapacity, or desiredCapacity must be supplied.
   *
   * @default No new minimum capacity
   */
  minCapacity?: number;

  /**
   * The new maximum capacity.
   *
   * At the scheduled time, set the maximum capacity to the given capacity.
   *
   * At least one of maxCapacity, minCapacity, or desiredCapacity must be supplied.
   *
   * @default No new maximum capacity
   */
  maxCapacity?: number;

  /**
   * The new desired capacity.
   *
   * At the scheduled time, set the desired capacity to the given capacity.
   *
   * At least one of maxCapacity, minCapacity, or desiredCapacity must be supplied.
   */
  desiredCapacity?: number;
}

/**
 * Properties for a scheduled action on an AutoScalingGroup
 */
export interface ScheduledActionProps extends BasicScheduledActionProps {
  /**
   * The AutoScalingGroup to apply the scheduled actions to
   */
  autoScalingGroup: IAutoScalingGroup;
}

const CRON_PART = '(\\*|\\?|[0-9]+)';

const CRON_EXPRESSION = new RegExp('^' + [CRON_PART, CRON_PART, CRON_PART, CRON_PART, CRON_PART].join('\\s+') + '$');

/**
 * Define a scheduled scaling action
 */
export class ScheduledAction extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: ScheduledActionProps) {
    super(parent, id);

    if (!CRON_EXPRESSION.exec(props.schedule)) {
      throw new Error(`Input to ScheduledAction should be a cron expression, got: ${props.schedule}`);
    }

    if (props.minCapacity === undefined && props.maxCapacity === undefined && props.desiredCapacity === undefined) {
      throw new Error('At least one of minCapacity, maxCapacity, or desiredCapacity is required');
    }

    new cloudformation.ScheduledActionResource(this, 'Resource', {
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      startTime: formatISO(props.startTime),
      endTime: formatISO(props.endTime),
      minSize: props.minCapacity,
      maxSize: props.maxCapacity,
      desiredCapacity: props.desiredCapacity,
      recurrence: props.schedule,
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