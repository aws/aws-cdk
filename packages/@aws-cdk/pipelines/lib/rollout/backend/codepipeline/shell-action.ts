import * as crypto from 'crypto';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Stack } from '@aws-cdk/core';
import { mapValues, noEmptyObject } from '../../_util';
import { ExecutionShellAction, ShellArtifact } from '../../graph';
import { CommandImage, ComputeType } from '../../shared';
import { ArtifactMap } from './artifact-map';
import { CodePipelineImage } from './codepipeline-image';

/**
 * Construction props for SimpleSynthAction
 */
export interface CodePipelineShellActionProps {
  /**
   * Execution node the shell action's configuration will be based on
   */
  readonly actionBase: ExecutionShellAction;

  /**
   * Name of the action
   */
  readonly actionName: string;

  /**
   * RunOrder for this action
   */
  readonly runOrder: number;

  /**
   * Artifact object translator
   */
  readonly artifactMap: ArtifactMap;

  /**
   * Name for the generated CodeBuild project
   *
   * @default - Automatically generated
   */
  readonly projectName?: string;

  /**
   * The VPC where to execute the SimpleSynth.
   *
   * @default - No VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Which subnets to use.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default - All private subnets.
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * Policy statements to add to role used during the synth
   *
   * Can be used to add acces to a CodeArtifact repository etc.
   *
   * @default - No policy statements added to CodeBuild Project Role
   */
  readonly rolePolicyStatements?: iam.PolicyStatement[];

  /**
   * Include a hash of the build config into the invocation
   */
  readonly includeBuildHashInPipeline?: boolean;

  /**
   * Compute type
   *
   * @default - CodeBuild default
   */
  readonly computeType?: ComputeType;

  /**
   * Command image
   *
   * @default - CodeBuild default
   */
  readonly commandImage?: CommandImage;

}

/**
 * A standard synth with a generated buildspec
 */
export class CodePipelineShellAction implements codepipeline.IAction, iam.IGrantable {
  private _action?: codepipeline_actions.CodeBuildAction;
  private _actionProperties: codepipeline.ActionProperties;
  private _project?: codebuild.IProject;

  private readonly mainInput: ShellArtifact;
  private readonly extraInputs: ShellArtifact[];

  private readonly inputArtifact: codepipeline.Artifact;
  private readonly extraInputArtifacts: codepipeline.Artifact[];
  private readonly outputArtifacts: codepipeline.Artifact[];

  constructor(private readonly props: CodePipelineShellActionProps) {
    const base = props.actionBase;

    const mainInputs = base.inputs.filter(x => x.directory === '.');
    if (mainInputs.length !== 1) {
      throw new Error('CodeBuild action must have exactly one input with directory \'.\'');
    }
    this.mainInput = mainInputs[0];
    this.extraInputs = base.inputs.filter(x => x !== this.mainInput);

    this.inputArtifact = props.artifactMap.toCodePipeline(this.mainInput.artifact);
    this.extraInputArtifacts = this.extraInputs.map(x => props.artifactMap.toCodePipeline(x.artifact));
    this.outputArtifacts = base.outputs.map(x => props.artifactMap.toCodePipeline(x.artifact));

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
      inputs: this.inputArtifact ? [this.inputArtifact, ...this.extraInputArtifacts] : undefined,
      outputs: this.outputArtifacts,
      runOrder: props.runOrder,
    };
  }

  /**
   * Exists to implement IAction
   */
  public get actionProperties(): codepipeline.ActionProperties {
    return this._actionProperties;
  }

  /**
   * Project generated to run the synth command
   */
  public get project(): codebuild.IProject {
    if (!this._project) {
      throw new Error('Project becomes available after SimpleSynthAction has been bound to a stage');
    }
    return this._project;
  }

  /**
   * Exists to implement IAction
   */
  public bind(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const base = this.props.actionBase;

    const buildSpec = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: base.installCommands.length > 0 ? { commands: base.installCommands } : undefined,
        build: base.buildCommands.length > 0 ? { commands: base.buildCommands } : undefined,
      },
      artifacts: this.renderArtifactsBuildSpec(),
    });

    // TODO: Change image
    // TODO: Customize ComputeType
    const environment: codebuild.BuildEnvironment = {
      buildImage: translateBuildImage(base.image),
      computeType: translateComputeType(base.computeType),
      privileged: base.buildsDockerImages ? true : undefined,
      environmentVariables: noEmptyObject(mapValues(base.environmentVariables, value => ({ value }))),
    };

    // A hash over the values that make the CodeBuild Project unique (and necessary
    // to restart the pipeline if one of them changes). projectName is not necessary to include
    // here because the pipeline will definitely restart if projectName changes.
    // (Resolve tokens)
    const projectConfigHash = hash(Stack.of(scope).resolve({
      environment: serializeBuildEnvironment(environment),
      buildSpecString: buildSpec.toBuildSpec(),
    }));

    const project = new codebuild.PipelineProject(scope, 'CdkBuildProject', {
      projectName: this.props.projectName,
      environment,
      vpc: this.props.vpc,
      subnetSelection: this.props.subnetSelection,
      buildSpec,
    });

    if (this.props.rolePolicyStatements !== undefined) {
      this.props.rolePolicyStatements.forEach(policyStatement => {
        project.addToRolePolicy(policyStatement);
      });
    }

    this._project = project;

    this._action = new codepipeline_actions.CodeBuildAction({
      actionName: this.actionProperties.actionName,
      input: this.inputArtifact,
      extraInputs: this.extraInputArtifacts,
      outputs: this.outputArtifacts,
      project,
      runOrder: this.props.runOrder,

      // Inclusion of the hash here will lead to the pipeline structure for any changes
      // made the config of the underlying CodeBuild Project.
      // Hence, the pipeline will be restarted. This is necessary if the users
      // adds (for example) build or test commands to the buildspec.
      environmentVariables: this.props.includeBuildHashInPipeline ? {
        _PROJECT_CONFIG_HASH: { value: projectConfigHash },
      } : undefined,
    });
    this._actionProperties = this._action.actionProperties;

    return this._action.bind(scope, stage, options);

  }

  /**
   * The CodeBuild Project's principal
   */
  public get grantPrincipal(): iam.IPrincipal {
    return this.project.grantPrincipal;
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

  private renderArtifactsBuildSpec() {
    // save the generated files in the output artifact
    // This part of the buildspec has to look completely different depending on whether we're
    // using secondary artifacts or not.

    const outputs = this.props.actionBase.outputs;
    if (outputs.length === 0) { return undefined; }

    if (outputs.length === 1) {
      return {
        'base-directory': outputs[0].directory,
        'files': '**/*',
      };
    }

    const secondary: Record<string, any> = {};
    for (const output of outputs) {
      const art = this.props.artifactMap.toCodePipeline(output.artifact);

      if (!art.artifactName) {
        throw new Error('You must give the output artifact a name');
      }
      secondary[art.artifactName] = {
        'base-directory': output.directory,
        'files': '**/*',
      };
    }

    return { 'secondary-artifacts': secondary };
  }
}

function hash<A>(obj: A) {
  const d = crypto.createHash('sha256');
  d.update(JSON.stringify(obj));
  return d.digest('hex');
}

/**
 * Serialize a build environment to data (get rid of constructs & objects), so we can JSON.stringify it
 */
function serializeBuildEnvironment(env: codebuild.BuildEnvironment) {
  return {
    privileged: env.privileged,
    environmentVariables: env.environmentVariables,
    type: env.buildImage?.type,
    imageId: env.buildImage?.imageId,
    computeType: env.computeType,
    imagePullPrincipalType: env.buildImage?.imagePullPrincipalType,
    secretsManagerArn: env.buildImage?.secretsManagerCredentials?.secretArn,
  };
}

function translateComputeType(computeType: ComputeType): codebuild.ComputeType | undefined {
  switch (computeType.computeTypeClass) {
    case 'default': return undefined;
    case 'large': return codebuild.ComputeType.LARGE;
    case 'medium': return codebuild.ComputeType.MEDIUM;
    case 'small': return codebuild.ComputeType.SMALL;
    default:
      throw new Error(`Unrecognized compute type for CodeBuild pipelines: ${computeType.computeTypeClass}`);
  }
}

function translateBuildImage(image: CommandImage): codebuild.IBuildImage {
  if (image === CommandImage.GENERIC_LINUX) { return codebuild.LinuxBuildImage.STANDARD_4_0; }
  if (image === CommandImage.GENERIC_WINDOWS) { return codebuild.WindowsBuildImage.WINDOWS_BASE_2_0; }

  if (image instanceof CodePipelineImage) {
    if (image.codeBuildImage) { return image.codeBuildImage; }
  }

  throw new Error(`Don't know how to get CodeBuild image from: ${image}`);
}