import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { Construct, IResource } from '@aws-cdk/cdk';
import { Artifact } from './artifact';
import validation = require('./validation');

export enum ActionCategory {
  Source = 'Source',
  Build = 'Build',
  Test = 'Test',
  Approval = 'Approval',
  Deploy = 'Deploy',
  Invoke = 'Invoke'
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
 * The interface used in the {@link Action#bind()} callback.
 */
export interface ActionBind {
  /**
   * The pipeline this action has been added to.
   */
  readonly pipeline: IPipeline;

  /**
   * The stage this action has been added to.
   */
  readonly stage: IStage;

  /**
   * The scope construct for this action.
   * Can be used by the action implementation to create any resources it needs to work correctly.
   */
  readonly scope: Construct;

  /**
   * The IAM Role to add the necessary permissions to.
   */
  readonly role: iam.IRole;
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
   * Grants read permissions to the Pipeline's S3 Bucket to the given Identity.
   *
   * @param identity the IAM Identity to grant the permissions to
   */
  grantBucketRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Grants read & write permissions to the Pipeline's S3 Bucket to the given Identity.
   *
   * @param identity the IAM Identity to grant the permissions to
   */
  grantBucketReadWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Define an event rule triggered by this CodePipeline.
   *
   * @param id Identifier for this event handler.
   * @param options Additional options to pass to the event rule.
   */
  onEvent(id: string, options: events.OnEventOptions): events.Rule;

  /**
   * Define an event rule triggered by the "CodePipeline Pipeline Execution
   * State Change" event emitted from this pipeline.
   *
   * @param id Identifier for this event handler.
   * @param options Additional options to pass to the event rule.
   */
  onStateChange(id: string, options: events.OnEventOptions): events.Rule;
}

/**
 * The abstract interface of a Pipeline Stage that is used by Actions.
 */
export interface IStage {
  /**
   * The physical, human-readable name of this Pipeline Stage.
   */
  readonly stageName: string;

  addAction(action: Action): void;

  onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
}

/**
 * Common properties shared by all Actions.
 */
export interface CommonActionProps {
  /**
   * The physical, human-readable name of the Action.
   * Not that Action names must be unique within a single Stage.
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
}

/**
 * Construction properties of the low-level {@link Action Action class}.
 */
export interface ActionProps extends CommonActionProps {
  readonly category: ActionCategory;
  readonly provider: string;

  /**
   * The region this Action resides in.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The service role that is assumed during execution of action.
   * This role is not mandatory, however more advanced configuration
   * may require specifying it.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
   */
  readonly role?: iam.IRole;

  readonly artifactBounds: ActionArtifactBounds;
  readonly inputs?: Artifact[];
  readonly outputs?: Artifact[];
  readonly configuration?: any;
  readonly version?: string;
  readonly owner?: string;
}

/**
 * Low-level class for generic CodePipeline Actions.
 */
export abstract class Action {
  /**
   * The category of the action.
   * The category defines which action type the owner
   * (the entity that performs the action) performs.
   */
  public readonly category: ActionCategory;

  /**
   * The service provider that the action calls.
   */
  public readonly provider: string;

  /**
   * The AWS region the given Action resides in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  public readonly region?: string;

  /**
   * The action's configuration. These are key-value pairs that specify input values for an action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  public readonly configuration?: any;

  /**
   * The service role that is assumed during execution of action.
   * This role is not mandatory, however more advanced configuration
   * may require specifying it.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
   */
  public readonly role?: iam.IRole;

  /**
   * The order in which AWS CodePipeline runs this action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  public readonly runOrder: number;

  public readonly owner: string;
  public readonly version: string;
  public readonly actionName: string;

  private readonly _actionInputArtifacts = new Array<Artifact>();
  private readonly _actionOutputArtifacts = new Array<Artifact>();
  private readonly artifactBounds: ActionArtifactBounds;

  private _pipeline?: IPipeline;
  private _stage?: IStage;
  private _scope?: Construct;

  constructor(props: ActionProps) {
    validation.validateName('Action', props.actionName);

    this.owner = props.owner || 'AWS';
    this.version = props.version || '1';
    this.category = props.category;
    this.provider = props.provider;
    this.region = props.region;
    this.configuration = props.configuration;
    this.artifactBounds = props.artifactBounds;
    this.runOrder = props.runOrder === undefined ? 1 : props.runOrder;
    this.actionName = props.actionName;
    this.role = props.role;

    for (const inputArtifact of props.inputs || []) {
      this.addInputArtifact(inputArtifact);
    }

    for (const outputArtifact of props.outputs || []) {
      this.addOutputArtifact(outputArtifact);
    }
  }

  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = new events.Rule(this.scope, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Stage Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipeline.pipelineArn ],
      detail: {
        stage: [ this.stage.stageName ],
        action: [ this.actionName ],
      },
    });
    return rule;
  }

  public get inputs(): Artifact[] {
    return this._actionInputArtifacts.slice();
  }

  public get outputs(): Artifact[] {
    return this._actionOutputArtifacts.slice();
  }

  /** @internal */
  public _validate(): string[] {
    return validation.validateArtifactBounds('input', this.inputs, this.artifactBounds.minInputs,
        this.artifactBounds.maxInputs, this.category, this.provider)
      .concat(validation.validateArtifactBounds('output', this.outputs, this.artifactBounds.minOutputs,
        this.artifactBounds.maxOutputs, this.category, this.provider)
    );
  }

  protected addInputArtifact(artifact: Artifact): void {
    this.addToArtifacts(artifact, this._actionInputArtifacts);
  }

  /**
   * Retrieves the Construct scope of this Action.
   * Only available after the Action has been added to a Stage,
   * and that Stage to a Pipeline.
   */
  protected get scope(): Construct {
    if (this._scope) {
      return this._scope;
    } else {
      throw new Error('Action must be added to a stage that is part of a pipeline first');
    }
  }

  /**
   * The method called when an Action is attached to a Pipeline.
   * This method is guaranteed to be called only once for each Action instance.
   *
   * @info an instance of the {@link ActionBind} class,
   *   that contains the necessary information for the Action
   *   to configure itself, like a reference to the Pipeline, Stage, Role, etc.
   */
  protected abstract bind(info: ActionBind): void;

  private addOutputArtifact(artifact: Artifact): void {
    this.addToArtifacts(artifact, this._actionOutputArtifacts);
  }

  private addToArtifacts(artifact: Artifact, artifacts: Artifact[]): void {
    // adding the same Artifact, or a different Artifact, but with the same name,
    // multiple times, doesn't do anything -
    // addToArtifacts is idempotent
    if (artifact.artifactName) {
      if (artifacts.find(a => a.artifactName === artifact.artifactName)) {
        return;
      }
    } else {
      if (artifacts.find(a => a === artifact)) {
        return;
      }
    }

    artifacts.push(artifact);
  }

  // ignore unused private method (it's actually used in Pipeline)
  // @ts-ignore
  private _actionAttachedToPipeline(info: ActionBind): void {
    if (this._stage) {
      throw new Error(`Action '${this.actionName}' has been added to a pipeline twice`);
    }

    this._pipeline = info.pipeline;
    this._stage = info.stage;
    this._scope = info.scope;

    this.bind(info);
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
}

// export class ElasticBeanstalkDeploy extends DeployAction {
//   constructor(scope: Stage, id: string, applicationName: string, environmentName: string) {
//     super(scope, id, 'ElasticBeanstalk', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//       ApplicationName: applicationName,
//       EnvironmentName: environmentName
//     });
//   }
// }

// export class OpsWorksDeploy extends DeployAction {
//   constructor(scope: Stage, id: string, app: string, stack: string, layer?: string) {
//     super(scope, id, 'OpsWorks', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//       Stack: stack,
//       App: app,
//       Layer: layer,
//     });
//   }
// }

// export class ECSDeploy extends DeployAction {
//   constructor(scope: Stage, id: string, clusterName: string, serviceName: string, fileName?: string) {
//     super(scope, id, 'ECS', { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 }, {
//       ClusterName: clusterName,
//       ServiceName: serviceName,
//       FileName: fileName,
//     });
//   }
// }
