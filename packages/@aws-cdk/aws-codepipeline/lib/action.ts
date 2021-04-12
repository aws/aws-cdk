import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { IResource } from '@aws-cdk/core';
import { Artifact } from './artifact';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

export enum ActionCategory {
  SOURCE = 'Source',
  BUILD = 'Build',
  TEST = 'Test',
  APPROVAL = 'Approval',
  DEPLOY = 'Deploy',
  INVOKE = 'Invoke'
}

/**
 * Specifies the constraints on the number of input and output
 * artifacts an action can have.
 *
 * The constraints for each action type are documented on the
 * {@link https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html Pipeline Structure Reference} page.
 */
export interface ActionArtifactBounds {
  readonly minInputs: number;
  readonly maxInputs: number;
  readonly minOutputs: number;
  readonly maxOutputs: number;
}

/**
 * The CodePipeline variables that are global,
 * not bound to a specific action.
 * This class defines a bunch of static fields that represent the different variables.
 * These can be used can be used in any action configuration.
 */
export class GlobalVariables {
  /** The identifier of the current pipeline execution. */
  public static readonly executionId = '#{codepipeline.PipelineExecutionId}';
}

export interface ActionProperties {
  readonly actionName: string;
  readonly role?: iam.IRole;

  /**
   * The AWS region the given Action resides in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The account the Action is supposed to live in.
   * For Actions backed by resources,
   * this is inferred from the Stack {@link resource} is part of.
   * However, some Actions, like the CloudFormation ones,
   * are not backed by any resource, and they still might want to be cross-account.
   * In general, a concrete Action class should specify either {@link resource},
   * or {@link account} - but not both.
   */
  readonly account?: string;

  /**
   * The optional resource that is backing this Action.
   * This is used for automatically handling Actions backed by
   * resources from a different account and/or region.
   */
  readonly resource?: IResource;

  /**
   * The category of the action.
   * The category defines which action type the owner
   * (the entity that performs the action) performs.
   */
  readonly category: ActionCategory;

  /**
   * The service provider that the action calls.
   */
  readonly provider: string;
  readonly owner?: string;
  readonly version?: string;

  /**
   * The order in which AWS CodePipeline runs this action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  readonly runOrder?: number;
  readonly artifactBounds: ActionArtifactBounds;
  readonly inputs?: Artifact[];
  readonly outputs?: Artifact[];

  /**
   * The name of the namespace to use for variables emitted by this action.
   *
   * @default - a name will be generated, based on the stage and action names
   */
  readonly variablesNamespace?: string;
}

export interface ActionBindOptions {
  readonly role: iam.IRole;

  readonly bucket: s3.IBucket;
}

export interface ActionConfig {
  readonly configuration?: any;
}

/**
 * A Pipeline Action
 */
export interface IAction {
  /**
   * The simple properties of the Action,
   * like its Owner, name, etc.
   * Note that this accessor will be called before the {@link bind} callback.
   */
  readonly actionProperties: ActionProperties;

  /**
   * The callback invoked when this Action is added to a Pipeline.
   *
   * @param scope the Construct tree scope the Action can use if it needs to create any resources
   * @param stage the {@link IStage} this Action is being added to
   * @param options additional options the Action can use,
   *   like the artifact Bucket of the pipeline it's being added to
   */
  bind(scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig;

  /**
   * Creates an Event that will be triggered whenever the state of this Action changes.
   *
   * @param name the name to use for the new Event
   * @param target the optional target for the Event
   * @param options additional options that can be used to customize the created Event
   */
  onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
}

/**
 * The abstract view of an AWS CodePipeline as required and used by Actions.
 * It extends {@link events.IRuleTarget},
 * so this interface can be used as a Target for CloudWatch Events.
 */
export interface IPipeline extends IResource {
  /**
   * The name of the Pipeline.
   *
   * @attribute
   */
  readonly pipelineName: string;

  /**
   * The ARN of the Pipeline.
   *
   * @attribute
   */
  readonly pipelineArn: string;

  /**
   * Define an event rule triggered by this CodePipeline.
   *
   * @param id Identifier for this event handler.
   * @param options Additional options to pass to the event rule.
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Define an event rule triggered by the "CodePipeline Pipeline Execution
   * State Change" event emitted from this pipeline.
   *
   * @param id Identifier for this event handler.
   * @param options Additional options to pass to the event rule.
   */
  onStateChange(id: string, options?: events.OnEventOptions): events.Rule;
}

/**
 * The abstract interface of a Pipeline Stage that is used by Actions.
 */
export interface IStage {
  /**
   * The physical, human-readable name of this Pipeline Stage.
   */
  readonly stageName: string;

  readonly pipeline: IPipeline;

  /**
   * The actions belonging to this stage.
   */
  readonly actions: IAction[];

  addAction(action: IAction): void;

  onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
}

/**
 * Common properties shared by all Actions.
 */
export interface CommonActionProps {
  /**
   * The physical, human-readable name of the Action.
   * Note that Action names must be unique within a single Stage.
   */
  readonly actionName: string;

  /**
   * The runOrder property for this Action.
   * RunOrder determines the relative order in which multiple Actions in the same Stage execute.
   *
   * @default 1
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html
   */
  readonly runOrder?: number;

  /**
   * The name of the namespace to use for variables emitted by this action.
   *
   * @default - a name will be generated, based on the stage and action names,
   *   if any of the action's variables were referenced - otherwise,
   *   no namespace will be set
   */
  readonly variablesNamespace?: string;
}

/**
 * Common properties shared by all Actions whose {@link ActionProperties.owner} field is 'AWS'
 * (or unset, as 'AWS' is the default).
 */
export interface CommonAwsActionProps extends CommonActionProps {
  /**
   * The Role in which context's this Action will be executing in.
   * The Pipeline's Role will assume this Role
   * (the required permissions for that will be granted automatically)
   * right before executing this Action.
   * This Action will be passed into your {@link IAction.bind}
   * method in the {@link ActionBindOptions.role} property.
   *
   * @default a new Role will be generated
   */
  readonly role?: iam.IRole;
}
