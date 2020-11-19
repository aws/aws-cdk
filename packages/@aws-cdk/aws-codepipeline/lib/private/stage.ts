import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { IAction, IPipeline, IStage } from '../action';
import { CfnPipeline } from '../codepipeline.generated';
import { Pipeline, StageProps } from '../pipeline';
import { FullActionDescriptor } from './full-action-descriptor';
import * as validation from './validation';

/**
 * A Stage in a Pipeline.
 *
 * Stages are added to a Pipeline by calling {@link Pipeline#addStage},
 * which returns an instance of {@link codepipeline.IStage}.
 *
 * This class is private to the CodePipeline module.
 */
export class Stage implements IStage {
  /**
   * The Pipeline this Stage is a part of.
   */
  public readonly stageName: string;
  private readonly scope: cdk.Construct;
  private readonly _pipeline: Pipeline;
  private readonly _actions = new Array<FullActionDescriptor>();

  /**
   * Create a new Stage.
   */
  constructor(props: StageProps, pipeline: Pipeline) {
    validation.validateName('Stage', props.stageName);

    this.stageName = props.stageName;
    this._pipeline = pipeline;
    this.scope = new cdk.Construct(pipeline, this.stageName);

    for (const action of props.actions || []) {
      this.addAction(action);
    }
  }

  /**
   * Get a duplicate of this stage's list of actions.
   */
  public get actionDescriptors(): FullActionDescriptor[] {
    return this._actions.slice();
  }

  public get actions(): IAction[] {
    return this._actions.map(actionDescriptor => actionDescriptor.action);
  }

  public get pipeline(): IPipeline {
    return this._pipeline;
  }

  public render(): CfnPipeline.StageDeclarationProperty {
    // first, assign names to output Artifacts who don't have one
    for (const action of this._actions) {
      const outputArtifacts = action.action.actionProperties.outputs ?? [];

      const unnamedOutputs = outputArtifacts.filter(o => !o.artifactName);

      for (const outputArtifact of outputArtifacts) {
        if (!outputArtifact.artifactName) {
          const unsanitizedArtifactName = `Artifact_${this.stageName}_${action.actionName}` + (unnamedOutputs.length === 1
            ? ''
            : '_' + (unnamedOutputs.indexOf(outputArtifact) + 1));
          const artifactName = sanitizeArtifactName(unsanitizedArtifactName);
          (outputArtifact as any)._setName(artifactName);
        }
      }
    }

    return {
      name: this.stageName,
      actions: this._actions.map(action => action.render()),
    };
  }

  public addAction(action: IAction): void {
    validation.validateName('Action', action.actionProperties.actionName);

    // Action Names don't have to be unique yet (only at synth time), so we can't rely on the
    // ActionName producing a unique scope id
    const actionScope = new cdk.Construct(this.scope, this.freshScopeName(action.actionProperties.actionName));

    // notify the Pipeline of the new Action
    const fad = this._pipeline._attachActionToPipeline(this, action, actionScope);

    this._actions.push(fad);
  }

  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule {
    const rule = new events.Rule(this.scope, name, options);
    rule.addTarget(target);
    rule.addEventPattern({
      detailType: ['CodePipeline Stage Execution State Change'],
      source: ['aws.codepipeline'],
      resources: [this.pipeline.pipelineArn],
      detail: {
        stage: [this.stageName],
      },
    });
    return rule;
  }

  public validate(): string[] {
    return [
      ...this.validateHasActions(),
      ...this.validateActions(),
    ];
  }

  private validateHasActions(): string[] {
    if (this._actions.length === 0) {
      return [`Stage '${this.stageName}' must have at least one action`];
    }
    return [];
  }

  private validateActions(): string[] {
    const ret = new Array<string>();
    for (const action of this.actionDescriptors) {
      ret.push(...action.validateAction());
    }

    // check for duplicate Actions and names
    for (const dupe of duplicateStrings(this.actionDescriptors.map(a => a.actionName))) {
      ret.push(`Stage ${this.stageName} already contains an action with name '${dupe}'`);
    }

    return ret;
  }

  /**
   * Return an unused child scope id based on the given string
   */
  private freshScopeName(base: string) {
    let ctr = 1;
    let id = base;
    while (true) {
      if (this.scope.node.tryFindChild(id) === undefined) {
        return id;
      }
      id = `${base}${++ctr}`;
    }
  }
}

function sanitizeArtifactName(artifactName: string): string {
  // strip out some characters that are legal in Stage and Action names,
  // but not in Artifact names
  return artifactName.replace(/[@.]/g, '');
}

function* duplicateStrings(xs: string[]): IterableIterator<string> {
  const seen = new Set();
  for (const x of xs) {
    if (seen.has(x)) {
      yield x;
    }
    seen.add(x);
  }
}