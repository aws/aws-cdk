import { CfnWorkflow, CfnTrigger } from 'aws-cdk-lib/aws-glue';
import type { ITriggerRef } from 'aws-cdk-lib/aws-glue';
import * as cdk from 'aws-cdk-lib/core';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type * as constructs from 'constructs';
import {
  PredicateLogical,
} from '../constants';
import type {
  OnDemandTriggerOptions,
  ScheduledTriggerOptions,
  EventTriggerOptions,
  ConditionalTriggerOptions,
} from './trigger-options';

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
   * Add an on-demand trigger to the workflow.
   *
   * @returns a reference to the created trigger.
   */
  addOnDemandTrigger(id: string, options: OnDemandTriggerOptions): ITriggerRef;

  /**
   * Add a scheduled trigger to the workflow.
   *
   * @returns a reference to the created trigger.
   */
  addScheduledTrigger(id: string, options: ScheduledTriggerOptions): ITriggerRef;

  /**
   * Add an EventBridge event-based trigger to the workflow.
   *
   * @returns a reference to the created trigger.
   */
  addEventTrigger(id: string, options: EventTriggerOptions): ITriggerRef;

  /**
   * Add a conditional (predicate-based) trigger to the workflow.
   *
   * @returns a reference to the created trigger.
   */
  addConditionalTrigger(id: string, options: ConditionalTriggerOptions): ITriggerRef;
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
   * @returns a reference to the created trigger.
   */
  public addOnDemandTrigger(id: string, options: OnDemandTriggerOptions): ITriggerRef {
    return new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'ON_DEMAND',
      actions: options.actions?.map(action => action._render()),
      description: options.description || undefined,
    });
  }

  /**
   * Add a scheduled trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger, including the schedule.
   * @returns a reference to the created trigger.
   */
  public addScheduledTrigger(id: string, options: ScheduledTriggerOptions): ITriggerRef {
    return new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'SCHEDULED',
      actions: options.actions?.map(action => action._render()),
      schedule: options.schedule.expressionString,
      startOnCreation: options.startOnCreation ?? false,
    });
  }

  /**
   * Add an EventBridge event-based trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @returns a reference to the created trigger.
   */
  public addEventTrigger(id: string, options: EventTriggerOptions): ITriggerRef {
    return new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'EVENT',
      actions: options.actions?.map(action => action._render()),
      eventBatchingCondition: this.renderEventBatchingCondition(options),
      description: options.description ?? undefined,
    });
  }

  /**
   * Add a conditional (predicate-based) trigger to the workflow.
   *
   * @param id The id of the trigger.
   * @param options Additional options for the trigger.
   * @returns a reference to the created trigger.
   */
  public addConditionalTrigger(id: string, options: ConditionalTriggerOptions): ITriggerRef {
    return new CfnTrigger(this, id, {
      ...options,
      workflowName: this.workflowName,
      type: 'CONDITIONAL',
      actions: options.actions?.map(action => action._render()),
      predicate: this.renderPredicate(options),
      eventBatchingCondition: this.renderEventBatchingCondition(options),
      description: options.description ?? undefined,
    });
  }

  private renderPredicate(props: ConditionalTriggerOptions): CfnTrigger.PredicateProperty {
    return {
      logical: props.predicate.conditions?.length === 1 ? undefined : props.predicate.logical ?? PredicateLogical.AND,
      conditions: props.predicate.conditions?.map(condition => condition._render()),
    };
  }

  private renderEventBatchingCondition(props: EventTriggerOptions): CfnTrigger.EventBatchingConditionProperty {
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
 *   actions: [glue.Action.job(job)],
 * });
 * ```
 */
@propertyInjectable
export class Workflow extends WorkflowBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.Workflow';

  /**
   * Import a workflow from its name
   */
  public static fromWorkflowName(scope: constructs.Construct, id: string, workflowName: string): IWorkflow {
    return this.fromWorkflowAttributes(scope, id, {
      workflowName,
    });
  }

  /**
   * Import a workflow from its name
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

  private resource: CfnWorkflow;

  constructor(scope: constructs.Construct, id: string, props?: WorkflowProps) {
    super(scope, id, {
      physicalName: props?.workflowName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnWorkflow(this, 'Resource', {
      name: this.physicalName,
      description: props?.description,
      defaultRunProperties: props?.defaultRunProperties,
      maxConcurrentRuns: props?.maxConcurrentRuns,
    });
  }

  @memoizedGetter
  public get workflowName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  @memoizedGetter
  public get workflowArn(): string {
    return this.buildWorkflowArn(this, this.workflowName);
  }
}
