import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as events from '@aws-cdk/aws-events';
import { Construct, Lazy } from '@aws-cdk/core';

/**
 * Low-level class for generic CodePipeline Actions.
 *
 * WARNING: this class should not be externally exposed, but is currently visible
 * because of a limitation of jsii (https://github.com/aws/jsii/issues/524).
 *
 * This class will disappear in a future release and should not be used.
 *
 * @experimental
 */
export abstract class Action implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  private _pipeline?: codepipeline.IPipeline;
  private _stage?: codepipeline.IStage;
  private _scope?: Construct;
  private readonly customerProvidedNamespace?: string;
  private readonly namespaceOrToken: string;
  private actualNamespace?: string;
  private variableReferenced = false;

  protected constructor(actionProperties: codepipeline.ActionProperties) {
    this.customerProvidedNamespace = actionProperties.variablesNamespace;
    this.namespaceOrToken = Lazy.string({
      produce: () => {
      // make sure the action was bound (= added to a pipeline)
        if (this.actualNamespace !== undefined) {
          return this.customerProvidedNamespace !== undefined
          // if a customer passed a namespace explicitly, always use that
            ? this.customerProvidedNamespace
          // otherwise, only return a namespace if any variable was referenced
            : (this.variableReferenced ? this.actualNamespace : undefined);
        } else {
          throw new Error(`Cannot reference variables of action '${this.actionProperties.actionName}', ` +
          'as that action was never added to a pipeline');
        }
      },
    });
    this.actionProperties = {
      ...actionProperties,
      variablesNamespace: this.namespaceOrToken,
    };
  }

  public bind(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    this._pipeline = stage.pipeline;
    this._stage = stage;
    this._scope = scope;

    this.actualNamespace = this.customerProvidedNamespace === undefined
      // default a namespace name, based on the stage and action names
      ? `${stage.stageName}_${this.actionProperties.actionName}_NS`
      : this.customerProvidedNamespace;

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
  protected abstract bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig;

  private get pipeline(): codepipeline.IPipeline {
    if (this._pipeline) {
      return this._pipeline;
    } else {
      throw new Error('Action must be added to a stage that is part of a pipeline before using onStateChange');
    }
  }

  private get stage(): codepipeline.IStage {
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
