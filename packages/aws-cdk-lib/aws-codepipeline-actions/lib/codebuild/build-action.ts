import type { Construct } from 'constructs';
import { CodeStarConnectionsSourceAction } from '..';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import { Action } from '../action';
import { CodeCommitSourceAction } from '../codecommit/source-action';

/**
 * The type of the CodeBuild action that determines its CodePipeline Category -
 * Build, or Test.
 * The default is Build.
 */
export enum CodeBuildActionType {
  /**
   * The action will have the Build Category.
   * This is the default.
   */
  BUILD,

  /**
   * The action will have the Test Category.
   */
  TEST,
}

/**
 * Construction properties of the `CodeBuildAction CodeBuild build CodePipeline action`.
 */
export interface CodeBuildActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The source to use as input for this action.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The list of additional input Artifacts for this action.
   *
   * The directories the additional inputs will be available at are available
   * during the project's build in the CODEBUILD_SRC_DIR_<artifact-name> environment variables.
   * The project's build always starts in the directory with the primary input artifact checked out,
   * the one pointed to by the `input` property.
   * For more information,
   * see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html .
   */
  readonly extraInputs?: codepipeline.Artifact[];

  /**
   * The list of output Artifacts for this action.
   * **Note**: if you specify more than one output Artifact here,
   * you cannot use the primary 'artifacts' section of the buildspec;
   * you have to use the 'secondary-artifacts' section instead.
   * See https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   * for details.
   *
   * @default the action will not have any outputs
   */
  readonly outputs?: codepipeline.Artifact[];

  /**
   * The action's Project.
   */
  readonly project: codebuild.IProject;

  /**
   * The type of the action that determines its CodePipeline Category -
   * Build, or Test.
   *
   * @default CodeBuildActionType.BUILD
   */
  readonly type?: CodeBuildActionType;

  /**
   * The environment variables to pass to the CodeBuild project when this action executes.
   * If a variable with the same name was set both on the project level, and here,
   * this value will take precedence.
   *
   * @default - No additional environment variables are specified.
   */
  readonly environmentVariables?: { [name: string]: codebuild.BuildEnvironmentVariable };

  /**
   * Whether to check for the presence of any secrets in the environment variables of the default type, BuildEnvironmentVariableType.PLAINTEXT.
   * Since using a secret for the value of that kind of variable would result in it being displayed in plain text in the AWS Console,
   * the construct will throw an exception if it detects a secret was passed there.
   * Pass this property as false if you want to skip this validation,
   * and keep using a secret in a plain text environment variable.
   *
   * @default true
   */
  readonly checkSecretsInPlainTextEnvVariables?: boolean;

  /**
   * Trigger a batch build.
   *
   * Enabling this will enable batch builds on the CodeBuild project.
   *
   * @default false
   */
  readonly executeBatchBuild?: boolean;

  /**
   * Combine the build artifacts for a batch builds.
   *
   * Enabling this will combine the build artifacts into the same location for batch builds.
   * If `executeBatchBuild` is not set to `true`, this property is ignored.
   *
   * @default false
   */
  readonly combineBatchBuildArtifacts?: boolean;

  /**
   * A service role to use for this CodeBuild action, overriding the CodeBuild
   * project's default service role for builds triggered by this pipeline action.
   *
   * Maps to the CodePipeline `ServiceRoleArnOverride` action configuration property.
   * The role must be in the same account as the CodeBuild project, and its trust
   * policy must allow `codebuild.amazonaws.com` to assume it.
   *
   * CDK grants `iam:PassRole` on this role, limited to CodeBuild, to the role the
   * action runs as: the action's `role` if you set one, the role CDK creates for the
   * action (in the project's account for a cross-account action), or the pipeline role
   * when `usePipelineRoleForActions` is set. The identity that deploys the pipeline (for
   * CDK, the CloudFormation execution role) must also have `iam:PassRole` on this role.
   *
   * CDK grants this role access to the pipeline artifact bucket the action uses, and
   * its KMS key: read, or read/write if the action has outputs. For a cross-region
   * action that is the replication bucket in the action's region. A role imported with
   * `mutable: false` gets no grant, so grant it the bucket yourself. CDK grants nothing
   * else to this role, and this action stops granting the project's role access to the
   * artifact bucket, source connections, CodeCommit repositories and environment
   * variable secrets. Grant this role everything else the build needs.
   *
   * CodeBuild encrypts build outputs with the project's encryption key. If the project
   * has no `encryptionKey` of its own and the artifact bucket uses a customer-managed KMS
   * key in the project's account and region, CDK still sets that key on the project and
   * grants the project's role encrypt/decrypt on it. If the project has its own
   * `encryptionKey`, grant this role access to that key too.
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodeBuild.html
   *
   * @default - no override; the CodeBuild project's default service role is used
   */
  readonly serviceRoleOverride?: iam.IRoleRef & iam.IGrantable;
}

/**
 * CodePipeline build action that uses AWS CodeBuild.
 */
export class CodeBuildAction extends Action {
  private readonly props: CodeBuildActionProps;

  constructor(props: CodeBuildActionProps) {
    super({
      ...props,
      category: props.type === CodeBuildActionType.TEST
        ? codepipeline.ActionCategory.TEST
        : codepipeline.ActionCategory.BUILD,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 1, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      inputs: [props.input, ...props.extraInputs || []],
      resource: props.project,
    });

    this.props = props;
  }

  /**
   * Reference a CodePipeline variable defined by the CodeBuild project this action points to.
   * Variables in CodeBuild actions are defined using the 'exported-variables' subsection of the 'env'
   * section of the buildspec.
   *
   * @param variableName the name of the variable to reference.
   *   A variable by this name must be present in the 'exported-variables' section of the buildspec
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-syntax
   */
  public variable(variableName: string): string {
    return this.variableExpression(variableName);
  }

  protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // check for a cross-account action if there are any outputs
    if ((this.actionProperties.outputs || []).length > 0) {
      const pipelineStack = cdk.Stack.of(scope);
      const projectStack = cdk.Stack.of(this.props.project);
      if (pipelineStack.account !== projectStack.account) {
        throw new cdk.ValidationError(
          lit`CrossAccountActionCannotHaveOutputs`,
          'A cross-account CodeBuild action cannot have outputs. ' +
          'This is a known CodeBuild limitation. ' +
          'See https://github.com/aws/aws-cdk/issues/4169 for details',
          scope,
        );
      }
    }

    // grant the Pipeline role the required permissions to this Project
    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.props.project.projectArn],
      actions: [
        `codebuild:${this.props.executeBatchBuild ? 'BatchGetBuildBatches' : 'BatchGetBuilds'}`,
        `codebuild:${this.props.executeBatchBuild ? 'StartBuildBatch' : 'StartBuild'}`,
        `codebuild:${this.props.executeBatchBuild ? 'StopBuildBatch' : 'StopBuild'}`,
      ],
    }));

    // allow the Project access to the Pipeline's artifact Bucket
    // but only if the project is not imported
    // (ie., has a role) - otherwise, the IAM library throws an error.
    // With serviceRoleOverride the builds run as the override role, so that role gets the
    // bucket instead: only CDK knows which bucket the action uses (the replication bucket
    // for a cross-region action) and whether it needs write access.
    const bucketGrantee = this.props.serviceRoleOverride ?? (this.props.project.role ? this.props.project : undefined);
    if (bucketGrantee) {
      if ((this.actionProperties.outputs || []).length > 0) {
        options.bucket.grantReadWrite(bucketGrantee);
      } else {
        options.bucket.grantRead(bucketGrantee);
      }
    }

    if (this.props.project instanceof codebuild.Project) {
      this.props.project.bindToCodePipeline(scope, {
        artifactBucket: options.bucket,
      });
    }

    // When the builds run as an override role, the project's role does not need the
    // source connection, CodeCommit and environment variable secret grants below for
    // this action; the user grants them to the override role instead.
    const grantProjectRole = !this.props.serviceRoleOverride;

    for (const inputArtifact of this.actionProperties.inputs || []) {
      // if any of the inputs come from the CodeStarConnectionsSourceAction
      // with codeBuildCloneOutput=true,
      // grant the Project's Role to use the connection
      const connectionArn = inputArtifact.getMetadata(CodeStarConnectionsSourceAction._CONNECTION_ARN_PROPERTY);
      if (grantProjectRole && connectionArn) {
        this.props.project.addToRolePolicy(new iam.PolicyStatement({
          actions: ['codestar-connections:UseConnection'],
          resources: [connectionArn],
        }));
      }

      // if any of the inputs come from the CodeCommitSourceAction
      // with codeBuildCloneOutput=true,
      // grant the Project's Role git pull access to the repository
      const codecommitRepositoryArn = inputArtifact.getMetadata(CodeCommitSourceAction._FULL_CLONE_ARN_PROPERTY);
      if (grantProjectRole && codecommitRepositoryArn) {
        this.props.project.addToRolePolicy(new iam.PolicyStatement({
          actions: ['codecommit:GitPull'],
          resources: [codecommitRepositoryArn],
        }));
      }
    }

    const configuration: any = {
      ProjectName: this.props.project.projectName,
      EnvironmentVariables: this.props.environmentVariables &&
        cdk.Stack.of(scope).toJsonString(codebuild.Project.serializeEnvVariables(this.props.environmentVariables,
          this.props.checkSecretsInPlainTextEnvVariables ?? true, grantProjectRole ? this.props.project : undefined)),
    };
    if ((this.actionProperties.inputs || []).length > 1) {
      configuration.PrimarySource = this.props.input._artifactNameBox;
    }
    if (this.props.executeBatchBuild) {
      configuration.BatchEnabled = 'true';
      this.props.project.enableBatchBuilds();

      if (this.props.combineBatchBuildArtifacts) {
        configuration.CombineArtifacts = 'true';
      }
    }
    if (this.props.serviceRoleOverride) {
      const roleAccount = this.props.serviceRoleOverride.env.account;
      const projectAccount = this.props.project.env.account;
      if (cdk.Token.compareStrings(roleAccount, projectAccount) === cdk.TokenComparison.DIFFERENT) {
        throw new cdk.ValidationError(
          lit`ServiceRoleOverrideAccountMismatch`,
          `serviceRoleOverride must be in the same account as the CodeBuild project (${JSON.stringify(projectAccount)}), got a role in account ${JSON.stringify(roleAccount)}`,
          scope,
        );
      }
      configuration.ServiceRoleArnOverride = this.props.serviceRoleOverride.roleRef.roleArn;
      // CodePipeline starts the build as the action's role, so that role passes the override. IAM only
      // allows passing a role within its own account, which for cross-account actions is the action role's.
      iam.Grant.addToPrincipal({
        grantee: options.role,
        actions: ['iam:PassRole'],
        resourceArns: [this.props.serviceRoleOverride.roleRef.roleArn],
        conditions: { StringEquals: { 'iam:PassedToService': 'codebuild.amazonaws.com' } },
      });
    }
    return {
      configuration,
    };
  }
}
