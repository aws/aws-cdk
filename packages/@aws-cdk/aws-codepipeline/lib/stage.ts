import cpapi = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import { CfnPipeline } from './codepipeline.generated';
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
export class Stage extends cdk.Construct implements cpapi.IStage, cpapi.IInternalStage {
  /**
   * The Pipeline this Stage is a part of.
   */
  public readonly pipeline: cpapi.IPipeline;
  public readonly name: string;

  /**
   * The API of Stage used internally by the CodePipeline Construct.
   * You should never need to call any of the methods inside of it yourself.
   */
  public readonly _internal = this;

  private readonly _actions = new Array<cpapi.Action>();

  /**
   * Create a new Stage.
   */
  constructor(scope: cdk.Construct, id: string, props: StageProps) {
    super(scope, id);
    this.name = id;
    this.pipeline = props.pipeline;
    cpapi.validateName('Stage', id);

    (this.pipeline as any)._attachStage(this, props.placement);
  }

  /**
   * Get a duplicate of this stage's list of actions.
   */
  public get actions(): cpapi.Action[] {
    return this._actions.slice();
  }

  public render(): CfnPipeline.StageDeclarationProperty {
    return {
      name: this.node.id,
      actions: this._actions.map(action => this.renderAction(action)),
    };
  }

  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Stage Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipeline.pipelineArn ],
      detail: {
        stage: [ this.node.id ],
      },
    });
    return rule;
  }

  // can't make this method private like Pipeline#_attachStage,
  // as it comes from the IStage interface
  public _attachAction(action: cpapi.Action): void {
    // _attachAction should be idempotent in case a customer ever calls it directly
    if (!this._actions.includes(action)) {
      this._actions.push(action);

      (this.pipeline as any)._attachActionToRegion(this, action);
    }
  }

  public _generateOutputArtifactName(action: cpapi.Action): string {
    return (this.pipeline as any)._generateOutputArtifactName(this, action);
  }

  public _findInputArtifact(action: cpapi.Action): cpapi.Artifact {
    return (this.pipeline as any)._findInputArtifact(this, action);
  }

  protected validate(): string[] {
    return this.validateHasActions();
  }

  private renderAction(action: cpapi.Action): CfnPipeline.ActionDeclarationProperty {
    return {
      name: action.node.id,
      inputArtifacts: action._inputArtifacts.map(a => ({ name: a.name })),
      actionTypeId: {
        category: action.category.toString(),
        version: action.version,
        owner: action.owner,
        provider: action.provider,
      },
      configuration: action.configuration,
      outputArtifacts: action._outputArtifacts.map(a => ({ name: a.name })),
      runOrder: action.runOrder,
      roleArn: action.actionRole ? action.actionRole.roleArn : undefined
    };
  }

  private validateHasActions(): string[] {
    if (this._actions.length === 0) {
      return [`Stage '${this.node.id}' must have at least one action`];
    }
    return [];
  }
}
