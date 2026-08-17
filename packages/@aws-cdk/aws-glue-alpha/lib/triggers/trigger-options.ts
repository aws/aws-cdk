import * as events from 'aws-cdk-lib/aws-events';
import type { CfnTrigger, ICrawlerRef, IJobRef } from 'aws-cdk-lib/aws-glue';
import type * as cdk from 'aws-cdk-lib/core';
import { ConditionLogicalOperator } from '../constants';
import type { JobState, CrawlerState, PredicateLogical } from '../constants';
import type { ISecurityConfiguration } from '../security-configuration';

/**
 * Options shared by all trigger actions, regardless of whether they run a job
 * or a crawler.
 */
export interface ActionOptions {
  /**
   * The arguments used when this trigger fires.
   *
   * @default - no arguments are passed to the job
   */
  readonly arguments?: { [key: string]: string };

  /**
   * The run timeout. This is the maximum time that a run can consume resources before it is terminated and enters TIMEOUT status.
   *
   * @default - the default timeout value set in the job definition
   */
  readonly timeout?: cdk.Duration;

  /**
   * The `SecurityConfiguration` to be used with this action.
   *
   * @default - no security configuration is used
   */
  readonly securityConfiguration?: ISecurityConfiguration;
}

/**
 * An action initiated by a trigger.
 *
 * An action runs exactly one target: use {@link Action.job} to run a job or
 * {@link Action.crawler} to run a crawler. Because these are separate factory
 * methods, an action can never target both or neither.
 */
export abstract class Action {
  /**
   * Create an action that runs a job.
   *
   * @param job the job to run when the trigger fires.
   * @param options additional options for the action.
   */
  public static job(job: IJobRef, options: ActionOptions = {}): Action {
    return new JobAction(job, options);
  }

  /**
   * Create an action that runs a crawler.
   *
   * @param crawler the crawler to run when the trigger fires.
   * @param options additional options for the action.
   */
  public static crawler(crawler: ICrawlerRef, options: ActionOptions = {}): Action {
    return new CrawlerAction(crawler, options);
  }

  /**
   * Render this action to its CloudFormation representation.
   *
   * @internal
   */
  public abstract _render(): CfnTrigger.ActionProperty;
}

/**
 * An action that runs a job.
 */
class JobAction extends Action {
  constructor(private readonly job: IJobRef, private readonly options: ActionOptions) {
    super();
  }

  public _render(): CfnTrigger.ActionProperty {
    return {
      jobName: this.job.jobRef.jobName,
      arguments: this.options.arguments,
      timeout: this.options.timeout?.toMinutes(),
      securityConfiguration: this.options.securityConfiguration?.securityConfigurationName,
    };
  }
}

/**
 * An action that runs a crawler.
 */
class CrawlerAction extends Action {
  constructor(private readonly crawler: ICrawlerRef, private readonly options: ActionOptions) {
    super();
  }

  public _render(): CfnTrigger.ActionProperty {
    return {
      crawlerName: this.crawler.crawlerRef.crawlerName,
      arguments: this.options.arguments,
      timeout: this.options.timeout?.toMinutes(),
      securityConfiguration: this.options.securityConfiguration?.securityConfigurationName,
    };
  }
}

/**
 * Represents a trigger schedule.
 */
export class TriggerSchedule {
  /**
   * Creates a new TriggerSchedule instance with a cron expression.
   *
   * @param options The cron options for the schedule.
   * @returns A new TriggerSchedule instance.
   */
  public static cron(options: events.CronOptions): TriggerSchedule {
    return new TriggerSchedule(events.Schedule.cron(options).expressionString);
  }

  /**
   * Creates a new TriggerSchedule instance with a custom expression.
   *
   * @param expression The custom expression for the schedule.
   * @returns A new TriggerSchedule instance.
   */
  public static expression(expression: string): TriggerSchedule {
    return new TriggerSchedule(expression);
  }

  /**
   * @param expressionString The expression string for the schedule.
   */
  private constructor(public readonly expressionString: string) {}
}

/**
 * Represents a trigger predicate.
 */
export interface Predicate {
  /**
   * The logical operator to be applied to the conditions.
   *
   * @default - ConditionLogical.AND if multiple conditions are provided, no logical operator if only one condition
   */
  readonly logical?: PredicateLogical;

  /**
   * A list of the conditions that determine when the trigger will fire.
   *
   * @default - no conditions are provided
   */
  readonly conditions?: Condition[];
}

/**
 * Options shared by all trigger conditions.
 */
export interface ConditionOptions {
  /**
   * The logical operator for the condition.
   *
   * @default ConditionLogicalOperator.EQUALS
   */
  readonly logicalOperator?: ConditionLogicalOperator;
}

/**
 * A condition that determines when a conditional trigger fires.
 *
 * A condition watches exactly one target in exactly one state: use
 * {@link Condition.job} to watch a job or {@link Condition.crawler} to watch a
 * crawler. Because the state is a required argument of each factory, a condition
 * can never reference a target without its state, or both a job and a crawler.
 */
export abstract class Condition {
  /**
   * Create a condition on the state of a job.
   *
   * @param job the job to watch.
   * @param state the job state that satisfies the condition.
   * @param options additional options for the condition.
   */
  public static job(job: IJobRef, state: JobState, options: ConditionOptions = {}): Condition {
    return new JobCondition(job, state, options);
  }

  /**
   * Create a condition on the state of a crawler.
   *
   * @param crawler the crawler to watch.
   * @param crawlState the crawler state that satisfies the condition.
   * @param options additional options for the condition.
   */
  public static crawler(crawler: ICrawlerRef, crawlState: CrawlerState, options: ConditionOptions = {}): Condition {
    return new CrawlerCondition(crawler, crawlState, options);
  }

  /**
   * Render this condition to its CloudFormation representation.
   *
   * @internal
   */
  public abstract _render(): CfnTrigger.ConditionProperty;
}

/**
 * A condition on the state of a job.
 */
class JobCondition extends Condition {
  constructor(
    private readonly job: IJobRef,
    private readonly state: JobState,
    private readonly options: ConditionOptions,
  ) {
    super();
  }

  public _render(): CfnTrigger.ConditionProperty {
    return {
      logicalOperator: this.options.logicalOperator ?? ConditionLogicalOperator.EQUALS,
      jobName: this.job.jobRef.jobName,
      state: this.state,
    };
  }
}

/**
 * A condition on the state of a crawler.
 */
class CrawlerCondition extends Condition {
  constructor(
    private readonly crawler: ICrawlerRef,
    private readonly crawlState: CrawlerState,
    private readonly options: ConditionOptions,
  ) {
    super();
  }

  public _render(): CfnTrigger.ConditionProperty {
    return {
      logicalOperator: this.options.logicalOperator ?? ConditionLogicalOperator.EQUALS,
      crawlerName: this.crawler.crawlerRef.crawlerName,
      crawlState: this.crawlState,
    };
  }
}

/**
 * Represents event trigger batch condition.
 */
export interface EventBatchingCondition {
  /**
   * Number of events that must be received from Amazon EventBridge before EventBridge event trigger fires.
   */
  readonly batchSize: number;

  /**
   * Window of time in seconds after which EventBridge event trigger fires.
   *
   * @default - 900 seconds
   */
  readonly batchWindow?: cdk.Duration;
}

/**
 * Properties for configuring a Glue Trigger
 */
export interface TriggerOptions {
  /**
   * A name for the trigger.
   *
   * @default - no name is provided
   */
  readonly name?: string;

  /**
   * A description for the trigger.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The actions initiated by this trigger.
   */
  readonly actions: Action[];
}

/**
 * Properties for configuring an on-demand Glue Trigger.
 */
export interface OnDemandTriggerOptions extends TriggerOptions {}

/**
 * Properties for configuring a daily-scheduled Glue Trigger.
 */
export interface DailyScheduleTriggerOptions extends TriggerOptions {
  /**
   * Whether to start the trigger on creation or not.
   *
   * @default - false
   */
  readonly startOnCreation?: boolean;
}

/**
 * Properties for configuring a weekly-scheduled Glue Trigger.
 */
export interface WeeklyScheduleTriggerOptions extends DailyScheduleTriggerOptions {}

/**
 * Properties for configuring a custom-scheduled Glue Trigger.
 */
export interface CustomScheduledTriggerOptions extends WeeklyScheduleTriggerOptions {
  /**
   * The custom schedule for the trigger.
   */
  readonly schedule: TriggerSchedule;
}

/**
 * Properties for configuring an Event Bridge based Glue Trigger.
 */
export interface NotifyEventTriggerOptions extends TriggerOptions {
  /**
   * Batch condition for the trigger.
   *
   * @default - no batch condition
   */
  readonly eventBatchingCondition?: EventBatchingCondition;
}

/**
 * Properties for configuring a Condition (Predicate) based Glue Trigger.
 */
export interface ConditionalTriggerOptions extends DailyScheduleTriggerOptions{
  /**
   * The predicate for the trigger.
   */
  readonly predicate: Predicate;
}
