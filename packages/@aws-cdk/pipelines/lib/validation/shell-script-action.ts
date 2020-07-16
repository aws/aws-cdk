import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as events from '@aws-cdk/aws-events';
import { Construct } from '@aws-cdk/core';
import { StackOutput } from '../stage';

/**
 * Properties for ShellScriptValidation
 */
export interface ShellScriptActionProps {
  /**
   * Name of the validation action in the pipeline
   */
  readonly actionName: string;

  /**
   * Stack outputs to make available as environment variables
   *
   * @default - No outputs used
   */
  readonly useOutputs?: Record<string, StackOutput>;

  /**
   * Commands to run
   */
  readonly commands: string[];

  /**
   * Bash options to set at the start of the script
   *
   * @default '-eu' (errexit and nounset)
   */
  readonly bashOptions?: string;

  /**
   * Additional artifacts to use as input for the CodeBuild project
   *
   * You can use these files to load more complex test sets into the
   * shellscript build environment.
   *
   * The files artifact given here will be unpacked into the current
   * working directory, the other ones will be unpacked into directories
   * which are available through the environment variables
   * $CODEBUILD_SRC_DIR_<artifactName>.
   *
   * The CodeBuild job must have at least one input artifact, so you
   * must provide either at least one additional artifact here or one
   * stack output using `useOutput`.
   *
   * @default - No additional artifacts
   */
  readonly additionalArtifacts?: codepipeline.Artifact[];

  /**
   * RunOrder for this action
   *
   * Use this to sequence the shell script after the deployments.
   *
   * The default value is 100 so you don't have to supply the value if you just
   * want to run this after the application stacks have been deployed, and you
   * don't have more than 100 stacks.
   *
   * @default 100
   */
  readonly runOrder?: number;
}

/**
 * Validate a revision using shell commands
 */
export class ShellScriptAction implements codepipeline.IAction {
  private _project?: codebuild.IProject;

  private _action?: codepipeline_actions.CodeBuildAction;
  private _actionProperties: codepipeline.ActionProperties;

  constructor(private readonly props: ShellScriptActionProps) {
    // A number of actionProperties get read before bind() is even called (so before we
    // have made the Project and can construct the actual CodeBuildAction)
    //
    // - actionName
    // - resource
    // - region
    // - category
    // - role
    // - owner
    this._actionProperties = {
      actionName: props.actionName,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 0, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      inputs: [],
      outputs: [],
    };

    if (Object.keys(props.useOutputs ?? {}).length + (props.additionalArtifacts ?? []).length === 0) {
      throw new Error('You must supply either \'useOutputs\' or \'additionalArtifacts\', since a CodeBuild Action must always have at least one input artifact.');
    }
  }

  /**
   * Exists to implement IAction
   */
  public get actionProperties(): codepipeline.ActionProperties {
    return this._actionProperties;
  }

  /**
   * Exists to implement IAction
   */
  public bind(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const inputs = new Array<codepipeline.Artifact>();
    inputs.push(...this.props.additionalArtifacts ?? []);

    const envVarCommands = new Array<string>();

    const bashOptions = this.props.bashOptions ?? '-eu';
    if (bashOptions) {
      envVarCommands.push(`set ${bashOptions}`);
    }
    for (const [varName, output] of Object.entries(this.props.useOutputs ?? {})) {
      const outputArtifact = output.artifactFile;

      // Add the artifact to the list of inputs, if it's not in there already. Determine
      // the location where CodeBuild is going to stick it based on whether it's the first (primary)
      // input or an 'extra input', then parse.
      let artifactIndex = inputs.findIndex(a => a.artifactName === outputArtifact.artifact.artifactName);
      if (artifactIndex === -1) {
        artifactIndex = inputs.push(outputArtifact.artifact) - 1;
      }
      const dirEnv = artifactIndex === 0 ? 'CODEBUILD_SRC_DIR' : `CODEBUILD_SRC_DIR_${outputArtifact.artifact.artifactName}`;
      envVarCommands.push(`export ${varName}="$(node -pe 'require(process.env.${dirEnv} + "/${outputArtifact.fileName}")["${output.outputName}"]')"`);
    }

    this._project = new codebuild.PipelineProject(scope, 'Project', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              ...envVarCommands,
              ...this.props.commands,
            ],
          },
        },
      }),
    });

    this._action = new codepipeline_actions.CodeBuildAction({
      actionName: this.props.actionName,
      input: inputs[0],
      extraInputs: inputs.slice(1),
      runOrder: this.props.runOrder ?? 100,
      project: this._project,
    });
    // Replace the placeholder actionProperties at the last minute
    this._actionProperties = this._action.actionProperties;

    return this._action.bind(scope, stage, options);
  }

  /**
   * Project generated to run the shell script in
   */
  public get project(): codebuild.IProject {
    if (!this._project) {
      throw new Error('Project becomes available after ShellScriptAction has been bound to a stage');
    }
    return this._project;
  }

  /**
   * Exists to implement IAction
   */
  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule {
    if (!this._action) {
      throw new Error('Need bind() first');
    }

    return this._action.onStateChange(name, target, options);
  }
}
