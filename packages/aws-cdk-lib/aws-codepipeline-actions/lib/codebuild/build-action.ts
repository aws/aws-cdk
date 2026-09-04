import type { Construct } from 'constructs';
import { CodeStarConnectionsSourceAction } from '..';
import * as codebuild from '../../../aws-codebuild';
import { createLoggingPolicyStatement, createReportGroupPolicyStatement } from '../../../aws-codebuild/lib/project-role-permissions';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import * as cxapi from '../../../cx-api';
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
   * When supplied, the pipeline role is granted `iam:PassRole` on this role.
   *
   * If the `@aws-cdk/aws-codepipeline-actions:autoScopeCodeBuildRoleForFullClone`
   * feature flag is enabled and this prop is not supplied, a scoped role may be
   * auto-created if the CodeBuild action has CodeConnections Full Clone sources.
   *
   * @default - no override; the CodeBuild project's default service role is used
   */
  readonly serviceRoleOverride?: iam.IRole;
}

/**
 * CodePipeline build action that uses AWS CodeBuild.
 */
export class CodeBuildAction extends Action {
  private readonly props: CodeBuildActionProps;
  private _serviceRole?: iam.IRole;

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

  /**
   * The service role override used by this action. Only populated after the action has been added
   * to a pipeline (i.e. after bind), and `undefined` if read before.
   *
   * Customizing the auto-created role is possible by granting extra permissions via this getter.
   * To use a tighter or fully-managed role, pass an explicit `serviceRoleOverride` instead.
   */
  public get serviceRole(): iam.IRole | undefined { return this._serviceRole; }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const autoScopeEnabled = cdk.FeatureFlags.of(scope).isEnabled(cxapi.AUTO_SCOPE_CODEBUILD_ROLE_FOR_FULL_CLONE);

    // Check whether the service role override can be auto created. This requires an
    // CDK-owned project (to place the role in its stack) and non-token connection ARNs
    // for the source actions (we need to parse the connection arn, which will only be known at deploy time)
    const pipelineStack = cdk.Stack.of(scope);
    const projectStack = cdk.Stack.of(this.props.project);
    const isCrossAccount = pipelineStack.account !== projectStack.account;
    const fullCloneByConnection = this.groupFullCloneReposByConnection();
    const willAutoCreateSRO = autoScopeEnabled
      && !this.props.serviceRoleOverride
      && fullCloneByConnection.size > 0
      && this.props.project instanceof codebuild.Project
      && Array.from(fullCloneByConnection.keys()).every(arn => !cdk.Token.isUnresolved(arn));

    // check for a cross-account action if there are any outputs
    if ((this.actionProperties.outputs || []).length > 0) {
      if (isCrossAccount) {
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
    // (ie., has a role) - otherwise, the IAM library throws an error
    if (this.props.project.role) {
      if ((this.actionProperties.outputs || []).length > 0) {
        options.bucket.grantReadWrite(this.props.project);
      } else {
        options.bucket.grantRead(this.props.project);
      }
    }

    if (this.props.project instanceof codebuild.Project) {
      this.props.project.bindToCodePipeline(scope, {
        artifactBucket: options.bucket,
      });
    }

    for (const inputArtifact of this.actionProperties.inputs || []) {
      // if any of the inputs come from the CodeStarConnectionsSourceAction
      // with codeBuildCloneOutput=true, grant the Project's Role to use the connection
      const connectionArn = inputArtifact.getMetadata(CodeStarConnectionsSourceAction._CONNECTION_ARN_PROPERTY);
      if (connectionArn) {
        // Skip adding these if we auto create the per pipeline service role
        if (!(willAutoCreateSRO && fullCloneByConnection.has(connectionArn))) {
          this.props.project.addToRolePolicy(new iam.PolicyStatement({
            actions: ['codestar-connections:UseConnection'],
            resources: [connectionArn],
          }));
        }
      }

      // if any of the inputs come from the CodeCommitSourceAction
      // with codeBuildCloneOutput=true,
      // grant the Project's Role git pull access to the repository
      const codecommitRepositoryArn = inputArtifact.getMetadata(CodeCommitSourceAction._FULL_CLONE_ARN_PROPERTY);
      if (codecommitRepositoryArn) {
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
          this.props.checkSecretsInPlainTextEnvVariables ?? true, this.props.project)),
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
    // If serviceRoleOverride not provided, and feature flag enabled, try to auto create the role
    let overrideRole: iam.IRole | undefined;
    if (this.props.serviceRoleOverride) {
      overrideRole = this.props.serviceRoleOverride;
    } else if (willAutoCreateSRO) {
      overrideRole = this.createScopedServiceRole(stage, options, fullCloneByConnection);
      cdk.Annotations.of(scope).addInfoV2(
        '@aws-cdk/aws-codepipeline-actions:codeBuildServiceRoleAutoScoped',
        `Auto-created a scoped-down CodeBuild service role for action '${this.actionProperties.actionName}' with baseline permissions. ` +
        'If the project needs additional permissions (e.g. VPC networking, ECR image pull, Secrets Manager, ' +
        'SSM sessions, a custom encryption key, or custom role policies), add them via ' +
        "'buildAction.serviceRole', or pass an explicit 'serviceRoleOverride'.",
      );
    } else if (autoScopeEnabled && fullCloneByConnection.size > 0) {
      // Flag on + Full Clone source, but we can't safely auto-create a repository-scoped
      // role (the project is imported, or a connection ARN is an unresolved token)
      cdk.Annotations.of(scope).addInfoV2(
        '@aws-cdk/aws-codepipeline-actions:codeBuildServiceRoleNotAutoScoped',
        `Could not auto-create a repository-scoped CodeBuild service role for action '${this.actionProperties.actionName}' ` +
        'because the CodeBuild project is imported or the action has a token source connection. ' +
        "The build will use the project's default service role. " +
        "To scope it to the source repositories, create and pass an explicit 'serviceRoleOverride'.",
      );
    }

    if (overrideRole) {
      this._serviceRole = overrideRole;
      configuration.ServiceRoleArnOverride = overrideRole.roleArn;
      this.grantPipelinePassRole(options.role, overrideRole);
    }
    return {
      configuration,
    };
  }

  /**
   * Reads the CodeConnections Full Clone metadata from all of this action's input artifacts,
   * grouped by connection ARN. Returns a map of connection ARN → set of repository ids.
   * The map's insertion order follows first-seen connection order for deterministic statement emission.
   */
  private groupFullCloneReposByConnection(): Map<string, Set<string>> {
    const byConnection = new Map<string, Set<string>>();
    for (const inputArtifact of this.actionProperties.inputs || []) {
      // Only Full Clone actions have _CONNECTION_ARN_PROPERTY set
      const connectionArn = inputArtifact.getMetadata(CodeStarConnectionsSourceAction._CONNECTION_ARN_PROPERTY);
      const fullRepositoryId = inputArtifact.getMetadata(CodeStarConnectionsSourceAction._FULL_REPOSITORY_ID_PROPERTY);
      if (connectionArn && fullRepositoryId) {
        let repos = byConnection.get(connectionArn);
        if (!repos) {
          repos = new Set<string>();
          byConnection.set(connectionArn, repos);
        }
        repos.add(fullRepositoryId);
      }
    }
    return byConnection;
  }

  /**
   * Grants the pipeline role `iam:PassRole` on the given service role, scoped to the CodeBuild service.
   */
  private grantPipelinePassRole(pipelineRole: iam.IRole, overrideRole: iam.IRole): void {
    pipelineRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: [overrideRole.roleArn],
      conditions: { StringEquals: { 'iam:PassedToService': 'codebuild.amazonaws.com' } },
    }));
  }

  /**
   * Creates CodeBuild service role scoped on the repository Ids of the Full Clone source(s)
   * feeding this action, in the project's stack. Baseline: build logs, report groups, the artifact
   * bucket (and its KMS key, if any), plus one dedicated `UseConnection` grant per
   * connection with a FullRepositoryId condition per repo.
   */
  private createScopedServiceRole(
    stage: codepipeline.IStage,
    options: codepipeline.ActionBindOptions,
    fullCloneByConnection: Map<string, Set<string>>,
  ): iam.Role {
    const projectStack = cdk.Stack.of(this.props.project);
    // Since action names are only unique within a stage, use pipeline + stage + action as id to avoid collisions.
    const roleId = `${cdk.Names.nodeUniqueId(stage.pipeline.node)}-${stage.stageName}-${this.actionProperties.actionName}-CodeBuildServiceRole`;
    const role = new iam.Role(projectStack, roleId, {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });

    // Mirror permissions that the default project role has
    role.addToPrincipalPolicy(createLoggingPolicyStatement(this.props.project, this.props.project.projectName));
    role.addToPrincipalPolicy(createReportGroupPolicyStatement(this.props.project, this.props.project.projectName));

    // Pipeline artifact bucket and KMS key
    if ((this.actionProperties.outputs || []).length > 0) {
      options.bucket.grantReadWrite(role);
    } else {
      options.bucket.grantRead(role);
    }
    options.bucket.encryptionKey?.grantEncryptDecrypt(role);

    for (const [connectionArn, repoSet] of fullCloneByConnection) {
      // Need to check if the connection is using `codestar-connections` or `codeconnections` prefix
      const connectionService = projectStack.splitArn(connectionArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).service;
      const repos = Array.from(repoSet).sort();
      role.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: [`${connectionService}:UseConnection`],
        resources: [connectionArn],
        conditions: { StringEquals: { [`${connectionService}:FullRepositoryId`]: repos.length === 1 ? repos[0] : repos } },
      }));
    }

    // CodeCommit Full Clone inputs feeding the same action also clone at build time, so the
    // service role must carry the repository-scoped git pull grant that bound() otherwise only
    // puts on the project's default role (which the override role replaces at execution).
    for (const inputArtifact of this.actionProperties.inputs || []) {
      const codecommitRepositoryArn = inputArtifact.getMetadata(CodeCommitSourceAction._FULL_CLONE_ARN_PROPERTY);
      if (codecommitRepositoryArn) {
        role.addToPrincipalPolicy(new iam.PolicyStatement({
          actions: ['codecommit:GitPull'],
          resources: [codecommitRepositoryArn],
        }));
      }
    }

    return role;
  }
}
