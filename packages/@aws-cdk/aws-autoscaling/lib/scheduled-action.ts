import { Construct, Resource } from '@aws-cdk/cdk';
import { IAutoScalingGroup } from './auto-scaling-group';
import { CfnScheduledAction } from './autoscaling.generated';

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
  readonly schedule: string;

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

const CRON_MINUTES = `(\\*|([0-9]|[1-4][0-9]|5[0-9])|((([0-9]|[1-4][0-9]|5[0-9]))
(\\,|\\/|\\-)(([0-9]|[1-4][0-9]|5[0-9]))))`;
const CRON_HOURS = `(\\*|([0-9]|1[0-9]|2[0-3])|
((([0-9]|1[0-9]|2[0-3]))(\\,|\\/|\\-)(([0-9]|1[0-9]|2[0-3]))))`;
const CRON_DAY_OF_MONTH = `(\\*|\\?|L|([0-9]|1[0-9]|2[0-3])?W|
([1-9]|[12][0-9]|3[01])|((([1-9]|[12][0-9]|3[01]))(\\,|\\/|\\-)(([1-9]|[12][0-9]|3[01]))))`;
const CRON_MONTH = `(\\*|([1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|
(([1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)
(\\,|\\/|\\-)([1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)))`;
const CRON_DAY_OF_WEEK = `(\\*|\\?|L|[1-7]\\#[1-9]|
([1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)|(([1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)
(\\,|\\-)([1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)))`;
const CRON_YEAR = `(\\*|(19[78][0-9]|199[0-9]|20[0-9]{2}|21[0-8][0-9]|219[0-9])|
(((19[78][0-9]|199[0-9]|20[0-9]{2}|21[0-8][0-9]|219[0-9]))(\\,|\\/|\\-)
((19[78][0-9]|199[0-9]|20[0-9]{2}|21[0-8][0-9]|219[0-9]))))`;

const CRON_EXPRESSION = new RegExp('^' +
  [
    CRON_MINUTES, CRON_HOURS, CRON_DAY_OF_MONTH, CRON_MONTH, CRON_DAY_OF_WEEK, CRON_YEAR
  ]
.join('\\s+') + '$');

/**
 * Define a scheduled scaling action
 */
export class ScheduledAction extends Resource {
  constructor(scope: Construct, id: string, props: ScheduledActionProps) {
    super(scope, id);

    if (!CRON_EXPRESSION.exec(props.schedule)) {
      throw new Error(`Input to ScheduledAction should be a cron expression, got: ${props.schedule}`);
    }

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