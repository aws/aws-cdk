import { Construct } from 'constructs';
/**
 * Schedule for scheduled scaling actions
 */
export declare abstract class Schedule {
    /**
     * Construct a schedule from a literal schedule expression
     *
     * @param expression The expression to use. Must be in a format that AutoScaling will recognize
     * @see http://crontab.org/
     */
    static expression(expression: string): Schedule;
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
 * @see http://crontab.org/
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
