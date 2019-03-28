import cpapi = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import { CfnPipeline } from './codepipeline.generated';
import { Pipeline, StageProps } from './pipeline';

/**
 * A Stage in a Pipeline.
 *
 * Stages are added to a Pipeline by calling {@link Pipeline#addStage},
 * which returns an instance of {@link cpapi.IStage}.
 *
 * This class is private to the CodePipeline module.
 */
export class Stage implements cpapi.IStage {
  /**
   * The Pipeline this Stage is a part of.
   */
  public readonly pipeline: cpapi.IPipeline;
  public readonly stageName: string;
  private readonly scope: cdk.Construct;
  private readonly _actions = new Array<cpapi.Action>();

  /**
   * Create a new Stage.
   */
  constructor(props: StageProps, pipeline: Pipeline) {
    cpapi.validateName('Stage', props.name);

    this.stageName = props.name;
    this.pipeline = pipeline;
    this.scope = new cdk.Construct(pipeline, this.stageName);

    for (const action of props.actions || []) {
      this.addAction(action);
    }
  }

  /**
   * Get a duplicate of this stage's list of actions.
   */
  public get actions(): cpapi.Action[] {
    return this._actions.slice();
  }

  public render(): CfnPipeline.StageDeclarationProperty {
    return {
      name: this.stageName,
      actions: this._actions.map(action => this.renderAction(action)),
    };
  }

  public addAction(action: cpapi.Action): void {
    // check for duplicate Actions and names
    if (this._actions.find(a => a.actionName === action.actionName)) {
      throw new Error(`Stage ${this.stageName} already contains an action with name '${action.actionName}'`);
    }

    this._actions.push(action);
    this.attachActionToPipeline(action);
  }

  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps): events.EventRule {
    const rule = new events.EventRule(this.scope, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: [ 'CodePipeline Stage Execution State Change' ],
      source: [ 'aws.codepipeline' ],
      resources: [ this.pipeline.pipelineArn ],
      detail: {
        stage: [ this.stageName ],
      },
    });
    return rule;
  }

  protected validate(): string[] {
    return this.validateHasActions();
  }

  private attachActionToPipeline(action: cpapi.Action) {
    const actionParent = new cdk.Construct(this.scope, action.actionName);
    (action as any)._attachActionToPipeline(this, actionParent);

    // also notify the Pipeline of the new Action
    // (useful for cross-region Actions, for example)
    (this.pipeline as any)._attachActionToRegion(this, action);
  }

  private renderAction(action: cpapi.Action): CfnPipeline.ActionDeclarationProperty {
    return {
      name: action.actionName,
      // TODO: remove "as any"
      inputArtifacts: (action as any)._inputArtifacts.map((a: any) => ({ name: a.artifactName })),
      actionTypeId: {
        category: action.category.toString(),
        version: action.version,
        owner: action.owner,
        provider: action.provider,
      },
      configuration: action.configuration,
      // TODO: remove "as any"
      outputArtifacts: (action as any)._outputArtifacts.map((a: any) => ({ name: a.artifactName })),
      runOrder: action.runOrder,
      roleArn: action.role ? action.role.roleArn : undefined
    };
  }

  private validateHasActions(): string[] {
    if (this._actions.length === 0) {
      return [`Stage '${this.stageName}' must have at least one action`];
    }
    return [];
  }
}
