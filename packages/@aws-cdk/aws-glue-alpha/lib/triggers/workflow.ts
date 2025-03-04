import * as cdk from 'aws-cdk-lib/core';
import * as constructs from 'constructs';
import { CfnWorkflow, CfnTrigger } from 'aws-cdk-lib/aws-glue';
import {
  ConditionLogicalOperator,
  PredicateLogical,
} from '../constants';
import {
  Action,
  TriggerSchedule,
  OnDemandTriggerOptions,
  WeeklyScheduleTriggerOptions,
  DailyScheduleTriggerOptions,
  CustomScheduledTriggerOptions,
  NotifyEventTriggerOptions,
  ConditionalTriggerOptions,
} from './trigger-options';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * The base interface for Glue Workflow
 *
 * @see {@link Workflow}
 * @see https://docs.aws.amazon.com/glue/latest/dg/workflows_overview.html
 */
export interface IWorkflow extends cdk.IResource {
  /**
   * The name of the workflow
   * @attribute
   */
  readonly workflowName: string;

  /**
   * The ARN of the workflow
   * @attribute
   */
  readonly workflowArn: string;

  /**
   * Add an on-demand trigger to the workflow
   */
  addOnDemandTrigger(id: string, options: OnDemandTriggerOptions): CfnTrigger;

  /**
   * Add an daily-scheduled trigger to the workflow
   */
  addDailyScheduledTrigger(id: string, options: DailyScheduleTriggerOptions): CfnTrigger;

  /**
   * Add an weekly-scheduled trigger to the workflow
   */
  addWeeklyScheduledTrigger(id: string, options: WeeklyScheduleTriggerOptions): CfnTrigger;

  /**
   * Add an custom-scheduled trigger to the workflow
   */
  addCustomScheduledTrigger(id: string, options: CustomScheduledTriggerOptions): CfnTrigger;
}

/**
 * Properties for importing a Workflow using its attributes
 */
export interface WorkflowAttributes {
  /**
   * The name of the workflow to import
   */
  readonly workflowName: string;
  /**
   * The ARN of the workflow to import
   *
   * @default - derived from the workflow name
   */
  readonly workflowArn?: string;
}

/**
 * Properties for defining a Workflow
 */
export interface WorkflowProps {
  /**
   * Name of the workflow
   *
   * @default - a name will be generated
   */
  readonly workflowName?: string;

  /**
   * A description of the workflow
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * A map of properties to use when this workflow is executed
   *
   * @default - no default run properties
   */
  readonly defaultRunProperties?: { [key: string]: string };

  /**
   * The maximum number of concurrent runs allowed for the workflow
   *
   * @default - no limit
   */
  readonly maxConcurrentRuns?: number;
}

/**
 * Base abstract class for Workflow
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/about-triggers.html
 */
export abstract class WorkflowBase extends cdk.Resource implements IWorkflow {
  /**
   * Extract workflowName from arn
   */
  protected static extractNameFromArn(scope: constructs.Construct, workflowArn: string): string {
    return cdk.Stack.of(scope).splitArn(
      workflowArn,
      cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
  }

  public abstract readonly workflowName: string;
  public abstract readonly workflowArn: string;

  /**
   * Add an on-demand trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @throws If both job and crawler are provided, or if neither job nor crawler is provided.
   * @returns The created CfnTrigger resource.
   */
  public addOnDemandTrigger(id: string, options: OnDemandTriggerOptions): CfnTrigger {
    const trigger = new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'ON_DEMAND',
      actions: options.actions?.map(this.renderAction.bind(this)),
      description: options.description || undefined,
    });

    return trigger;
  }

  /**
   * Add a daily-scheduled trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @throws If both job and crawler are provided, or if neither job nor crawler is provided.
   * @returns The created CfnTrigger resource.
   */
  public addDailyScheduledTrigger(id: string, options: DailyScheduleTriggerOptions): CfnTrigger {
    const dailySchedule = TriggerSchedule.cron({
      minute: '0',
      hour: '0',
    });

    const trigger = new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'SCHEDULED',
      actions: options.actions?.map(this.renderAction.bind(this)),
      schedule: dailySchedule.expressionString,
      startOnCreation: options.startOnCreation ?? false,
    });

    return trigger;
  }

  /**
   * Add a weekly-scheduled trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @throws If both job and crawler are provided, or if neither job nor crawler is provided.
   * @returns The created CfnTrigger resource.
   */
  public addWeeklyScheduledTrigger(id: string, options: WeeklyScheduleTriggerOptions): CfnTrigger {
    const weeklySchedule = TriggerSchedule.cron({
      minute: '0',
      hour: '0',
      weekDay: 'SUN',
    });

    const trigger = new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'SCHEDULED',
      actions: options.actions?.map(this.renderAction.bind(this)),
      schedule: weeklySchedule.expressionString,
      startOnCreation: options.startOnCreation ?? false,
    });

    return trigger;
  }

  /**
   * Add a custom-scheduled trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @throws If both job and crawler are provided, or if neither job nor crawler is provided.
   * @returns The created CfnTrigger resource.
   */
  public addCustomScheduledTrigger(id: string, options: CustomScheduledTriggerOptions): CfnTrigger {
    const trigger = new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'SCHEDULED',
      actions: options.actions?.map(this.renderAction.bind(this)),
      schedule: options.schedule.expressionString,
      startOnCreation: options.startOnCreation ?? false,
    });

    return trigger;
  }

  /**
   * Add an Event Bridge based trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @throws If both job and crawler are provided, or if neither job nor crawler is provided.
   * @returns The created CfnTrigger resource.
   */
  public addNotifyEventTrigger(id: string, options: NotifyEventTriggerOptions): CfnTrigger {
    const trigger = new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'EVENT',
      actions: options.actions?.map(this.renderAction.bind(this)),
      eventBatchingCondition: this.renderEventBatchingCondition(options),
      description: options.description ?? undefined,
    });

    return trigger;
  }

  /**
   * Add a Condition (Predicate) based trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @throws If both job and crawler are provided, or if neither job nor crawler is provided for any condition.
   * @throws If a job is provided without a job state, or if a crawler is provided without a crawler state for any condition.
   * @returns The created CfnTrigger resource.
   */
  public addconditionalTrigger(id: string, options: ConditionalTriggerOptions): CfnTrigger {
    const trigger = new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'CONDITIONAL',
      actions: options.actions?.map(this.renderAction.bind(this)),
      predicate: this.renderPredicate(options),
      eventBatchingCondition: this.renderEventBatchingCondition(options),
      description: options.description ?? undefined,
    });

    return trigger;
  }

  private renderAction(action: Action): CfnTrigger.ActionProperty {
    // Validate that either job or crawler is provided, but not both
    if (!action.job && !action.crawler) {
      throw new Error('You must provide either a job or a crawler for the action.');
    } else if (action.job && action.crawler) {
      throw new Error('You cannot provide both a job and a crawler for the action.');
    }

    return {
      jobName: action.job?.jobName,
      arguments: action.arguments,
      timeout: action.timeout?.toMinutes(),
      securityConfiguration: action.securityConfiguration?.securityConfigurationName,
      crawlerName: action.crawler?.name,
    };
  }

  private renderPredicate(props: ConditionalTriggerOptions): CfnTrigger.PredicateProperty {
    const conditions = props.predicate.conditions?.map(condition => {
      // Validate that either job or crawler is provided, but not both
      if (!condition.job && !condition.crawlerName) {
        throw new Error('You must provide either a job or a crawler for the condition.');
      } else if (condition.job && condition.crawlerName) {
        throw new Error('You cannot provide both a job and a crawler for the condition.');
      }

      // Validate that if job is provided, job state is also provided
      if (condition.job && !condition.state) {
        throw new Error('If you provide a job for the condition, you must also provide a job state.');
      }

      // Validate that if crawler is provided, crawler state is also provided
      if (condition.crawlerName && !condition.crawlState) {
        throw new Error('If you provide a crawler for the condition, you must also provide a crawler state.');
      }

      return {
        logicalOperator: condition.logicalOperator ?? ConditionLogicalOperator.EQUALS,
        jobName: condition.job?.jobName ?? undefined,
        state: condition.state ?? undefined,
        crawlerName: condition.crawlerName ?? undefined,
        crawlState: condition.crawlState ?? undefined,
      };
    });

    return {
      logical: props.predicate.conditions?.length === 1 ? undefined : props.predicate.logical ?? PredicateLogical.AND,
      conditions: conditions,
    };
  }

  private renderEventBatchingCondition(props: NotifyEventTriggerOptions): CfnTrigger.EventBatchingConditionProperty {
    const defaultBatchSize = 1;
    const defaultBatchWindow = cdk.Duration.seconds(900).toSeconds();

    if (!props.eventBatchingCondition) {
      return {
        batchSize: defaultBatchSize,
        batchWindow: defaultBatchWindow,
      };
    }

    return {
      batchSize: props.eventBatchingCondition.batchSize || defaultBatchSize,
      batchWindow: props.eventBatchingCondition.batchWindow?.toSeconds() || defaultBatchWindow,
    };
  }

  protected buildWorkflowArn(scope: constructs.Construct, workflowName: string): string {
    return cdk.Stack.of(scope).formatArn({
      service: 'glue',
      resource: 'workflow',
      resourceName: workflowName,
    });
  }
}

/**
 * This module defines a construct for creating and managing AWS Glue Workflows and Triggers.
 *
 * AWS Glue Workflows are orchestration services that allow you to create, manage, and monitor complex extract, transform, and load (ETL) activities involving multiple crawlers, jobs, and triggers. Workflows are designed to allow you to manage interdependent jobs and crawlers as a single unit, making it easier to orchestrate and monitor complex ETL pipelines.
 *
 * Triggers are used to initiate an AWS Glue Workflow. You can configure different types of triggers, such as on-demand, scheduled, event-based, or conditional triggers, to start your Workflow based on specific conditions or events.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/workflows_overview.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/about-triggers.html
 *
 * ## Usage Example
 *
 * ```ts
 * const app = new App();
 * const stack = new Stack(app, 'TestStack');
 *
 * // Create a Glue Job
 * declare const role: iam.IRole;
 * declare const script: glue.Code;
 * const job = new glue.PySparkStreamingJob(stack, 'ImportedJob', { role, script });
 *
 * // Create a Glue Workflow
 * const workflow = new glue.Workflow(stack, 'TestWorkflow');
 *
 * // Add an on-demand trigger to the Workflow
 * workflow.addOnDemandTrigger('OnDemandTrigger', {
 *   actions: [{ job: job }],
 * });
 * ```
 */
export class Workflow extends WorkflowBase {
  /**
   * Import a workflow from its name
   */
  public static fromWorkflowName(scope: constructs.Construct, id: string, workflowName: string): IWorkflow {
    return this.fromWorkflowAttributes(scope, id, {
      workflowName,
    });
  }

  /**
   * Import an workflow from it's name
   */
  public static fromWorkflowArn(scope: constructs.Construct, id: string, workflowArn: string): IWorkflow {
    return this.fromWorkflowAttributes(scope, id, {
      workflowName: this.extractNameFromArn(scope, workflowArn),
      workflowArn,
    });
  }

  /**
   * Import an existing workflow
   */
  public static fromWorkflowAttributes(scope: constructs.Construct, id: string, attrs: WorkflowAttributes): IWorkflow {
    class Import extends WorkflowBase {
      public readonly workflowName = attrs.workflowName;
      public readonly workflowArn = this.buildWorkflowArn(scope, this.workflowName);
    }

    return new Import(scope, id);
  }

  public readonly workflowName: string;
  public readonly workflowArn: string;

  constructor(scope: constructs.Construct, id: string, props?: WorkflowProps) {
    super(scope, id, {
      physicalName: props?.workflowName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnWorkflow(this, 'Resource', {
      name: this.physicalName,
      description: props?.description,
      defaultRunProperties: props?.defaultRunProperties,
      maxConcurrentRuns: props?.maxConcurrentRuns,
    });

    this.workflowName = this.getResourceNameAttribute(resource.ref);
    this.workflowArn = this.buildWorkflowArn(this, this.workflowName);
  }
}
