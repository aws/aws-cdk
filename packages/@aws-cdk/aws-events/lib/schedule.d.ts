import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Schedule for scheduled event rules
 *
 * Note that rates cannot be defined in fractions of minutes.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html
 */
export declare abstract class Schedule {
    /**
     * Construct a schedule from a literal schedule expression
     *
     * @param expression The expression to use. Must be in a format that EventBridge will recognize
     */
    static expression(expression: string): Schedule;
    /**
     * Construct a schedule from an interval and a time unit
     *
     * Rates may be defined with any unit of time, but when converted into minutes, the duration must be a positive whole number of minutes.
     */
    static rate(duration: Duration): Schedule;
    /**
     * Create a schedule from a set of cron fields
     */
    static cron(options: CronOptions): Schedule;
    /**
     * Retrieve the expression for this schedule
     */
    abstract readonly expressionString: string;
    protected constructor();
    /**
     *
     * @internal
     */
    abstract _bind(scope: Construct): void;
}
/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html#cron-expressions
 */
export interface CronOptions {
    /**
     * The minute to run this rule at
     *
     * @default - Every minute
     */
    readonly minute?: string;
    /**
     * The hour to run this rule at
     *
     * @default - Every hour
     */
    readonly hour?: string;
    /**
     * The day of the month to run this rule at
     *
     * @default - Every day of the month
     */
    readonly day?: string;
    /**
     * The month to run this rule at
     *
     * @default - Every month
     */
    readonly month?: string;
    /**
     * The year to run this rule at
     *
     * @default - Every year
     */
    readonly year?: string;
    /**
     * The day of the week to run this rule at
     *
     * @default - Any day of the week
     */
    readonly weekDay?: string;
}
