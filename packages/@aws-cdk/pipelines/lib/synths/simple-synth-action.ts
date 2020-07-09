import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as events from '@aws-cdk/aws-events';
import { Construct } from '@aws-cdk/core';
import * as path from 'path';
import { cloudAssemblyBuildSpecDir } from '../private/construct-internals';
import { copyEnvironmentVariables, filterEmpty } from './_util';

/**
 * Configuration options for a SimpleSynth
 */
export interface SimpleSynthOptions {
  /**
   * The source artifact of the CodePipeline
   */
  readonly sourceArtifact: codepipeline.Artifact;

  /**
   * The artifact where the CloudAssembly should be emitted
   */
  readonly cloudAssemblyArtifact: codepipeline.Artifact;

  /**
   * Environment variables to send into build
   *
   * @default - No additional environment variables
   */
  readonly environmentVariables?: Record<string, codebuild.BuildEnvironmentVariable>;

  /**
   * Environment variables to copy over from parent env
   *
   * These are environment variables that are being used by the build.
   *
   * @default - No environment variables copied
   */
  readonly copyEnvironmentVariables?: string[];

  /**
   * Name of the build action
   *
   * @default 'Synth'
   */
  readonly actionName?: string;

  /**
   * Name of the CodeBuild project
   *
   * @default - Automatically generated
   */
  readonly projectName?: string;

  /**
   * Build environment to use for CodeBuild job
   *
   * @default BuildEnvironment.LinuxBuildImage.STANDARD_1_0
   */
  readonly environment?: codebuild.BuildEnvironment;

  /**
   * Directory inside the source where package.json and cdk.json are located
   *
   * @default - Repository root
   */
  readonly subdirectory?: string;

  /**
   * Produce additional output artifacts after the build based on the given directories
   *
   * Can be used to produce additional artifacts during the build step,
   * separate from the cloud assembly, which can be used further on in the
   * pipeline.
   *
   * Directories are evaluated with respect to `subdirectory`.
   *
   * @default - No additional artifacts generated
   */
  readonly additionalArtifacts?: AdditionalArtifact[];
}

/**
 * Construction props for SimpleSynthAction
 */
export interface SimpleSynthActionProps extends SimpleSynthOptions {
  /**
   * The synth command
   */
  readonly synthCommand: string;

  /**
   * The install command
   *
   * @default - No install required
   */
  readonly installCommand?: string;

  /**
   * The build command
   *
   * By default, we assume NPM projects are either written in JavaScript or are
   * using `ts-node`, so don't need a build command.
   *
   * Otherwise, put the build command here, for example `npm run build`.
   *
   * @default - No build required
   */
  readonly buildCommand?: string;
}

/**
 * Specification of an additional artifact to generate
 */
export interface AdditionalArtifact {
  /**
   * Directory to be packaged
   */
  readonly directory: string;

  /**
   * Artifact to represent the build directory in the pipeline
   */
  readonly artifact: codepipeline.Artifact;
}

/**
 * A standard synth with a generated buildspec
 */
export class SimpleSynthAction implements codepipeline.IAction {

  /**
   * Create a standard NPM synth action
   *
   * Uses `npm ci` to install dependencies and `npx cdk synth` to synthesize.
   *
   * If you need a build step, add `buildCommand: 'npm run build'`.
   */
  public static standardNpmSynth(options: StandardNpmSynthOptions) {
    return new SimpleSynthAction({
      ...options,
      installCommand: options.installCommand ?? 'npm ci',
      synthCommand: options.synthCommand ?? 'npx cdk synth',
    });
  }

  /**
   * Create a standard Yarn synth action
   *
   * Uses `yarn install --frozen-lockfile` to install dependencies and `npx cdk synth` to synthesize.
   *
   * If you need a build step, add `buildCommand: 'yarn build'`.
   */
  public static standardYarnSynth(options: StandardYarnSynthOptions) {
    return new SimpleSynthAction({
      ...options,
      installCommand: options.synthCommand ?? 'yarn install --frozen-lockfile',
      synthCommand: options.synthCommand ?? 'npx cdk synth',
    });
  }

  private _action?: codepipeline_actions.CodeBuildAction;
  private _actionProperties: codepipeline.ActionProperties;

  constructor(private readonly props: SimpleSynthActionProps) {
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
      actionName: props.actionName ?? 'Synth',
      category: codepipeline.ActionCategory.BUILD,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 0, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      inputs: [props.sourceArtifact],
      outputs: [props.cloudAssemblyArtifact, ...(props.additionalArtifacts ?? []).map(a => a.artifact)],
    };

    const addls = props.additionalArtifacts ?? [];
    if (Object.keys(addls).length > 0) {
      if (!props.cloudAssemblyArtifact.artifactName) {
        throw new Error('You must give all output artifacts, including the \'cloudAssemblyArtifact\', names when using \'additionalArtifacts\'');
      }
      for (const addl of addls) {
        if (!addl.artifact.artifactName) {
          throw new Error('You must give all output artifacts passed to SimpleSynthAction names when using \'additionalArtifacts\'');
        }
      }
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
    const buildCommand = this.props.buildCommand;
    const synthCommand = this.props.synthCommand;
    const installCommand = this.props.installCommand;

    const project = new codebuild.PipelineProject(scope, 'CdkBuildProject', {
      projectName: this.props.projectName ?? this.props.projectName,
      environment: this.props.environment,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: filterEmpty([
              this.props.subdirectory ? `cd ${this.props.subdirectory}` : '',
              installCommand,
            ]),
          },
          build: {
            commands: filterEmpty([
              buildCommand,
              synthCommand,
            ]),
          },
        },
        artifacts: renderArtifacts(this),
      }),
      environmentVariables: {
        ...copyEnvironmentVariables(...this.props.copyEnvironmentVariables || []),
        ...this.props.environmentVariables,
      },
    });

    this._action = new codepipeline_actions.CodeBuildAction({
      actionName: this.actionProperties.actionName,
      input: this.props.sourceArtifact,
      outputs: [this.props.cloudAssemblyArtifact, ...(this.props.additionalArtifacts ?? []).map(a => a.artifact)],
      project,
    });
    this._actionProperties = this._action.actionProperties;

    return this._action.bind(scope, stage, options);

    function renderArtifacts(self: SimpleSynthAction) {
      // save the generated files in the output artifact
      // This part of the buildspec has to look completely different depending on whether we're
      // using secondary artifacts or not.

      const cloudAsmArtifactSpec = {
        'base-directory': path.join(self.props.subdirectory ?? '.', cloudAssemblyBuildSpecDir(scope)),
        'files': '**/*',
      };

      if (self.props.additionalArtifacts) {
        const secondary: Record<string, any> = {};
        if (!self.props.cloudAssemblyArtifact.artifactName) {
          throw new Error('When using additional output artifacts, you must also name the CloudAssembly artifact');
        }
        secondary[self.props.cloudAssemblyArtifact.artifactName] = cloudAsmArtifactSpec;
        self.props.additionalArtifacts.forEach((art) => {
          if (!art.artifact.artifactName) {
            throw new Error('You must give the output artifact a name');
          }
          secondary[art.artifact.artifactName] = {
            'base-directory': path.join(self.props.subdirectory ?? '.', art.directory),
            'files': '**/*',
          };
        });

        return { 'secondary-artifacts': secondary };
      }

      return cloudAsmArtifactSpec;
    }
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

/**
 * Options for a convention-based synth using NPM
 */
export interface StandardNpmSynthOptions extends SimpleSynthOptions {
  /**
   * The install command
   *
   * @default 'npm ci'
   */
  readonly installCommand?: string;

  /**
   * The build command
   *
   * By default, we assume NPM projects are either written in JavaScript or are
   * using `ts-node`, so don't need a build command.
   *
   * Otherwise, put the build command here, for example `npm run build`.
   *
   * @default - No build required
   */
  readonly buildCommand?: string;

  /**
   * The synth command
   *
   * @default 'npx cdk synth'
   */
  readonly synthCommand?: string;
}

/**
 * Options for a convention-based synth using Yarn
 */
export interface StandardYarnSynthOptions extends SimpleSynthOptions {
  /**
   * The install command
   *
   * @default 'yarn install --frozen-lockfile'
   */
  readonly installCommand?: string;

  /**
   * The build command
   *
   * By default, we assume NPM projects are either written in JavaScript or are
   * using `ts-node`, so don't need a build command.
   *
   * Otherwise, put the build command here, for example `npm run build`.
   *
   * @default - No build required
   */
  readonly buildCommand?: string;

  /**
   * The synth command
   *
   * @default 'npx cdk synth'
   */
  readonly synthCommand?: string;
}