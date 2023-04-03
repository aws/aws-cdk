import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
import { Schedule } from './schedule';
/**
 * Properties for a scheduled scaling action
 */
export interface BasicScheduledActionProps {
    /**
     * Specifies the time zone for a cron expression. If a time zone is not provided, UTC is used by default.
     *
     * Valid values are the canonical names of the IANA time zones, derived from the IANA Time Zone Database (such as Etc/GMT+9 or Pacific/Tahiti).
     *
     * For more information, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
     *
     * @default - UTC
     *
     */
    readonly timeZone?: string;
    /**
     * When to perform this action.
     *
     * Supports cron expressions.
     *
     * For more information about cron expressions, see https://en.wikipedia.org/wiki/Cron.
     */
    readonly schedule: Schedule;
    /**
     * When this scheduled action becomes active.
     *
     * @default - The rule is activate immediately.
     */
    readonly startTime?: Date;
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
export declare class ScheduledAction extends Resource {
    /**
     * The name of the scheduled action.
     *
     * @attribute
     */
    readonly scheduledActionName: string;
    constructor(scope: Construct, id: string, props: ScheduledActionProps);
}
