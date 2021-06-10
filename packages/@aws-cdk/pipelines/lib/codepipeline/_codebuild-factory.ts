import * as crypto from 'crypto';
import * as path from 'path';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { FileSetLocation, ScriptStep } from '../blueprint';
import { mapValues, noEmptyObject } from '../private/javascript';
import { ArtifactMap } from './artifact-map';
import { ICodePipelineActionFactory, CodePipelineActionOptions, CodePipelineActionFactoryResult } from './codepipeline-action-factory';

export interface CodeBuildFactoryProps {
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
   * Build environment
   */
  readonly buildEnvironment?: codebuild.BuildEnvironment;
}

/**
 * Produce a CodeBuild project from a RunScript step and some CodeBuild-specific customizations
 *
 * The functionality here is shared between the `CodePipelinEngine` translating a `ScriptStep` into
 * a CodeBuild project, as well as the `CodeBuildStep` straight up.
 */
export class CodeBuildFactory implements ICodePipelineActionFactory {
  private _project?: codebuild.IProject;

  constructor(private readonly constructId: string, private readonly runScript: ScriptStep, private readonly props: CodeBuildFactoryProps) {
  }

  public get project(): codebuild.IProject {
    if (!this._project) {
      throw new Error('Project becomes available after produce() has been called');
    }
    return this._project;
  }

  public produce(options: CodePipelineActionOptions): CodePipelineActionFactoryResult {
    const mainInput = this.runScript.inputs.find(x => x.directory === '.')!;
    const extraInputs = this.runScript.inputs.filter(x => x.directory !== '.');

    const inputArtifact = options.artifacts.toCodePipeline(mainInput.fileSet);
    const extraInputArtifacts = extraInputs.map(x => options.artifacts.toCodePipeline(x.fileSet));
    const outputArtifacts = this.runScript.outputs.map(x => options.artifacts.toCodePipeline(x.fileSet));

    const installCommands = [
      ...generateInputArtifactLinkCommands(options.artifacts, extraInputs),
      ...this.runScript.installCommands ?? [],
    ];

    const buildSpec = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: (installCommands.length ?? 0) > 0 ? { commands: installCommands } : undefined,
        build: this.runScript.commands.length > 0 ? { commands: this.runScript.commands } : undefined,
      },
      artifacts: renderArtifactsBuildSpec(options.artifacts, this.runScript.outputs ?? []),
    });

    const environment = mergeBuildEnvironments(
      this.props.buildEnvironment ?? {},
      {
        environmentVariables: noEmptyObject(mapValues(this.runScript.env ?? {}, value => ({ value }))),
      });

    // A hash over the values that make the CodeBuild Project unique (and necessary
    // to restart the pipeline if one of them changes). projectName is not necessary to include
    // here because the pipeline will definitely restart if projectName changes.
    // (Resolve tokens)
    const projectConfigHash = hash(Stack.of(options.scope).resolve({
      environment: serializeBuildEnvironment(environment),
      buildSpecString: buildSpec.toBuildSpec(),
    }));

    const project = new codebuild.PipelineProject(options.scope, this.constructId, {
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

    const action = new codepipeline_actions.CodeBuildAction({
      actionName: options.actionName ?? this.runScript.id,
      input: inputArtifact,
      extraInputs: extraInputArtifacts,
      outputs: outputArtifacts,
      project,
      runOrder: options.runOrder,

      // Inclusion of the hash here will lead to the pipeline structure for any changes
      // made the config of the underlying CodeBuild Project.
      // Hence, the pipeline will be restarted. This is necessary if the users
      // adds (for example) build or test commands to the buildspec.
      environmentVariables: this.props.includeBuildHashInPipeline ? {
        _PROJECT_CONFIG_HASH: { value: projectConfigHash },
      } : undefined,
    });

    this._project = project;

    return { action, project };
  }
}

/**
 * Generate commands to move additional input artifacts into the right place
 */
function generateInputArtifactLinkCommands(artifacts: ArtifactMap, inputs: FileSetLocation[]): string[] {
  return inputs.map(input => {
    const fragments = [];

    if (!['.', '..'].includes(path.dirname(input.directory))) {
      fragments.push(`mkdir -p "${input.directory}"`);
    }

    const artifact = artifacts.toCodePipeline(input.fileSet);

    fragments.push(`ln -s "$CODEBUILD_SRC_DIR_${artifact.artifactName}" "${input.directory}"`);

    return fragments.join(' && ');
  });
}

function renderArtifactsBuildSpec(artifactMap: ArtifactMap, outputs: FileSetLocation[]) {
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
    const art = artifactMap.toCodePipeline(output.fileSet);

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
