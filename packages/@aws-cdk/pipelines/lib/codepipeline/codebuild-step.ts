import * as codebuild from '@aws-cdk/aws-codebuild';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { FileSet, ScriptStep, ScriptStepProps, Step } from '../blueprint';
import { CodeBuildFactory } from './_codebuild-factory';
import { ICodePipelineActionFactory, CodePipelineActionOptions, CodePipelineActionFactoryResult } from './codepipeline-action-factory';

/**
 * Construction props for SimpleSynthAction
 */
export interface CodeBuildStepProps extends ScriptStepProps {
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
 * Run a script as a CodeBuild Project
 */
export class CodeBuildStep extends Step implements ICodePipelineActionFactory {
  public primaryOutput?: FileSet | undefined;
  private readonly runScript: ScriptStep;
  private _project?: codebuild.IProject;

  constructor(id: string, private readonly props: CodeBuildStepProps) {
    super(id);

    this.runScript = new ScriptStep(id, props);

    const mainInput = this.runScript.inputs.find(x => x.directory === '.');
    if (!mainInput) {
      throw new Error('CodeBuild action must have exactly one input with directory \'.\'');
    }
    this.requiredFileSets.push(...this.runScript.requiredFileSets);
  }

  /**
   * Project generated to run the synth command
   */
  public get project(): codebuild.IProject {
    if (!this._project) {
      throw new Error('Project becomes available after the pipeline has been built');
    }
    return this._project;
  }

  public produce(options: CodePipelineActionOptions): CodePipelineActionFactoryResult {
    const factory = new CodeBuildFactory(this.id, this.runScript, this.props);
    const ret = factory.produce(options);
    this._project = factory.project;
    return ret;
  }

  /**
   * The CodeBuild Project's principal
   */
  public get grantPrincipal(): iam.IPrincipal {
    return this.project.grantPrincipal;
  }
}
