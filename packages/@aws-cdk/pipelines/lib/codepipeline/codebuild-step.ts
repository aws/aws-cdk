import * as codebuild from '@aws-cdk/aws-codebuild';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { mergeBuildSpecs } from './private/buildspecs';
import { makeCodePipelineOutput } from './private/outputs';
import { ShellStep, ShellStepProps } from '../blueprint';

/**
 * Construction props for a CodeBuildStep
 */
export interface CodeBuildStepProps extends ShellStepProps {
  /**
   * Name for the generated CodeBuild project
   *
   * @default - Automatically generated
   */
  readonly projectName?: string;

  /**
   * Additional configuration that can only be configured via BuildSpec
   *
   * You should not use this to specify output artifacts; those
   * should be supplied via the other properties of this class, otherwise
   * CDK Pipelines won't be able to inspect the artifacts.
   *
   * Set the `commands` to an empty array if you want to fully specify
   * the BuildSpec using this field.
   *
   * The BuildSpec must be available inline--it cannot reference a file
   * on disk.
   *
   * @default - BuildSpec completely derived from other properties
   */
  readonly partialBuildSpec?: codebuild.BuildSpec;

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
   * Caching strategy to use.
   *
   * @default - No cache
   */
  readonly cache?: codebuild.Cache;

  /**
   * Policy statements to add to role used during the synth
   *
   * Can be used to add acces to a CodeArtifact repository etc.
   *
   * @default - No policy statements added to CodeBuild Project Role
   */
  readonly rolePolicyStatements?: iam.PolicyStatement[];

  /**
   * Custom execution role to be used for the CodeBuild project
   *
   * @default - A role is automatically created
   */
  readonly role?: iam.IRole;

  /**
   * Custom execution role to be used for the Code Build Action
   *
   * @default - A role is automatically created
   */
  readonly actionRole?: iam.IRole;

  /**
   * Changes to environment
   *
   * This environment will be combined with the pipeline's default
   * environment.
   *
   * @default - Use the pipeline's default build environment
   */
  readonly buildEnvironment?: codebuild.BuildEnvironment;

  /**
   * Which security group to associate with the script's project network interfaces.
   * If no security group is identified, one will be created automatically.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default - Security group will be automatically created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The number of minutes after which AWS CodeBuild stops the build if it's
   * not complete. For valid values, see the timeoutInMinutes field in the AWS
   * CodeBuild User Guide.
   *
   * @default Duration.hours(1)
   */
  readonly timeout?: Duration;
}

/**
 * Run a script as a CodeBuild Project
 *
 * The BuildSpec must be available inline--it cannot reference a file
 * on disk. If your current build instructions are in a file like
 * `buildspec.yml` in your repository, extract them to a script
 * (say, `build.sh`) and invoke that script as part of the build:
 *
 * ```ts
 * new pipelines.CodeBuildStep('Synth', {
 *   commands: ['./build.sh'],
 * });
 * ```
 */
export class CodeBuildStep extends ShellStep {
  /**
   * Name for the generated CodeBuild project
   *
   * @default - No value specified at construction time, use defaults
   */
  public readonly projectName?: string;

  /**
   * The VPC where to execute the SimpleSynth.
   *
   * @default - No value specified at construction time, use defaults
   */
  public readonly vpc?: ec2.IVpc;

  /**
   * Which subnets to use.
   *
   * @default - No value specified at construction time, use defaults
   */
  public readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * Caching strategy to use.
   *
   * @default - No cache
   */
  public readonly cache?: codebuild.Cache;

  /**
   * Policy statements to add to role used during the synth
   *
   * @default - No value specified at construction time, use defaults
   */
  public readonly rolePolicyStatements?: iam.PolicyStatement[];

  /**
   * Custom execution role to be used for the CodeBuild project
   *
   * @default - No value specified at construction time, use defaults
   */
  public readonly role?: iam.IRole;

  /**
   * Custom execution role to be used for the Code Build Action
   *
   * @default - A role is automatically created
   */
  readonly actionRole?: iam.IRole;

  /**
   * Build environment
   *
   * @default - No value specified at construction time, use defaults
   */
  readonly buildEnvironment?: codebuild.BuildEnvironment;

  /**
   * Which security group to associate with the script's project network interfaces.
   *
   * @default - No value specified at construction time, use defaults
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The number of minutes after which AWS CodeBuild stops the build if it's
   * not complete. For valid values, see the timeoutInMinutes field in the AWS
   * CodeBuild User Guide.
   *
   * @default Duration.hours(1)
   */
  readonly timeout?: Duration;

  private _project?: codebuild.IProject;
  private _partialBuildSpec?: codebuild.BuildSpec;
  private readonly exportedVariables = new Set<string>();
  private exportedVarsRendered = false;

  constructor(id: string, props: CodeBuildStepProps) {
    super(id, props);

    this.projectName = props.projectName;
    this.buildEnvironment = props.buildEnvironment;
    this._partialBuildSpec = props.partialBuildSpec;
    this.vpc = props.vpc;
    this.subnetSelection = props.subnetSelection;
    this.cache = props.cache;
    this.role = props.role;
    this.actionRole = props.actionRole;
    this.rolePolicyStatements = props.rolePolicyStatements;
    this.securityGroups = props.securityGroups;
    this.timeout = props.timeout;
  }

  /**
   * CodeBuild Project generated for the pipeline
   *
   * Will only be available after the pipeline has been built.
   */
  public get project(): codebuild.IProject {
    if (!this._project) {
      throw new Error('Call pipeline.buildPipeline() before reading this property');
    }
    return this._project;
  }

  /**
   * The CodeBuild Project's principal
   */
  public get grantPrincipal(): iam.IPrincipal {
    return this.project.grantPrincipal;
  }

  /**
   * Additional configuration that can only be configured via BuildSpec
   *
   * Contains exported variables
   *
   * @default - Contains the exported variables
   */
  public get partialBuildSpec(): codebuild.BuildSpec | undefined {
    this.exportedVarsRendered = true;

    const varsBuildSpec = this.exportedVariables.size > 0 ? codebuild.BuildSpec.fromObject({
      version: '0.2',
      env: {
        'exported-variables': Array.from(this.exportedVariables),
      },
    }) : undefined;

    return mergeBuildSpecs(varsBuildSpec, this._partialBuildSpec);
  }

  /**
   * Reference a CodePipeline variable defined by the CodeBuildStep.
   *
   * The variable must be set in the shell of the CodeBuild step when
   * it finishes its `post_build` phase.
   *
   * @param variableName the name of the variable for reference.
   * @example
   * // Access the output of one CodeBuildStep in another CodeBuildStep
   * declare const pipeline: pipelines.CodePipeline;
   *
   * const step1 = new pipelines.CodeBuildStep('Step1', {
   *   commands: ['export MY_VAR=hello'],
   * });
   *
   * const step2 = new pipelines.CodeBuildStep('Step2', {
   *   env: {
   *     IMPORTED_VAR: step1.exportedVariable('MY_VAR'),
   *   },
   *   commands: ['echo $IMPORTED_VAR'],
   * });
   */
  public exportedVariable(variableName: string): string {
    if (this.exportedVarsRendered && !this.exportedVariables.has(variableName)) {
      throw new Error('exportVariable(): Pipeline has already been produced, cannot call this function anymore');
    }

    this.exportedVariables.add(variableName);

    return makeCodePipelineOutput(this, variableName);
  }

  /**
   * Set the internal project value
   *
   * @internal
   */
  public _setProject(project: codebuild.IProject) {
    this._project = project;
  }
}
