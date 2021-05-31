
import * as crypto from 'crypto';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { mapValues, noEmptyObject } from '../_util';
import { WorkflowShellAction, ShellArtifact } from '../workflow';
import { ArtifactMap } from './artifact-map';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct } from '@aws-cdk/core';

/**
 * Construction props for SimpleSynthAction
 */
export interface CodePipelineShellActionProps {
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
   * Install commands
   */
  readonly installCommands?: string[];

  /**
   * Build commands
   */
  readonly buildCommands: string[];


  /**
   * Build environment
   */
  readonly buildEnvironment?: codebuild.BuildEnvironment;


  /**
   * The environment variables that your builds can use.
   */
  readonly environmentVariables?: Record<string, string>;

  /**
   * Inputs
   */
  readonly inputs?: ShellArtifact[];

  /**
   * Outputs
   */
  readonly outputs?: ShellArtifact[];
}

/**
 * A standard synth with a generated buildspec
 */
export class CodeBuildShellAction implements codepipeline.IAction, iam.IGrantable {
  public static propsFromWorkflowAction(wf: WorkflowShellAction) {
    return {
      installCommands: wf.installCommands,
      buildCommands: wf.commands,
      commands: wf.commands,
      environmentVariables: wf.environmentVariables,
      inputs: wf.inputs,
      outputs: wf.outputs,
    } as const;
  }

  private _action?: codepipeline_actions.CodeBuildAction;
  private _actionProperties: codepipeline.ActionProperties;
  private _project?: codebuild.IProject;

  private readonly mainInput: ShellArtifact;
  private readonly extraInputs: ShellArtifact[];

  private readonly inputArtifact: codepipeline.Artifact;
  private readonly extraInputArtifacts: codepipeline.Artifact[];
  private readonly outputArtifacts: codepipeline.Artifact[];

  constructor(private readonly props: CodePipelineShellActionProps) {
    const inputs = props.inputs ?? [];
    const outputs = props.outputs ?? [];

    const mainInputs = inputs.filter(x => x.directory === '.');
    if (mainInputs.length !== 1) {
      throw new Error('CodeBuild action must have exactly one input with directory \'.\'');
    }
    this.mainInput = mainInputs[0];
    this.extraInputs = inputs.filter(x => x !== this.mainInput);

    this.inputArtifact = props.artifactMap.toCodePipeline(this.mainInput.artifact);
    this.extraInputArtifacts = this.extraInputs.map(x => props.artifactMap.toCodePipeline(x.artifact));
    this.outputArtifacts = outputs.map(x => props.artifactMap.toCodePipeline(x.artifact));

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
    const buildSpec = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: (this.props.installCommands?.length ?? 0) > 0 ? { commands: this.props.installCommands } : undefined,
        build: this.props.buildCommands.length > 0 ? { commands: this.props.buildCommands } : undefined,
      },
      artifacts: this.renderArtifactsBuildSpec(this.props.outputs ?? []),
    });

    const environment = mergeBuildEnvironments(
      this.props.buildEnvironment ?? {},
      {
        environmentVariables: noEmptyObject(mapValues(this.props.environmentVariables ?? {}, value => ({ value }))),
      });

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

  private renderArtifactsBuildSpec(outputs: ShellArtifact[]) {
    // save the generated files in the output artifact
    // This part of the buildspec has to look completely different depending on whether we're
    // using secondary artifacts or not.

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

export function mergeBuildEnvironments(env: codebuild.BuildEnvironment, ...envs: codebuild.BuildEnvironment[]) {
  envs.unshift(env);
  while (envs.length > 1) {
    const [a, b] = envs.splice(envs.length - 2, 2);
    envs.push(merge2(a, b));
  }
  return envs[0];

  function merge2(a: codebuild.BuildEnvironment, b: codebuild.BuildEnvironment): codebuild.BuildEnvironment {
    return {
      buildImage: b.buildImage ?? a.buildImage,
      computeType: b.computeType ?? a.computeType,
      environmentVariables: {
        ...a.environmentVariables,
        ...b.environmentVariables,
      },
      privileged: b.privileged ?? a.privileged,
    };
  }
}
