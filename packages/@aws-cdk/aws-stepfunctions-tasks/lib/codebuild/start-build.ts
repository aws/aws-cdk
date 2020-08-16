import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';

import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

export enum SourceType {
  CODECOMMIT = 'CODECOMMIT',
  CODEPIPELINE = 'CODEPIPELINE',
  GITHUB = 'GITHUB',
  S3 = 'S3',
  BITBUCKET = 'BITBUCKET',
  GITHUB_ENTERPRISE = 'GITHUB_ENTERPRISE',
  NO_SOURCE = 'NO_SOURCE',
}

export enum EnvironmentType {
  WINDOWS_CONTAINER = 'WINDOWS_CONTAINER',
  LINUX_CONTAINER = 'LINUX_CONTAINER',
  LINUX_GPU_CONTAINER = 'LINUX_GPU_CONTAINER',
  ARM_CONTAINER = 'ARM_CONTAINER',
  WINDOWS_SERVER_2019_CONTAINER = 'WINDOWS_SERVER_2019_CONTAINER',
}

export enum ComputeType {
  BUILD_GENERAL1_SMALL = 'BUILD_GENERAL1_SMALL',
  BUILD_GENERAL1_MEDIUM = 'BUILD_GENERAL1_MEDIUM',
  BUILD_GENERAL1_LARGE = 'BUILD_GENERAL1_LARGE',
  BUILD_GENERAL1_2XLARGE = 'BUILD_GENERAL1_2XLARGE',
}

export enum ArtifactNamespace {
  NONE = 'NONE',
  BUILD_ID = 'BUILD_ID',
}

export enum ArtifactPackaging {
  NONE = 'NONE',
  ZIP = 'ZIP',
}

export enum ArtifactsType {
  CODEPIPELINE = 'CODEPIPELINE',
  S3 = 'S3',
  NO_ARTIFACTS = 'NO_ARTIFACTS',
}

export enum ImagePullCredentialsType {
  CODEBUILD = 'CODEBUILD',
  SERVICE_ROLE = 'SERVICE_ROLE',
}

export interface BuildStatusConfig {
  /**
   * Specifies the context of the build status CodeBuild sends to the source provider.
   */
  readonly context: string;
  /**
   * Specifies the target url of the build status CodeBuild sends to the source provider.
   */
  readonly targetUrl: string;
}

export interface ProjectArtifacts {
  readonly artifactIdentifier: string;
  readonly encryptionDisabled: boolean;
  readonly overrideArtifactName: boolean;
  /**
   * The type of build output artifact. Valid values include:    CODEPIPELINE: The build project will have build output generated through AWS CodePipeline.    NO_ARTIFACTS: The build project will not produce any build output.    S3: The build project will store build output in Amazon Simple Storage Service (Amazon S3).
   */
  readonly type: ArtifactsType;
  /**
   * Information about the build output artifact location, as follows:   If type is set to CODEPIPELINE, then AWS CodePipeline will ignore this value if specified. This is because AWS CodePipeline manages its build output locations instead of AWS CodeBuild.   If type is set to NO_ARTIFACTS, then this value will be ignored if specified, because no build output will be produced.   If type is set to S3, this is the name of the output bucket.
   */
  readonly location?: String;
  /**
   * Along with namespaceType and name, the pattern that AWS CodeBuild will use to name and store the output artifact, as follows:   If type is set to CODEPIPELINE, then AWS CodePipeline will ignore this value if specified. This is because AWS CodePipeline manages its build output names instead of AWS CodeBuild.   If type is set to NO_ARTIFACTS, then this value will be ignored if specified, because no build output will be produced.   If type is set to S3, this is the path to the output artifact. If path is not specified, then path will not be used.   For example, if path is set to MyArtifacts, namespaceType is set to NONE, and name is set to MyArtifact.zip, then the output artifact would be stored in the output bucket at MyArtifacts/MyArtifact.zip.
   */
  readonly path?: String;
  /**
   * Along with path and name, the pattern that AWS CodeBuild will use to determine the name and location to store the output artifact, as follows:   If type is set to CODEPIPELINE, then AWS CodePipeline will ignore this value if specified. This is because AWS CodePipeline manages its build output names instead of AWS CodeBuild.   If type is set to NO_ARTIFACTS, then this value will be ignored if specified, because no build output will be produced.   If type is set to S3, then valid values include:    BUILD_ID: Include the build ID in the location of the build output artifact.    NONE: Do not include the build ID. This is the default if namespaceType is not specified.     For example, if path is set to MyArtifacts, namespaceType is set to BUILD_ID, and name is set to MyArtifact.zip, then the output artifact would be stored in MyArtifacts/build-ID/MyArtifact.zip.
   */
  readonly namespaceType?: ArtifactNamespace;
  /**
   * Along with path and namespaceType, the pattern that AWS CodeBuild will use to name and store the output artifact, as follows:   If type is set to CODEPIPELINE, then AWS CodePipeline will ignore this value if specified. This is because AWS CodePipeline manages its build output names instead of AWS CodeBuild.   If type is set to NO_ARTIFACTS, then this value will be ignored if specified, because no build output will be produced.   If type is set to S3, this is the name of the output artifact object. If you set the name to be a forward slash ("/"), then the artifact is stored in the root of the output bucket.   For example:    If path is set to MyArtifacts, namespaceType is set to BUILD_ID, and name is set to MyArtifact.zip, then the output artifact would be stored in MyArtifacts/build-ID/MyArtifact.zip.     If path is empty, namespaceType is set to NONE, and name is set to "/", then the output artifact would be stored in the root of the output bucket.     If path is set to MyArtifacts, namespaceType is set to BUILD_ID, and name is set to "/", then the output artifact would be stored in MyArtifacts/build-ID .
   */
  readonly name?: String;
  /**
   * The type of build output artifact to create, as follows:   If type is set to CODEPIPELINE, then AWS CodePipeline will ignore this value if specified. This is because AWS CodePipeline manages its build output artifacts instead of AWS CodeBuild.   If type is set to NO_ARTIFACTS, then this value will be ignored if specified, because no build output will be produced.   If type is set to S3, valid values include:    NONE: AWS CodeBuild will create in the output bucket a folder containing the build output. This is the default if packaging is not specified.    ZIP: AWS CodeBuild will create in the output bucket a ZIP file containing the build output.
   */
  readonly packaging?: ArtifactPackaging;
}

export interface EnvironmentVariable {
  /**
   * The name or key of the environment variable.
   */
  readonly name: string;
  /**
   * The value of the environment variable.  We strongly discourage using environment variables to store sensitive values, especially AWS secret key IDs and secret access keys. Environment variables can be displayed in plain text using tools such as the AWS CodeBuild console and the AWS Command Line Interface (AWS CLI).
   */
  readonly value: String;
  /**
   * The type of environment variable. Valid values include:
   *    PARAMETER_STORE: An environment variable stored in Amazon EC2 Systems Manager Parameter Store.
   *    PLAINTEXT: An environment variable in plaintext format.
   *    SECRETS_MANAGER: An environment variable stored in AWS Secrets Manager.
   */
  readonly type?: codebuild.BuildEnvironmentVariableType;
}

export interface ProjectSource {
  /**
   * The type of repository that contains the source code to be built. Valid values include:
   *    BITBUCKET: The source code is in a Bitbucket repository.
   *    CODECOMMIT: The source code is in an AWS CodeCommit repository.
   *    CODEPIPELINE: The source code settings are specified in the source action of a pipeline in AWS CodePipeline.
   *    GITHUB: The source code is in a GitHub repository.
   *    NO_SOURCE: The project does not have input source code.
   *    S3: The source code is in an Amazon Simple Storage Service (Amazon S3) input bucket.
   */
  readonly type: SourceType;
  /**
   * Information about the location of the source code to be built. Valid values include:
   *    For source code settings that are specified in the source action of a pipeline in AWS CodePipeline, location should not be specified.
   *        If it is specified, AWS CodePipeline will ignore it.
   *        This is because AWS CodePipeline uses the settings in a pipeline's source action instead of this value.
   *    For source code in an AWS CodeCommit repository, the HTTPS clone URL to the repository
   *        that contains the source code and the build spec
   *        (for example, https://git-codecommit.region-ID.amazonaws.com/v1/repos/repo-name ).
   *    For source code in an Amazon Simple Storage Service (Amazon S3) input bucket,
   *        the path to the ZIP file that contains the source code (for example,  bucket-name/path/to/object-name.zip)
   *    For source code in a GitHub repository, the HTTPS clone URL to the repository that contains the source and the build spec.
   *    For source code in a Bitbucket repository, the HTTPS clone URL to the repository that contains the source and the build spec.
   */
  readonly location?: String;
  /**
   * Information about the git clone depth for the build project.
   */
  readonly gitCloneDepth?: number;
  /**
   * Information about the Git submodules configuration for the build project.
   */
  readonly gitSubmodulesConfig?: GitSubmodulesConfig;
  /**
   * The build spec declaration to use for the builds in this build project.
   */
  readonly buildspec?: String;
  /**
   * Contains information that defines how the AWS CodeBuild build project reports the build status to the source provider.
   */
  readonly buildStatusConfig?: BuildStatusConfig;
  /**
   * Information about the authorization settings for AWS CodeBuild to access the source code to be built.
   */
  readonly auth?: SourceAuth;
  /**
   *  Set to true to report the status of a build's start and finish to your source provider.
   */
  readonly reportBuildStatus?: boolean;
  /**
   * Enable this flag to ignore SSL warnings while connecting to the project source code.
   */
  readonly insecureSsl?: boolean;
  /**
   *  An identifier for this project source.
   */
  readonly sourceIdentifier?: String;
}

export interface SourceAuth {
  /**
   * The authorization type to use. The only valid value is OAUTH, which represents the OAuth authorization type.
   */
  readonly type: SourceAuthType;
  /**
   * The resource value that applies to the specified authorization type.
   */
  readonly resource?: String;
}
export enum SourceAuthType {
  OAUTH = 'OAUTH',
}
/**
 * Properties for starting a build with CodeBuildStartBuild
 */

export interface SourceVersion {
  readonly sourceIdentifier: string;
  readonly sourceVersion?: string;
}

export interface GitSubmodulesConfig {
  readonly fetchSubmodules: boolean;
}

export enum CacheMode {
  LOCAL_DOCKER_LAYER_CACHE = 'LOCAL_DOCKER_LAYER_CACHE',
  LOCAL_SOURCE_CACHE = 'LOCAL_SOURCE_CACHE',
  LOCAL_CUSTOM_CACHE = 'LOCAL_CUSTOM_CACHE',
}

export enum CacheType {
  NO_CACHE = 'NO_CACHE',
  S3 = 'S3',
  LOCAL = 'LOCAL',
}

export interface ProjectCache {
  readonly location?: string;
  readonly modes?: CacheMode[];
  readonly type: CacheType;
}

export enum LogStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export interface CloudWatchLogsConfig {
  readonly groupName?: string;
  readonly status: LogStatus;
  readonly streamName?: string;
}

export interface S3LogsConfig {
  readonly encryptionDisabled?: boolean;
  readonly location?: string;
  readonly status: LogStatus;
}

export interface LogsConfig {
  readonly cloudWatchLogs?: CloudWatchLogsConfig;
  readonly s3Logs?: S3LogsConfig;
}

export interface RegistryCredential {
  readonly credential: string;
  readonly credentialProvider: 'SECRETS_MANAGER';
}

export interface CodeBuildStartBuildProps extends sfn.TaskStateBaseProps {
  /**
   * CodeBuild project to start
   */
  readonly project: codebuild.Project;
  /**
   * An array of ProjectSource objects.
   *
   * @default - No override
   */
  readonly secondarySourcesOverride?: ProjectSource[];
  /**
   * An array of ProjectSourceVersion objects that specify one or more versions of the project's secondary sources to be used for this build only.
   *
   * @default - No override
   */
  readonly secondarySourcesVersionOverride?: SourceVersion[];
  /**
   * The version of the build input to be built, for this build only. If not specified, the latest version is used.
   *
   * @default - None
   */
  readonly sourceVersion?: String;
  /**
   * Build output artifact settings that override, for this build only, the latest ones already defined in the build project.
   *
   * @default - No override
   */
  readonly artifactsOverride?: ProjectArtifacts;
  /**
   * An array of ProjectArtifacts objects.
   *
   * @default - No override
   */
  readonly secondaryArtifactsOverride?: ProjectArtifacts[];
  /**
   * A set of environment variables that overrides, for this build only, the latest ones already defined in the build project.
   *
   * @default - No override
   */
  readonly environmentVariablesOverride?: EnvironmentVariable[];
  /**
   * A source input type, for this build, that overrides the source input defined in the build project.
   *
   * @default - No override
   */
  readonly sourceTypeOverride?: SourceType;
  /**
   * A location that overrides, for this build, the source location for the one defined in the build project.
   *
   * @default - No override
   */
  readonly sourceLocationOverride?: String;
  /**
   * An authorization type for this build that overrides the one defined in the build project.
   * This override applies only if the build project's source is BitBucket or GitHub.
   *
   * @default - No override
   */
  readonly sourceAuthOverride?: SourceAuth;
  /**
   * The user-defined depth of history, with a minimum value of 0, that overrides, for this build only,
   * any previous depth of history defined in the build project.
   *
   * @default - No override
   */
  readonly gitCloneDepthOverride?: number;
  /**
   *  Information about the Git submodules configuration for this build of an AWS CodeBuild build project.
   *
   * @default - No override
   */
  readonly gitSubmodulesConfigOverride?: GitSubmodulesConfig;
  /**
   * A buildspec file declaration that overrides, for this build only, the latest one already defined in the build project.
   *
   * @default - No override
   */
  readonly buildspecOverride?: String;
  /**
   * Contains information that defines how the build project reports the build status to the source provider.
   * This option is only used when the source provider is GITHUB, GITHUB_ENTERPRISE, or BITBUCKET.
   *
   * @default - No override
   */
  readonly buildStatusConfigOverride?: BuildStatusConfig;
  /**
   * Enable this flag to override the insecure SSL setting that is specified in the build project.
   * The insecure SSL setting determines whether to ignore SSL warnings while connecting to the project source code.
   * This override applies only if the build's source is GitHub Enterprise.
   *
   * @default - No override
   */
  readonly insecureSslOverride?: boolean;
  /**
   * Set to true to report to your source provider the status of a build's start and completion.
   * If you use this option with a source provider other than GitHub, GitHub Enterprise, or Bitbucket,
   * an invalidInputException is thrown.
   *
   * @default - No override
   */
  readonly reportBuildStatusOverride?: boolean;
  /**
   * A container type for this build that overrides the one specified in the build project.
   *
   * @default - No override
   */
  readonly environmentTypeOverride?: EnvironmentType;
  /**
   * The name of an image for this build that overrides the one specified in the build project.
   *
   * @default - No override
   */
  readonly imageOverride?: String;
  /**
   * The name of a compute type for this build that overrides the one specified in the build project.
   *
   * @default - No override
   */
  readonly computeTypeOverride?: ComputeType;
  /**
   * The name of a certificate for this build that overrides the one specified in the build project.
   *
   * @default - No override
   */
  readonly certificateOverride?: String;
  /**
   * A ProjectCache object specified for this build that overrides the one defined in the build project.
   *
   * @default - No override
   */
  readonly cacheOverride?: ProjectCache;
  /**
   * The name of a service role for this build that overrides the one specified in the build project.
   *
   * @default - No override
   */
  readonly serviceRoleOverride?: String;
  /**
   * The number of build timeout minutes, from 5 to 480 (8 hours), that overrides, for this build only,
   * the latest setting already defined in the build project.
   *
   * @default - No override
   */
  readonly timeoutInMinutesOverride?: number;
  /**
   * The number of minutes a build is allowed to be queued before it times out.
   *
   * @default - No override
   */
  readonly queuedTimeoutInMinutesOverride?: number;
  /**
   * The AWS Key Management Service (AWS KMS) customer master key (CMK)
   * that overrides the one specified in the build project.
   * The CMK key encrypts the build output artifacts.
   *
   * @default - No override
   */
  readonly encryptionKeyOverride?: String;
  /**
   * A unique, case sensitive identifier you provide to ensure the idempotency of the StartBuild request.
   * The token is included in the StartBuild request and is valid for 5 minutes.
   * If you repeat the StartBuild request with the same token, but change a parameter,
   * AWS CodeBuild returns a parameter mismatch error.
   *
   * @default - None
   */
  readonly idempotencyToken?: String;
  /**
   *  Log settings for this build that override the log settings defined in the build project.
   *
   * @default - No override
   */
  readonly logsConfigOverride?: LogsConfig;
  /**
   *  The credentials for access to a private registry.
   *
   * @default - No override
   */
  readonly registryCredentialOverride?: RegistryCredential;
  /**
   * The type of credentials AWS CodeBuild uses to pull images in your build.
   *
   * @default - No override
   */
  readonly imagePullCredentialsTypeOverride?: ImagePullCredentialsType;

  /**
   * Specifies if session debugging is enabled for this build
   */
  readonly debugSessionEnabled?: boolean;

  /**
   * Enable this flag to override privileged mode in the build project.
   */
  readonly privilegedModeOverride?: boolean;
}

/**
 * Start a CodeBuild Build as a task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-codebuild.html
 */
export class CodeBuildStartBuild extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: cdk.Construct, id: string, private readonly props: CodeBuildStartBuildProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, CodeBuildStartBuild.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskMetrics = {
      metricPrefixSingular: 'CodeBuildProject',
      metricPrefixPlural: 'CodeBuildProjects',
      metricDimensions: {
        ProjectArn: this.props.project.projectArn,
      },
    };

    this.taskPolicies = this.configurePolicyStatements();
  }

  private configurePolicyStatements(): iam.PolicyStatement[] {
    let policyStatements = [
      new iam.PolicyStatement({
        resources: [this.props.project.projectArn],
        actions: [
          'codebuild:StartBuild',
          'codebuild:StopBuild',
          'codebuild:BatchGetBuilds',
          'codebuild:BatchGetReports',
        ],
      }),
    ];

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          resources: [
            cdk.Stack.of(this).formatArn({
              service: 'events',
              resource: 'rule/StepFunctionsGetEventForCodeBuildStartBuildRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }

  /**
   * Provides the CodeBuild StartBuild service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('codebuild', 'startBuild', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ProjectName: this.props.project.projectName,
        SecondarySourcesOverride: this.props.secondarySourcesOverride
          ? this.props.secondarySourcesOverride.map(this.renderProjectSource)
          : undefined,
        SecondarySourcesVersionOverride: this.props.secondarySourcesVersionOverride
          ? this.props.secondarySourcesVersionOverride.map(({ sourceIdentifier, sourceVersion }) => ({
            SourceIdentifier: sourceIdentifier,
            SourceVersion: sourceVersion,
          }))
          : undefined,
        SourceVersion: this.props.sourceVersion,
        ArtifactsOverride: this.renderArtifactsOverride(this.props.artifactsOverride),
        SecondaryArtifactsOverride: this.props.secondaryArtifactsOverride
          ? this.props.secondaryArtifactsOverride.map(this.renderArtifactsOverride)
          : undefined,
        EnvironmentVariablesOverride: this.props.environmentVariablesOverride
          ? this.props.environmentVariablesOverride.map((environmentVariable) => {
            return {
              Name: environmentVariable.name,
              Type: environmentVariable.type,
              Value: environmentVariable.value,
            };
          })
          : undefined,
        SourceTypeOverride: this.props.sourceTypeOverride,
        SourceLocationOverride: this.props.sourceLocationOverride,
        SourceAuthOverride: this.props.sourceAuthOverride
          ? {
            Resource: this.props.sourceAuthOverride.resource,
            Type: this.props.sourceAuthOverride.type,
          }
          : undefined,
        GitCloneDepthOverride: this.props.gitCloneDepthOverride,
        GitSubmodulesConfigOverride: this.props.gitSubmodulesConfigOverride
          ? {
            FetchSubmodules: this.props.gitSubmodulesConfigOverride.fetchSubmodules,
          }
          : undefined,
        BuildspecOverride: this.props.buildspecOverride,
        BuildStatusConfigOverride: this.props.buildStatusConfigOverride
          ? {
            Context: this.props.buildStatusConfigOverride.context,
            TargetUrl: this.props.buildStatusConfigOverride.targetUrl,
          }
          : undefined,
        InsecureSslOverride: this.props.insecureSslOverride,
        ReportBuildStatusOverride: this.props.reportBuildStatusOverride,
        EnvironmentTypeOverride: this.props.environmentTypeOverride,
        ImageOverride: this.props.imageOverride,
        ComputeTypeOverride: this.props.computeTypeOverride,
        CertificateOverride: this.props.certificateOverride,
        CacheOverride: this.props.cacheOverride
          ? {
            Location: this.props.cacheOverride.location,
            Modes: this.props.cacheOverride.modes,
            Type: this.props.cacheOverride.type,
          }
          : undefined,
        ServiceRoleOverride: this.props.serviceRoleOverride,
        TimeoutInMinutesOverride: this.props.timeoutInMinutesOverride,
        QueuedTimeoutInMinutesOverride: this.props.queuedTimeoutInMinutesOverride,
        EncryptionKeyOverride: this.props.encryptionKeyOverride,
        IdempotencyToken: this.props.idempotencyToken,
        LogsConfigOverride: this.renderLogsConfigOverride(this.props.logsConfigOverride),
        RegistryCredentialOverride: this.props.registryCredentialOverride
          ? {
            Credential: this.props.registryCredentialOverride.credential,
            CredentialProvider: this.props.registryCredentialOverride.credentialProvider,
          }
          : undefined,
        ImagePullCredentialsTypeOverride: this.props.imagePullCredentialsTypeOverride,
        DebugSessionEnabled: this.props.debugSessionEnabled,
        PrivilegedModeOverride: this.props.privilegedModeOverride,
      }),
    };
  }

  private renderLogsConfigOverride(props?: LogsConfig) {
    if (!props) {
      return undefined;
    }

    return {
      S3Logs: props.s3Logs
        ? {
          EncryptionDisabled: props.s3Logs.encryptionDisabled,
          Location: props.s3Logs.location,
          Status: props.s3Logs.status,
        }
        : undefined,
      CloudWatchLogs: props.cloudWatchLogs
        ? {
          Status: props.cloudWatchLogs.status,
          GroupName: props.cloudWatchLogs.groupName,
          StreamName: props.cloudWatchLogs.streamName,
        }
        : undefined,
    };
  }

  private renderArtifactsOverride(props?: ProjectArtifacts) {
    return props
      ? {
        ArtifactIdentifier: props.artifactIdentifier,
        EncryptionDisabled: props.encryptionDisabled,
        Type: props.type,
        Location: props.location,
        Path: props.path,
        Name: props.name,
        NamespaceType: props.namespaceType,
        OverrideArtifactName: props.overrideArtifactName,
        Packaging: props.packaging,
      }
      : undefined;
  }

  private renderProjectSource(props: ProjectSource) {
    return props
      ? {
        Type: props.type,
        Location: props.location,
        GitCloneDepth: props.gitCloneDepth,
        GitSubmodulesConfig: props.gitSubmodulesConfig
          ? {
            FetchSubmodules: props.gitSubmodulesConfig.fetchSubmodules,
          }
          : undefined,
        Buildspec: props.buildspec,
        BuildStatusConfig: props.buildStatusConfig
          ? {
            Context: props.buildStatusConfig.context,
            TargetUrl: props.buildStatusConfig.targetUrl,
          }
          : undefined,
        Auth: props.auth
          ? {
            Type: props.auth.type,
            Resource: props.auth.resource,
          }
          : undefined,
        ReportBuildStatus: props.reportBuildStatus,
        InsecureSsl: props.insecureSsl,
        SourceIdentifier: props.sourceIdentifier,
      }
      : undefined;
  }
}

/**
 * Invocation type of CodeBuild Job
 */
export enum CodeBuildStartJobType {
  /**
   * Start the build asynchronously.
   *
   * Step Functions will not wait for the build to complete
   */
  REQUEST_RESPONSE = 'RequestResponse',

  /**
   * Start the build synchronously.
   *
   * Step Functions will wait for the build to complete before progressing to the next state
   */
  RUN_JOB = 'RunJob',
}
