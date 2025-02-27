import { Construct, Node } from 'constructs';
import { FullActionDescriptor } from './full-action-descriptor';
import * as validation from './validation';
import * as events from '../../../aws-events';
import * as cdk from '../../../core';
import { Token } from '../../../core';
import { IAction, IPipeline, IStage } from '../action';
import { Artifact } from '../artifact';
import { CfnPipeline } from '../codepipeline.generated';
import { Pipeline } from '../pipeline';


/**
 * Construction properties of a Pipeline Stage.
 */
export interface StageProps {
  /**
   * The physical, human-readable name to assign to this Pipeline Stage.
   */
  readonly stageName: string;

  /**
   * The list of Actions to create this Stage with.
   * You can always add more Actions later by calling `IStage#addAction`.
   */
  readonly actions?: IAction[];

  /**
   * Whether to enable transition to this stage.
   *
   * @default true
   */
  readonly transitionToEnabled?: boolean;

  /**
   * The reason for disabling transition to this stage. Only applicable
   * if `transitionToEnabled` is set to `false`.
   *
   * @default 'Transition disabled'
   */
  readonly transitionDisabledReason?: string;

  /**
   * The method to use when a stage allows entry.
   *
   * For example, configuring this field for conditions will allow entry to the stage when the conditions are met.
   */
  readonly beforeEntry?: BeforeEntryConditions;

  /**
   * The method to use when a stage has not completed successfully.
   *
   * For example, configuring this field for rollback will roll back a failed stage automatically to the last successful pipeline execution in the stage.
   */
  readonly onFailure?: FailureConditions;

  /**
   * The method to use when a stage has succeeded.
   *
   * For example, configuring this field for conditions will allow the stage to succeed when the conditions are met.
   */
  readonly onSuccess?: SuccessConditions;
}

export interface StageOptions extends StageProps {
  readonly placement?: StagePlacement;
}

/**
 * Allows you to control where to place a new Stage when it's added to the Pipeline.
 * Note that you can provide only one of the below properties -
 * specifying more than one will result in a validation error.
 *
 * @see #rightBefore
 * @see #justAfter
 */
export interface StagePlacement {
  /**
   * Inserts the new Stage as a parent of the given Stage
   * (changing its current parent Stage, if it had one).
   */
  readonly rightBefore?: IStage;

  /**
   * Inserts the new Stage as a child of the given Stage
   * (changing its current child Stage, if it had one).
   */
  readonly justAfter?: IStage;
}
  /**
   * The conditions for making checks for entry to a stage.
   *
   */
export interface BeforeEntryConditions {
  /**
   * The conditions that are configured as entry conditions.
   *
   */ 
  readonly conditions: Condition[];
}
/**
 * The configuration that specifies the result, such as rollback, to occur upon stage failure.
 *
 * For more information about conditions, see [Stage conditions](https://docs.aws.amazon.com/codepipeline/latest/userguide/stage-conditions.html) and [How do stage conditions work?](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-how-it-works-conditions.html) .
 */
export interface FailureConditions {
  /**
   * The conditions that are configured as failure conditions.
   *
   * For more information about conditions, see [Stage conditions](https://docs.aws.amazon.com/codepipeline/latest/userguide/stage-conditions.html) and [How do stage conditions work?](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-how-it-works-conditions.html) .
   */  
  readonly conditions?: Condition[];
  /**
   * The specified result for when the failure conditions are met, such as rolling back the stage.
   */
  readonly result?: Result;
  /**
   * The retry configuration specifies automatic retry for a failed stage, along with the configured retry mode.
   */
  readonly retryConfiguration?: RetryConfiguration;
}

/**
 * The conditions for making checks that, if met, succeed a stage.
 *
 * For more information about conditions, see [Stage conditions](https://docs.aws.amazon.com/codepipeline/latest/userguide/stage-conditions.html) and [How do stage conditions work?](https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts-how-it-works-conditions.html) .
 */
export interface SuccessConditions {
  /**
   * The conditions that are success conditions.
   */
  readonly conditions: Condition[];
}
/**
 * The condition for the stage. A condition is made up of the rules and the result for the condition.
 * 
 */
export interface Condition {
  /**
   * The action to be done when the condition is met.
   *
   * For example, rolling back an execution for a failure condition.
   */  
  readonly result?: Result;
  /**
   * The rules that make up the condition.
   */
  readonly rules?: Rule[];
}
/**
 * Represents information about the rule to be created for an associated condition.
 * An example would be creating a new rule for an entry condition, such as a rule that checks for a test result before allowing the run to enter the deployment stage. For more information about conditions, see [Stage conditions](https://docs.aws.amazon.com/codepipeline/latest/userguide/stage-conditions.html) . For more information about rules, see the [AWS CodePipeline rule reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/rule-reference.html) .
 */
export interface Rule {
  /**
   * The action configuration fields for the rule.
   */
  readonly name: string;
  /**
   * The ID for the rule type, which is made up of the combined values for category, owner, provider, and version.
   */  
  readonly ruleTypeId: RuleTypeId;
  /**
   * The shell commands to run with your commands rule in CodePipeline.
   *
   * All commands are supported except multi-line formats. While CodeBuild logs and permissions are used, you do not need to create any resources in CodeBuild.
   *
   * > Using compute time for this action will incur separate charges in AWS CodeBuild .
   */  
  readonly commands?: string[];
  /**
   * The action configuration fields for the rule.
   */  
  readonly configuration?: Map<string, string>;
  /**
   * The input artifacts fields for the rule, such as specifying an input file for the rule.
   */  
  readonly inputArtifacts?: InputArtifact[];  
  /**
   * The Region for the condition associated with the rule.
   */  
  readonly region?: string;
  /**
   * The pipeline role ARN associated with the rule.
   */  
  readonly roleArn?: string;
  readonly timeoutInMinutes?: number; 
}

export interface RuleTypeId {
  /**
   * A category defines what kind of rule can be run in the stage, and constrains the provider type for the rule.
   *
   * The valid category is `Rule` .
   */  
  readonly category: string;
  /**
   * The rule provider, such as the `DeploymentWindow` rule.
   *
   * For a list of rule provider names, see the rules listed in the [AWS CodePipeline rule reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/rule-reference.html) .
   */  
  readonly provider: string;
  /**
   * The creator of the rule being called.
   *
   * The valid value for the `Owner` field in the rule category is `AWS` .
   */  
  readonly owner?: string;
  /**
   * A string that describes the rule version.
   */
  readonly version?: string;
}

/**
 * Represents information about an artifact to be worked on, such as a test or build artifact.
 */
export interface InputArtifact {
   /**
   * The name of the artifact to be worked on (for example, "My App").
   *
   * Artifacts are the files that are worked on by actions in the pipeline. See the action configuration for each action for details about artifact parameters. For example, the S3 source action input artifact is a file name (or file path), and the files are generally provided as a ZIP file. Example artifact name: SampleApp_Windows.zip
   *
   * The input artifact of an action must exactly match the output artifact declared in a preceding action, but the input artifact does not have to be the next action in strict sequence from the action that provided the output artifact. Actions in parallel can declare different output artifacts, which are in turn consumed by different following actions.
   */
  readonly name: string;
}

/**
 * The retry configuration specifies automatic retry for a failed stage, along with the configured retry mode.
 */
export interface RetryConfiguration {
  /**
   * The method that you want to configure for automatic stage retry on stage failure.
   *
   * You can specify to retry only failed action in the stage or all actions in the stage.
   */
  readonly retryMode?: RetryMode;
}


export enum Result {
  /**
   * Rollback result
   */
  ROLLBACK = 'ROLLBACK',
  /**
   * Fail request
   */
  FAIL = 'FAIL',
  /**
   * Retry request
   */
  RETRY = 'RETRY',
  /**
   * Skip request
   */
  SKIP = 'SKIP'
}

export enum RetryMode {
  FAILED_ACTIONS = 'FAILED_ACTIONS',
  ALL_ACTIONS = 'ALL_ACTIONS'
}
/**
 * A Stage in a Pipeline.
 *
 * Stages are added to a Pipeline by calling `Pipeline#addStage`,
 * which returns an instance of `codepipeline.IStage`.
 *
 * This class is private to the CodePipeline module.
 */
export class Stage implements IStage {
  /**
   * The Pipeline this Stage is a part of.
   */
  public readonly stageName: string;
  public readonly transitionToEnabled: boolean;
  public readonly transitionDisabledReason: string;
  private readonly scope: Construct;
  private readonly _pipeline: Pipeline;
  private readonly _actions = new Array<FullActionDescriptor>();
  private readonly _beforeEntry: BeforeEntryConditions;
  private readonly _onFailure: FailureConditions;
  private readonly _onSuccess: SuccessConditions;

  /**
   * Create a new Stage.
   */
  constructor(props: StageProps, pipeline: Pipeline) {
    validation.validateName('Stage', props.stageName);

    this.stageName = props.stageName;
    this.transitionToEnabled = props.transitionToEnabled ?? true;
    this.transitionDisabledReason = props.transitionDisabledReason ?? 'Transition disabled';
    this._pipeline = pipeline;
    this._beforeEntry = props.beforeEntry ?? { conditions: []} as BeforeEntryConditions;
    this._onSuccess = props.onSuccess ?? { conditions: []} as SuccessConditions;
    this._onFailure = props.onFailure ?? { conditions: [], result: Result.FAIL } as FailureConditions;
    this.scope = new Construct(pipeline, this.stageName);

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
      const outputArtifacts = action.outputs;

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
      actions: this._actions.map(action => this.renderAction(action)),
      beforeEntry: this._beforeEntry,
      onFailure: this._onFailure,
      onSuccess: this._onSuccess,
    };
  }

  public addAction(action: IAction): void {
    const actionName = action.actionProperties.actionName;
    // validate the name
    validation.validateName('Action', actionName);

    // check for duplicate Actions and names
    if (this._actions.find(a => a.actionName === actionName)) {
      throw new Error(`Stage ${this.stageName} already contains an action with name '${actionName}'`);
    }

    this._actions.push(this.attachActionToPipeline(action));
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
      ret.push(...this.validateAction(action));
    }
    return ret;
  }

  private validateAction(action: FullActionDescriptor): string[] {
    return validation.validateArtifactBounds('input', action.inputs, action.artifactBounds.minInputs,
      action.artifactBounds.maxInputs, action.category, action.provider)
      .concat(validation.validateArtifactBounds('output', action.outputs, action.artifactBounds.minOutputs,
        action.artifactBounds.maxOutputs, action.category, action.provider),
      );
  }

  private attachActionToPipeline(action: IAction): FullActionDescriptor {
    // notify the Pipeline of the new Action
    //
    // It may be that a construct already exists with the given action name (CDK Pipelines
    // may do this to maintain construct tree compatibility between versions).
    //
    // If so, we simply reuse it.
    let actionScope = Node.of(this.scope).tryFindChild(action.actionProperties.actionName) as Construct | undefined;
    if (!actionScope) {
      let id = action.actionProperties.actionName;
      if (Token.isUnresolved(id)) {
        id = findUniqueConstructId(this.scope, action.actionProperties.provider);
      }
      actionScope = new Construct(this.scope, id);
    }
    return this._pipeline._attachActionToPipeline(this, action, actionScope);
  }

  private renderAction(action: FullActionDescriptor): CfnPipeline.ActionDeclarationProperty {
    const outputArtifacts = cdk.Lazy.any({ produce: () => this.renderArtifacts(action.outputs) }, { omitEmptyArray: true });
    const inputArtifacts = cdk.Lazy.any({ produce: () => this.renderArtifacts(action.inputs) }, { omitEmptyArray: true });
    return {
      name: action.actionName,
      inputArtifacts,
      outputArtifacts,
      actionTypeId: {
        category: action.category.toString(),
        version: action.version,
        owner: action.owner,
        provider: action.provider,
      },
      configuration: action.configuration,
      commands: action.commands,
      outputVariables: action.outputVariables,
      runOrder: action.runOrder,
      timeoutInMinutes: action.timeout?.toMinutes(),
      roleArn: action.role ? action.role.roleArn : undefined,
      region: action.region,
      namespace: action.namespace,
    };
  }

  private renderArtifacts(artifacts: Artifact[]): CfnPipeline.OutputArtifactProperty[] {
    return artifacts
      .filter(a => a.artifactName)
      .map(a => ({ name: a.artifactName!, files: a.artifactFiles }));
  }
}

function sanitizeArtifactName(artifactName: string): string {
  // strip out some characters that are legal in Stage and Action names,
  // but not in Artifact names
  return artifactName.replace(/[@.]/g, '');
}

function findUniqueConstructId(scope: Construct, prefix: string) {
  let current = prefix;
  let ctr = 1;
  while (Node.of(scope).tryFindChild(current) !== undefined) {
    current = `${prefix}${++ctr}`;
  }
  return current;
}
