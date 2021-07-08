import * as codebuild from '@aws-cdk/aws-codebuild';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { FileSet, ScriptStep, ScriptStepProps } from '../blueprint';
import { CodeBuildFactory } from './_codebuild-factory';
import { CodePipelineActionOptions, CodePipelineActionFactoryResult, ICodePipelineActionFactory } from './codepipeline-action-factory';

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
   * Include a hash of the build config into the invocation
   */
  readonly includeBuildHashInPipeline?: boolean;

  /**
   * Build environment
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
}

/**
 * Run a script as a CodeBuild Project
 */
export class CodeBuildStep extends ScriptStep implements ICodePipelineActionFactory {
  public readonly primaryOutput?: FileSet | undefined;
  private _project?: codebuild.IProject;

  constructor(id: string, private readonly props: CodeBuildStepProps) {
    super(id, props);
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
    const factory = new CodeBuildFactory(this.id, this, {
      ...this.props,
      projectOptions: {
        buildEnvironment: this.props.buildEnvironment,
        rolePolicyStatements: this.props.rolePolicyStatements,
        securityGroups: this.props.securityGroups,
        partialBuildSpec: this.props.partialBuildSpec,
      },
    });
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
