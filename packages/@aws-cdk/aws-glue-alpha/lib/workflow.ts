import * as cdk from 'aws-cdk-lib';
import { IResource, Resource } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { CfnCrawler, CfnTrigger, CfnWorkflow } from 'aws-cdk-lib/aws-glue';
import { Construct } from 'constructs';
import { IJob } from './job';
import { ISecurityConfiguration } from './security-configuration';

/**
 * The condition to be evaluated.
 */
export enum TriggerPredicateCondition {
  /**
   * Defines when all predicates are met.
   */
  AND = 'ALL',

  /**
   * Defines when any predicate is met.
   */
  OR = 'ANY',
}

/**
 * The state of the predicate.
 */
export enum PredicateState {
  /**
   * The predicate is in a state of SUCCEEDED.
   */
  SUCCEEDED = 'SUCCEEDED',

  /**
   * The predicate is in a state of STOPPED.
   */
  STOPPED = 'STOPPED',

  /**
   * The predicate is in a state of TIMEOUT.
   */
  TIMEOUT = 'TIMEOUT',

  /**
   * The predicate is in a state of FAILED.
   */
  FAILED = 'FAILED',
}

/**
 * The job predicates to be evaluated.
 */
export interface JobPredicate {
  /**
   * The job to be evaluated.
   */
  readonly job: IJob;

  /**
   * The state of the predicate.
   */
  readonly state: PredicateState;
}

/**
 * The crawler predicates to be evaluated.
 */
export interface CrawlerPredicate {
  /**
   * The crawler to be evaluated.
   */
  readonly crawler: CfnCrawler;

  /**
   * The state of the predicate.
   */
  readonly state: PredicateState;
}

/**
 * The action to be executed when the trigger fires.
 */
export interface Action {
  /**
   * The job to be executed, either this or `crawler` must be specified.
   *
   * @default - A job will not be executed.
   */
  readonly job?: IJob;

  /**
   * The crawler to be executed, either this or `job` must be specified.
   *
   * @default - A crawler will not be executed.
   */
  readonly crawler?: CfnCrawler;

  /**
   * After a job run starts, the `Duration` to wait before glue will trigger a CloudWatch event, in minutes.
   *
   * @default - A notification will not be sent.
   */
  readonly delayCloudwatchEvent?: cdk.Duration;

  /**
   * The job arguments specifically for this run.
   *
   * @default - No arguments.
   */
  readonly arguments?: {[key: string]: string};

  /**
   * A Security Configuration to be used for the action.
   *
   * @default - No security configuration.
   */
  readonly securityConfiguration?: ISecurityConfiguration;

  /**
   * The timeout for a job run, in minutes.
   *
   * @default - No timeout.
   */
  readonly timeout?: cdk.Duration;
}

/**
 * Properties for defining a new trigger to be assgined to a workflow.
 */
export interface TriggerProps {
  /**
   * The name of the trigger.
   *
   * @default - A CloudFormation generated name.
   */
  readonly triggerName?: string;

  /**
   * The description of the trigger.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * Whether this trigger is enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The actions to be executed when this trigger fires.
   */
  readonly actions: Action[];
}

/**
 * Properties for defining a new schedule trigger, to be assigned to a workflow.
 */
export interface ScheduleTriggerProps extends TriggerProps {
  /**
   * The schedule for this trigger.
   */
  readonly schedule: Schedule;
}

/**
 * Properties for defining a new notification trigger, to be assigned to a workflow.
 */
export interface NotificationTriggerProps extends TriggerProps {
  /**
   * The number of events that should be recieved from Amazon EventBridge before the EventBridge trigger is fired.
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * The Window duration, after which the EventBridge trigger fires.
   *
   * @default - 900 seconds
   */
  readonly batchWindow?: cdk.Duration;
}

/**
 * Properties for defining a new conditional trigger, to be assigned to a workflow.
 */
export interface ConditionalTriggerProps extends TriggerProps {
  /**
   * The condition to be evaluated.
   *
   * @default - TriggerPredicateCondition.AND
   */
  readonly predicateCondition?: TriggerPredicateCondition;

  /**
   * The job predicates to be evaluated.
   *
   * @default - No job predicates.
   */
  readonly jobPredicates?: JobPredicate[];

  /**
   * The crawler predicates to be evaluated.
   *
   * @default - No crawler predicates.
   */
  readonly crawlerPredicates?: CrawlerPredicate[];
}

/**
 * Properties representing either a new or imported workflow.
 */
export interface IWorkflow extends IResource {
  /**
   * The ARN of the workflow.
   *
   * @attribute
   */
  readonly workflowArn: string;

  /**
   * The name of the workflow.
   *
   * @attribute
   */
  readonly workflowName: string;
}

/**
 * Properties for defining a new workflow.
 */
export interface WorkflowProps {
  /**
   * The name of the workflow.
   *
   * @default - A CloudFormation generated name.
   */
  readonly workflowName?: string;

  /**
   * A description of the workflow.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The maximum concurrent runs allowed for the workflow.
   *
   * @default - No limit.
   */
  readonly maxConcurrentRuns?: number;

  /**
   * The default run properties for the workflow.
   *
   * @default - No default run properties.
   */
  readonly defaultRunProperties?: {[key: string]: string};
}

abstract class WorkflowBase extends Resource implements IWorkflow {
  public abstract readonly workflowArn: string;
  public abstract readonly workflowName: string;

  private readonly triggers: CfnTrigger[] = [];

  /**
   * Adds a trigger to the workflow to run on demand.
   */
  public addOnDemandTrigger(id: string, props: TriggerProps): void {
    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'ON_DEMAND',
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)),
      }),
    );
  }

  /**
   * Adds a trigger to the workflow to run on a daily schedule.
   */
  public addDailyScheduleTrigger(id: string, props: TriggerProps): void {
    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'SCHEDULED',
        schedule: 'cron(0 1 * * ? *)',
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)),
      }),
    );
  }

  /**
   * Adds a trigger to the workflow to run on a weekly schedule.
   */
  public addWeeklyScheduleTrigger(id: string, props: TriggerProps): void {
    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'SCHEDULED',
        schedule: 'cron(0 1 ? * MON *)',
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)),
      }),
    );
  }

  /**
   * Adds a trigger to the workflow to run on a monthly schedule.
   */
  public addMonthlyScheduleTrigger(id: string, props: TriggerProps): void {
    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'SCHEDULED',
        schedule: 'cron(0 1 1 * ? *)',
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)) ?? [],
      }),
    );
  }

  /**
   * Adds a trigger to the workflow to run on a custom schedule.
   */
  public addCustomScheduleTrigger(id: string, props: ScheduleTriggerProps): void {
    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'SCHEDULED',
        schedule: props.schedule.expressionString,
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)) ?? [],
      }),
    );
  }

  /**
   * Adds a trigger to the workflow to run on a notification event.
   */
  public addNotifyEventTrigger(id: string, props: NotificationTriggerProps): void {
    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'CONDITIONAL',
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)) ?? [],
        eventBatchingCondition: {
          batchSize: props.batchSize ?? 1,
          batchWindow: props.batchWindow?.toSeconds() ?? 900,
        },
      }),
    );
  }

  /**
   * Adds a trigger to the workflow to run on a conditional event.
   */
  public addConditionalTrigger(id: string, props: ConditionalTriggerProps): void {
    this.validatePredicates(props.jobPredicates, props.crawlerPredicates);
    const conditions: CfnTrigger.ConditionProperty[] = [];

    if (props.jobPredicates) {
      conditions.push(
        ...props.jobPredicates.map(predicate => ({
          logical: props.predicateCondition,
          jobName: predicate.job.jobName,
          state: predicate.state,
          logicalOperator: 'EQUALS',
        })),
      );
    }
    if (props.crawlerPredicates) {
      conditions.push(
        ...props.crawlerPredicates.map(predicate => ({
          logical: props.predicateCondition,
          crawlerName: predicate.crawler.name ?? predicate.crawler.ref,
          crawlState: predicate.state,
          logicalOperator: 'EQUALS',
        })),
      );
    }

    this.triggers.push(
      new CfnTrigger(this, id, {
        name: props.triggerName,
        type: 'CONDITIONAL',
        workflowName: this.workflowName,
        startOnCreation: props.enabled ?? true,
        actions: props.actions?.map(action => this.renderAction(action)),
        predicate: {
          logical: props.predicateCondition,
          conditions: conditions.length > 0 ? conditions : undefined,
        },
      }),
    );
  }

  protected renderAction(action: Action): CfnTrigger.ActionProperty {
    if (!action.job && !action.crawler) {
      throw new Error('Either job or crawler must be specified in an action');
    }
    if (action.job && action.crawler) {
      throw new Error(
        'Only one of job or crawler can be specified in an action',
      );
    }

    return {
      jobName: action.job?.jobName,
      crawlerName: action.crawler?.name ?? action.crawler?.ref,
      arguments: action.arguments,
      securityConfiguration:
        action.securityConfiguration?.securityConfigurationName,
      timeout: action.timeout?.toMinutes(),
      notificationProperty: {
        notifyDelayAfter: action.delayCloudwatchEvent?.toMinutes(),
      },
    };
  }

  protected validatePredicates(
    jobPredicates?: JobPredicate[],
    crawlerPredicates?: CrawlerPredicate[],
  ) {
    if (!jobPredicates && !crawlerPredicates) {
      throw new Error(
        'At least one job predicate or crawler predicate must be specified.',
      );
    }
    if (!jobPredicates?.length && !crawlerPredicates?.length) {
      throw new Error(
        'At least one job predicate or crawler predicate must be specified.',
      );
    }
  }
}

/**
 * A Glue workflow.
 */
export class Workflow extends WorkflowBase implements IWorkflow {
  /**
   * Import an existing workflow, using its ARN.
   */
  public static fromWorkflowArn(
    scope: Construct,
    id: string,
    workflowArn: string,
  ): IWorkflow {
    class Import extends WorkflowBase implements IWorkflow {
      public readonly workflowArn = workflowArn;
      public readonly workflowName = cdk.Arn.extractResourceName(
        workflowArn,
        'workflow',
      );
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing workflow, using its name.
   */
  public static fromWorkflowName(
    scope: Construct,
    id: string,
    workflowName: string,
  ): IWorkflow {
    class Import extends WorkflowBase implements IWorkflow {
      public readonly workflowArn = Workflow.buildWorkflowArn(
        scope,
        workflowName,
      );
      public readonly workflowName = workflowName;
    }

    return new Import(scope, id);
  }

  private static buildWorkflowArn(
    scope: Construct,
    workflowName: string,
  ): string {
    return cdk.Stack.of(scope).formatArn({
      service: 'glue',
      resource: 'workflow',
      resourceName: workflowName,
    });
  }

  /**
   * Name of this workflow.
   */
  public readonly workflowName: string;

  /**
   * ARN of this workflow.
   */
  public readonly workflowArn: string;

  constructor(scope: Construct, id: string, props?: WorkflowProps) {
    super(scope, id);

    const resource = new CfnWorkflow(this, 'Resource', {
      name: props?.workflowName,
      description: props?.description,
      maxConcurrentRuns: props?.maxConcurrentRuns,
      defaultRunProperties: props?.defaultRunProperties,
    });

    const resourceName = this.getResourceNameAttribute(resource.ref);
    this.workflowName = resourceName;
    this.workflowArn = Workflow.buildWorkflowArn(scope, this.workflowName);
  }
}
