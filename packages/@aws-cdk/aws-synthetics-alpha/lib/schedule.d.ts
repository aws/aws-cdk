import { Duration } from 'aws-cdk-lib/core';
/**
 * Schedule for canary runs
 */
export declare class Schedule {
    /**
     * The Schedule expression
     */
    readonly expressionString: string;
    /**
     * The canary will be executed once.
     */
    static once(): Schedule;
    /**
     * Construct a schedule from a literal schedule expression. The expression must be in a `rate(number units)` format.
     * For example, `Schedule.expression('rate(10 minutes)')`
     *
     * @param expression The expression to use.
     */
    static expression(expression: string): Schedule;
    /**
     * Construct a schedule from an interval. Allowed values: 0 (for a single run) or between 1 and 60 minutes.
     * To specify a single run, you can use `Schedule.once()`.
     *
     * @param interval The interval at which to run the canary
     */
    static rate(interval: Duration): Schedule;
    /**
     * Create a schedule from a set of cron fields
     */
    static cron(options: CronOptions): Schedule;
    private constructor();
}
/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_cron.html
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
     * The day of the week to run this rule at
     *
     * @default - Any day of the week
     */
    readonly weekDay?: string;
}
