import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, IResource, Lazy } from '@aws-cdk/core';
import { Artifact } from './artifact';
import { deduplicateArtifacts } from './private/artifacts';
import * as validation from './private/validation';

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

/**
 * How an action is configured
 */
export interface ActionProperties {
  /**
   * Name of the action
   */
  readonly actionName: string;

  /**
   * Role to assume to execute the action
   *
   * @default - No role
   */
  readonly role?: iam.IRole;

  /**
   * The AWS region the given Action executes in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The account the Action is supposed to execute in.
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

  /**
   * The owner of this provider
   */
  readonly owner: string;

  /**
   * The version of this provider
   */
  readonly version: string;

  /**
   * The order in which AWS CodePipeline runs this action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  readonly runOrder: number;

  /**
   * Artifact bounds that apply to this artifact
   */
  readonly artifactBounds: ActionArtifactBounds;

  /**
   * Input artifacts
   */
  readonly inputs: Artifact[];

  /**
   * Output artifacts
   */
  readonly outputs: Artifact[];

  /**
   * The name of the namespace to use for variables emitted by this action.
   *
   * @default - a name will be generated, based on the stage and action names
   */
  readonly variablesNamespace?: string;
}

/**
 * Configuration properties for an Action
 */
export interface ActionProps {
  readonly actionName: string;
  readonly role?: iam.IRole;

  /**
   * The AWS region the given Action executes in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The account the Action is supposed to execute in.
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

  /**
   * The owner of this provider
   *
   * @default 'AWS'
   */
  readonly owner?: string;

  /**
   * The version of this provider
   *
   * @default '1'
   */
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
  /**
   * Static configuration returned by bind()
   *
   * @deprecated Return boundAction instead.
   */
  readonly configuration?: any;

  /**
   * A bound version of the action
   *
   * Provides access to methods that can only be called once the
   * Action has been bound to a pipeline.
   *
   * If this value is set, `configuration` will be ignored.
   */
  readonly boundAction?: IBoundAction;
}

/**
 * The result of binding an Action
 */
export interface IBoundAction {
  /**
   * The unbound action
   */
  action: IAction;

  /**
   * Configuration for the Action
   */
  configuration(): any;
}

/**
 * A Pipeline Action
 */
export interface IAction {
  /**
   * Information about the Action
   */
  readonly actionProperties: ActionProperties;

  /**
   * Called when the Action is added to a Stage
   */
  bind(scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig;

  /**
   * AWS Event that triggers when the Action changes state
   */
  onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
}

/**
 * Base class for CodePipeline Actions.
 *
 * @experimental
 */
export abstract class Action implements IAction {

  private readonly _actionProperties: ActionProps;
  private _pipeline?: IPipeline;
  private _stage?: IStage;
  private _scope?: Construct;
  private readonly namespaceOrToken: string;
  private actualNamespace?: string;
  private variableReferenced = false;
  private _actionName: string;
  private _runOrder: number;
  private _inputs: Artifact[];
  private _outputs: Artifact[];

  protected constructor(actionProperties: ActionProps) {
    this._actionProperties = actionProperties;
    this.namespaceOrToken = Lazy.stringValue({
      produce: () => {
        // make sure the action was bound (= added to a pipeline)
        if (this.actualNamespace === undefined) {
          throw new Error(`Cannot reference variables of action '${this._actionProperties.actionName}', ` +
          'as that action was never added to a pipeline');
        }

        return this.finalNamespace;
      },
    });

    this._inputs = actionProperties.inputs ?? [];
    this._outputs = actionProperties.outputs ?? [];

    this._actionName = actionProperties.actionName;
    validation.validateName('Action', this._actionName);
    validation.validateNamespaceName(actionProperties.variablesNamespace);

    this._runOrder = actionProperties.runOrder ?? 1;
    validateRunOrder(this._runOrder);
  }

  /**
   * Return the properties for this action
   *
   * These properties are mutable.
   */
  public get actionProperties(): ActionProperties {
    return {
      ...this._actionProperties,
      // Implied defaults here
      owner: this._actionProperties.owner ?? 'AWS',
      version: this._actionProperties.version ?? '1',
      // Replace supplied value with a token
      variablesNamespace: this.namespaceOrToken,
      // Replace potentially mutated values with their final values
      runOrder: this.runOrder,
      actionName: this.actionName,
      inputs: this.inputs,
      outputs: this.outputs,
    };
  }

  /**
   * The name of this Action
   */
  public get actionName(): string {
    return this._actionName;
  }

  /**
   * The name of this Action
   */
  public set actionName(value: string) {
    validation.validateName('Action', value);
    this._actionName = value;
  }

  /**
   * The runOrder of this Action
   */
  public get runOrder(): number {
    return this._runOrder;
  }

  /**
   * The runOrder of this Action
   */
  public set runOrder(value: number) {
    validateRunOrder(value);
    this._runOrder = value;
  }

  /**
   * Inputs to this action
   */
  public get inputs(): Artifact[] {
    return deduplicateArtifacts(this._inputs);
  }

  /**
   * Ouptuts of this action
   */
  public get outputs(): Artifact[] {
    return deduplicateArtifacts(this._outputs);
  }

  public bind(scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig {
    this._pipeline = stage.pipeline;
    this._stage = stage;
    this._scope = scope;

    // default a namespace name, based on the stage and action names
    this.actualNamespace = this.customerProvidedNamespace ?? `${stage.stageName}_${this.actionProperties.actionName}_NS`;

    // For backwards compatibility reasons, the result of 'bound' is
    // the default configuration. Subclasses can override `configuration` to return something else.
    return this.bound(scope, stage, options);
  }

  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = new events.Rule(this.scope, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: ['CodePipeline Action Execution State Change'],
      source: ['aws.codepipeline'],
      resources: [this.pipeline.pipelineArn],
      detail: {
        stage: [this.stage.stageName],
        action: [this.actionProperties.actionName],
      },
    });
    return rule;
  }

  /**
   * Change inputs to this action
   *
   * Protected so that subclasses can exert control over how many artifacts there
   * are and how they are replaced.
   */
  protected changeInputs(values: Artifact[]) {
    this._inputs = [...values];
  }

  /**
   * Outputs of this action
   *
   * Protected so that subclasses can exert control over how many artifacts there
   * are and how they are replaced.
   */
  protected changeOutputs(values: Artifact[]) {
    this._outputs = [...values];
  }


  protected variableExpression(variableName: string): string {
    this.variableReferenced = true;
    return `#{${this.namespaceOrToken}.${variableName}}`;
  }

  /**
   * The method called when an Action is attached to a Pipeline.
   * This method is guaranteed to be called only once for each Action instance.
   *
   * @param options an instance of the {@link ActionBindOptions} class,
   *   that contains the necessary information for the Action
   *   to configure itself, like a reference to the Role, etc.
   */
  protected abstract bound(scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig;

  private get customerProvidedNamespace(): string | undefined {
    return this._actionProperties.variablesNamespace;
  }

  private get finalNamespace() {
    // if a customer passed a namespace explicitly, always use that
    // otherwise, only return a namespace if any variable was referenced
    return this.customerProvidedNamespace ?? (this.variableReferenced ? this.actualNamespace : undefined);
  }

  private get pipeline(): IPipeline {
    if (this._pipeline) {
      return this._pipeline;
    } else {
      throw new Error('Action must be added to a stage that is part of a pipeline before using onStateChange');
    }
  }

  private get stage(): IStage {
    if (this._stage) {
      return this._stage;
    } else {
      throw new Error('Action must be added to a stage that is part of a pipeline before using onStateChange');
    }
  }

  /**
   * Retrieves the Construct scope of this Action.
   * Only available after the Action has been added to a Stage,
   * and that Stage to a Pipeline.
   */
  private get scope(): Construct {
    if (this._scope) {
      return this._scope;
    } else {
      throw new Error('Action must be added to a stage that is part of a pipeline first');
    }
  }
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

function validateRunOrder(ro: number) {
  if (!Number.isInteger(ro) || ro < 1) {
    throw new Error(`Action 'runOrder' must be an integer >= 1, got: ${ro}`);
  }
}