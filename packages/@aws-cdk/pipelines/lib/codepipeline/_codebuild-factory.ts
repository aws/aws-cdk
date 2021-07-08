import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Node } from 'constructs';
import { FileSetLocation, ScriptStep, StackDeployment } from '../blueprint';
import { cloudAssemblyBuildSpecDir } from '../private/construct-internals';
import { mapValues, mkdict, noEmptyObject, partition } from '../private/javascript';
import { ArtifactMap } from './artifact-map';
import { ICodePipelineActionFactory, CodePipelineActionOptions, CodePipelineActionFactoryResult } from './codepipeline-action-factory';
import { CodeBuildProjectOptions } from './codepipeline-engine';

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
   * Include a hash of the build config into the invocation
   */
  readonly includeBuildHashInPipeline?: boolean;

  /**
   * Customization options for the project
   *
   * Will at CodeBuild production time be combined with the option
   * defaults configured on the pipeline.
   *
   * @default - No special values
   */
  readonly projectOptions?: CodeBuildProjectOptions;

  /**
   * Custom execution role to be used for the CodeBuild project
   *
   * @default - A role is automatically created
   */
  readonly role?: iam.IRole;

  /**
   * If true, the build spec will be passed via the Cloud Assembly instead of rendered onto the Project
   *
   * Doing this has two advantages:
   *
   * - Bypass size restrictions: the buildspec on the project is restricted
   *   in size, while buildspecs coming from an input artifact are not restricted
   *   in such a way.
   * - Bypass pipeline update: if the SelfUpdate step has to change the buildspec,
   *   that just takes time. On the other hand, if the buildspec comes from the
   *   pipeline artifact, no such update has to take place.
   *
   * @default false
   */
  readonly passBuildSpecViaCloudAssembly?: boolean;
}

/**
 * Produce a CodeBuild project from a RunScript step and some CodeBuild-specific customizations
 *
 * The functionality here is shared between the `CodePipelinEngine` translating a `ScriptStep` into
 * a CodeBuild project, as well as the `CodeBuildStep` straight up.
 */
export class CodeBuildFactory implements ICodePipelineActionFactory {
  private _project?: codebuild.IProject;

  constructor(
    private readonly constructId: string,
    private readonly runScript: ScriptStep,
    private readonly props: CodeBuildFactoryProps) {
  }

  public get project(): codebuild.IProject {
    if (!this._project) {
      throw new Error('Project becomes available after produce() has been called');
    }
    return this._project;
  }

  public produce(options: CodePipelineActionOptions): CodePipelineActionFactoryResult {
    const projectOptions = mergeCodeBuildOptions(options.codeBuildProjectOptions, this.props.projectOptions);

    const mainInput = this.runScript.inputs.find(x => x.directory === '.');
    const extraInputs = this.runScript.inputs.filter(x => x.directory !== '.');

    const inputArtifact = mainInput
      ? options.artifacts.toCodePipeline(mainInput.fileSet)
      : options.fallbackArtifact;
    const extraInputArtifacts = extraInputs.map(x => options.artifacts.toCodePipeline(x.fileSet));
    const outputArtifacts = this.runScript.outputs.map(x => options.artifacts.toCodePipeline(x.fileSet));

    if (!inputArtifact) {
      // This should actually never happen because CodeBuild projects shouldn't be added before the
      // Source, which always produces at least an artifact.
      throw new Error(`CodeBuild action '${this.runScript.id}' requires an input (and the pipeline doesn't have a Source to fall back to). Add an input or a pipeline source.`);
    }

    const installCommands = [
      ...generateInputArtifactLinkCommands(options.artifacts, extraInputs),
      ...this.runScript.installCommands ?? [],
    ];

    const buildSpecHere = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: (installCommands.length ?? 0) > 0 ? { commands: installCommands } : undefined,
        build: this.runScript.commands.length > 0 ? { commands: this.runScript.commands } : undefined,
      },
      artifacts: noEmptyObject<any>(renderArtifactsBuildSpec(options.artifacts, this.runScript.outputs ?? [])),
    });

    const actualBuildSpec = options.codeBuildProjectOptions?.partialBuildSpec
      ? codebuild.mergeBuildSpecs(options.codeBuildProjectOptions?.partialBuildSpec, buildSpecHere)
      : buildSpecHere;

    let projectBuildSpec;
    if (this.props.passBuildSpecViaCloudAssembly) {
      // Write to disk and replace with a reference
      const relativeSpecFile = `buildspec-${Node.of(options.scope).addr}-${this.constructId}.yaml`;
      const absSpecFile = path.join(cloudAssemblyBuildSpecDir(options.scope), relativeSpecFile);
      fs.writeFileSync(absSpecFile, Stack.of(options.scope).resolve(actualBuildSpec.toBuildSpec()), { encoding: 'utf-8' });
      projectBuildSpec = codebuild.BuildSpec.fromSourceFilename(relativeSpecFile);
    } else {
      projectBuildSpec = actualBuildSpec;
    }

    // Partition environment variables into environment variables that can go on the project
    // and environment variables that MUST go in the pipeline (those that reference CodePipeline variables)

    const [actionEnvs, projectEnvs] = partition(Object.entries(this.runScript.env ?? {}), ([, v]) => containsPipelineVariable(v));

    const environment = mergeBuildEnvironments(
      projectOptions?.buildEnvironment ?? {},
      {
        environmentVariables: noEmptyObject(mapValues(mkdict(projectEnvs), value => ({ value }))),
      });

    // A hash over the values that make the CodeBuild Project unique (and necessary
    // to restart the pipeline if one of them changes). projectName is not necessary to include
    // here because the pipeline will definitely restart if projectName changes.
    // (Resolve tokens)
    const projectConfigHash = hash(Stack.of(options.scope).resolve({
      environment: serializeBuildEnvironment(environment),
      buildSpecString: actualBuildSpec.toBuildSpec(),
    }));

    const project = new codebuild.PipelineProject(options.scope, this.constructId, {
      projectName: this.props.projectName,
      environment,
      vpc: this.props.vpc,
      subnetSelection: this.props.subnetSelection,
      securityGroups: projectOptions?.securityGroups,
      buildSpec: projectBuildSpec,
      role: this.props.role,
    });

    if (projectOptions?.rolePolicyStatements !== undefined) {
      projectOptions?.rolePolicyStatements.forEach(policyStatement => {
        project.addToRolePolicy(policyStatement);
      });
    }

    const stackOutputEnv = mapValues(this.runScript.envFromOutputs, outputRef =>
      `#{${stackVariableNamespace(options.queries.producingStack(outputRef))}.${outputRef.outputName}}`,
    );

    const configHashEnv = this.props.includeBuildHashInPipeline
      ? { _PROJECT_CONFIG_HASH: projectConfigHash }
      : {};

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
      environmentVariables: noEmptyObject(cbEnv({
        ...mkdict(actionEnvs),
        ...configHashEnv,
        ...stackOutputEnv,
      })),
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
  if (outputs.length === 0) { return {}; }

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

export function mergeCodeBuildOptions(...opts: Array<CodeBuildProjectOptions | undefined>) {
  const xs = [{}, ...opts.filter(isDefined)];
  while (xs.length > 1) {
    const [a, b] = xs.splice(xs.length - 2, 2);
    xs.push(merge2(a, b));
  }
  return xs[0];

  function merge2(a: CodeBuildProjectOptions, b: CodeBuildProjectOptions): CodeBuildProjectOptions {
    return {
      buildEnvironment: mergeBuildEnvironments(a.buildEnvironment, b.buildEnvironment),
      rolePolicyStatements: definedArray([...a.rolePolicyStatements ?? [], ...b.rolePolicyStatements ?? []]),
      securityGroups: definedArray([...a.securityGroups ?? [], ...b.securityGroups ?? []]),
      partialBuildSpec: a.partialBuildSpec && b.partialBuildSpec
        ? codebuild.mergeBuildSpecs(a.partialBuildSpec, b.partialBuildSpec)
        : (a.partialBuildSpec ?? b.partialBuildSpec),
    };
  }
}

export function mergeBuildEnvironments(...envs: Array<codebuild.BuildEnvironment | undefined>) {
  const xs = [{}, ...envs.filter(isDefined)];

  while (xs.length > 1) {
    const [a, b] = xs.splice(xs.length - 2, 2);
    xs.push(merge2(a, b));
  }
  return xs[0];

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

function isDefined<A>(x: A | undefined): x is NonNullable<A> {
  return x !== undefined;
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

export function stackVariableNamespace(stack: StackDeployment) {
  return stack.stackArtifactId;
}

/**
 * Whether the given string contains a reference to a CodePipeline variable
 */
function containsPipelineVariable(s: string) {
  return !!s.match(/#\{[^}]+\}/);
}

/**
 * Turn a collection into a collection of CodePipeline environment variables
 */
function cbEnv(xs: Record<string, string | undefined>): Record<string, codebuild.BuildEnvironmentVariable> {
  return mkdict(Object.entries(xs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => [k, { value: v }] as const));
}

function definedArray<A>(xs: A[]): A[] | undefined {
  return xs.length > 0 ? xs : undefined;
}