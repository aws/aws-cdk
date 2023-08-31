/**
 *  Scheduled Trigger Base Class
 *
 * Schedule triggers are a way for developers to create jobs using cron expressions.
 * We’ll provide daily, weekly, and monthly convenience functions, as well as a custom function
 * that will allow developers to create their own custom timing using the existing
 * event Schedule object without having to build their own cron expressions.
 *
 * The trigger method will take an optional description and list of Actions
 * which can refer to Jobs or crawlers via conditional types.
 *
 */
