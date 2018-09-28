import actions = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './codepipeline.generated';
import { Pipeline } from './pipeline';

/**
 * Allows you to control where to place a new Stage when it's added to the Pipeline.
 * Note that you can provide only one of the below properties -
 * specifying more than one will result in a validation error.
 *
 * @see #rightBefore
 * @see #justAfter
 * @see #atIndex
 */
export interface StagePlacement {
  /**
   * Inserts the new Stage as a parent of the given Stage
   * (changing its current parent Stage, if it had one).
   */
  readonly rightBefore?: Stage;

  /**
   * Inserts the new Stage as a child of the given Stage
   * (changing its current child Stage, if it had one).
   */
  readonly justAfter?: Stage;

  /**
   * Inserts the new Stage at the given index in the Pipeline,
   * moving the Stage currently at that index,
   * and any subsequent ones, one index down.
   * Indexing starts at 0.
   * The maximum allowed value is {@link Pipeline#stageCount},
   * which will insert the new Stage at the end of the Pipeline.
   */
  readonly atIndex?: number;
}

/**
 * The properties for the {@link Pipeline#addStage} method.
 */
export interface CommonStageProps {
  /**
   * Allows specifying where should the newly created {@link Stage}
   * be placed in the Pipeline.
   *
   * @default the stage is added at the end of the Pipeline
   */
  placement?: StagePlacement;
}

/**
 * The construction properties for {@link Stage}.
 */
export interface StageProps extends CommonStageProps {
  /**
   * The Pipeline to add the newly created Stage to.
   */
  pipeline: Pipeline;
}

/**
 * A Stage in a Pipeline.
 * Stages are added to a Pipeline by constructing a new Stage,
 * and passing the Pipeline it belongs to through the {@link StageProps#pipeline} attribute.
 *
 * @example
 *   // add a Stage to a Pipeline
 *   new Stage(this, 'MyStage', {
 *     pipeline: myPipeline,
 *   });
 */
export class Stage extends cdk.Construct implements actions.IStage {
  /**
   * The Pipeline this Stage is a part of.
   */
  public readonly pipeline: Pipeline;
  public readonly name: string;

  private readonly _actions = new Array<actions.Action>();

  /**
   * Create a new Stage.
   */
  constructor(parent: cdk.Construct, name: string, props: StageProps) {
    super(parent, name);
    this.name = name;
    this.pipeline = props.pipeline;
    actions.validateName('Stage', name);

    (this.pipeline as any)._attachStage(this, props.placement);
  }

  /**
   * Get a duplicate of this stage's list of actions.
   */
  public get actions(): actions.Action[] {
    return this._actions.slice();
  }

  public validate(): string[] {
    return this.validateHasActions();
  }

  public grantPipelineBucketReadWrite(identity: iam.IPrincipal): void {
    this.pipeline.artifactBucket.grantReadWrite(identity);
  }

  public render(): cloudformation.PipelineResource.StageDeclarationProperty {
    return {
      name: this.id,
      actions: this._actions.map(action => this.renderAction(action)),
    };
  }

  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this.pipeline, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Stage Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipeline.pipelineArn ],
      detail: {
        stage: [ this.id ],
      },
    });
    return rule;
  }

  public get pipelineArn(): string {
    return this.pipeline.pipelineArn;
  }

  public get pipelineRole(): iam.Role {
    return this.pipeline.role;
  }

  // can't make this method private like Pipeline#_attachStage,
  // as it comes from the IStage interface
  public _attachAction(action: actions.Action): void {
    // _attachAction should be idempotent in case a customer ever calls it directly
    if (!this._actions.includes(action)) {
      this._actions.push(action);
    }
  }

  private renderAction(action: actions.Action): cloudformation.PipelineResource.ActionDeclarationProperty {
    return {
      name: action.id,
      inputArtifacts: action.inputArtifacts.map(a => ({ name: a.name })),
      actionTypeId: {
        category: action.category.toString(),
        version: action.version,
        owner: action.owner,
        provider: action.provider,
      },
      configuration: action.configuration,
      outputArtifacts: action.outputArtifacts.map(a => ({ name: a.name })),
      runOrder: action.runOrder,
    };
  }

  private validateHasActions(): string[] {
    if (this._actions.length === 0) {
      return [`Stage '${this.id}' must have at least one action`];
    }
    return [];
  }
}
