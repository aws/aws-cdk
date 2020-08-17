import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';

import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Contains information that defines how the build project reports the build status to the source provider.
 */
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

/**
 * Information about the build output artifacts for the build project.
 */
export interface ProjectArtifacts {
  /**
   * An identifier for this artifact definition.
   *
   * @default none
   */
  readonly artifactIdentifier?: string;
  /**
   *  Information that tells you if encryption for build artifacts is disabled.
   *
   * @default false
   */
  readonly encryptionDisabled?: boolean;
  /**
   * If this flag is set, a name specified in the buildspec file overrides the artifact name.
   *
   * @default false
   */
  readonly overrideArtifactName?: boolean;
  /**
   * The type of build output artifact.
   */
  readonly type: 'CODEPIPELINE' | 'S3' | 'NO_ARTIFACTS';
  /**
   * Information about the build output artifact location.
   *
   * @default none
   */
  readonly location?: String;
  /**
   * Along with namespaceType and name, the pattern that AWS CodeBuild will use to name and store the output artifact.
   *
   * @default none
   */
  readonly path?: String;
  /**
   * Along with path and name, the pattern that AWS CodeBuild will
   * use to determine the name and location to store the output artifact.
   *
   * @default NONE
   */
  readonly namespaceType?: 'BUILD_ID' | 'NONE';
  /**
   * Along with path and namespaceType, the pattern that AWS CodeBuild will use to name and store the output artifact.
   *
   * @default NONE
   */
  readonly name?: String;
  /**
   * The type of build output artifact to create.
   *
   * @default NONE
   */
  readonly packaging?: 'NONE' | 'ZIP';
}

/**
 * Information about an environment variable for a build project or a build.
 */
export interface EnvironmentVariable {
  /**
   * The name or key of the environment variable.
   */
  readonly name: string;
  /**
   * The value of the environment variable.
   */
  readonly value: String;
  /**
   * The type of environment variable.
   *
   * @default PLAINTEXT
   */
  readonly type?: codebuild.BuildEnvironmentVariableType;
}

/**
 * Information about the build input source code for the build project.
 */
export interface ProjectSource {
  /**
   * The type of repository that contains the source code to be built.
   */
  readonly type: string;
  /**
   * Information about the location of the source code to be built.
   *
   * @default none
   */
  readonly location?: String;
  /**
   * Information about the git clone depth for the build project.
   *
   * @default 0
   */
  readonly gitCloneDepth?: number;
  /**
   * Information about the Git submodules configuration for the build project.
   *
   * @default none
   */
  readonly gitSubmodulesConfig?: GitSubmodulesConfig;
  /**
   * The build spec declaration to use for the builds in this build project.
   *
   * @default none
   */
  readonly buildspec?: String;
  /**
   * Contains information that defines how the AWS CodeBuild build project
   * reports the build status to the source provider.
   *
   * @default none
   */
  readonly buildStatusConfig?: BuildStatusConfig;
  /**
   * Information about the authorization settings for AWS CodeBuild to access the source code to be built.
   *
   * @default none
   */
  readonly auth?: SourceAuth;
  /**
   *  Set to true to report the status of a build's start and finish to your source provider.
   *
   * @default false
   */
  readonly reportBuildStatus?: boolean;
  /**
   * Enable this flag to ignore SSL warnings while connecting to the project source code.
   *
   * @default false
   */
  readonly insecureSsl?: boolean;
  /**
   *  An identifier for this project source.
   *
   * @default none
   */
  readonly sourceIdentifier?: String;
}

/**
 * Information about the authorization settings for AWS CodeBuild to access the source code to be built.
 */
export interface SourceAuth {
  /**
   * The authorization type to use.
   */
  readonly type: 'OAUTH';
  /**
   * The resource value that applies to the specified authorization type.
   *
   * @default none
   */
  readonly resource?: String;
}

/**
 *  A source identifier and its corresponding version.
 */
export interface SourceVersion {
  /**
   * An identifier for a source in the build project.
   */
  readonly sourceIdentifier: string;
  /**
   * The source version for the corresponding source identifier.
   *
   * @default none
   */
  readonly sourceVersion?: string;
}

/**
 * Information about the Git submodules configuration for an AWS CodeBuild build project.
 */
export interface GitSubmodulesConfig {
  /**
   * Set to true to fetch Git submodules for your AWS CodeBuild build project.
   */
  readonly fetchSubmodules: boolean;
}

/**
 * Information about the cache for the build project.
 */
export interface ProjectCache {
  /**
   * Information about the cache location.
   *
   * @default none
   */
  readonly location?: string;
  /**
   * If you use a LOCAL cache, the local cache mode. You can use one or more local cache modes at the same time.
   *
   * @default none
   */
  readonly modes?: ('LOCAL_DOCKER_LAYER_CACHE' | 'LOCAL_SOURCE_CACHE' | 'LOCAL_CUSTOM_CACHE')[];
  /**
   * The type of cache used by the build project.
   */
  readonly type: 'NO_CACHE' | 'S3' | 'LOCAL';
}

/**
 * Information about Amazon CloudWatch Logs for a build project.
 */
export interface CloudWatchLogsConfig {
  /**
   * The group name of the logs in Amazon CloudWatch Logs.
   *
   * @default none
   */
  readonly groupName?: string;
  /**
   * The current status of the logs in Amazon CloudWatch Logs for a build project.
   */
  readonly status: 'ENABLED' | 'DISABLED';
  /**
   * The prefix of the stream name of the Amazon CloudWatch Logs.
   *
   * @default none
   */
  readonly streamName?: string;
}

/**
 * Information about S3 logs for a build project.
 */
export interface S3LogsConfig {
  /**
   * Set to true if you do not want your S3 build log output encrypted. By default S3 build logs are encrypted.
   *
   * @default false
   */
  readonly encryptionDisabled?: boolean;
  /**
   * The ARN of an S3 bucket and the path prefix for S3 logs.
   *
   * @default none
   */
  readonly location?: string;
  /**
   * The current status of the S3 build logs.
   */
  readonly status: 'ENABLED' | 'DISABLED';
}

/**
 * Information about logs for a build project.
 * These can be logs in Amazon CloudWatch Logs, built in a specified S3 bucket, or both.
 */
export interface LogsConfig {
  /**
   * Information about Amazon CloudWatch Logs for a build project.
   *
   * @default none
   */
  readonly cloudWatchLogs?: CloudWatchLogsConfig;
  /**
   * Information about logs built to an S3 bucket for a build project.
   *
   * @default none
   */
  readonly s3Logs?: S3LogsConfig;
}

/**
 * Information about credentials that provide access to a private Docker registry.
 */
export interface RegistryCredential {
  /**
   * The Amazon Resource Name (ARN) or name of credentials created using AWS Secrets Manager.
   */
  readonly credential: string;
  /**
   * The service that created the credentials to access a private Docker registry.
   */
  readonly credentialProvider: 'SECRETS_MANAGER';
}

/**
 * Properties for CodeBuildStartBuild
 */
export interface CodeBuildStartBuildProps extends sfn.TaskStateBaseProps {
  /**
   * CodeBuild project to start
   */
  readonly project: codebuild.IProject;
  /**
   * An array of ProjectSource objects.
   *
   * @default No override
   */
  readonly secondarySourcesOverride?: ProjectSource[];
  /**
   * An array of ProjectSourceVersion objects that specify one or more versions
   * of the project's secondary sources to be used for this build only.
   *
   * @default No override
   */
  readonly secondarySourcesVersionOverride?: SourceVersion[];
  /**
   * The version of the build input to be built, for this build only.
   * If not specified, the latest version is used.
   *
   * @default - None
   */
  readonly sourceVersion?: String;
  /**
   * Build output artifact settings that override, for this build only,
   * the latest ones already defined in the build project.
   *
   * @default No override
   */
  readonly artifactsOverride?: ProjectArtifacts;
  /**
   * An array of ProjectArtifacts objects.
   *
   * @default No override
   */
  readonly secondaryArtifactsOverride?: ProjectArtifacts[];
  /**
   * A set of environment variables that overrides, for this build only,
   * the latest ones already defined in the build project.
   *
   * @default No override
   */
  readonly environmentVariablesOverride?: EnvironmentVariable[];
  /**
   * A source input type, for this build, that overrides the source input defined in the build project.
   *
   * @default No override
   */
  readonly sourceTypeOverride?: string;
  /**
   * A location that overrides, for this build, the source location for the one defined in the build project.
   *
   * @default No override
   */
  readonly sourceLocationOverride?: String;
  /**
   * An authorization type for this build that overrides the one defined in the build project.
   * This override applies only if the build project's source is BitBucket or GitHub.
   *
   * @default No override
   */
  readonly sourceAuthOverride?: SourceAuth;
  /**
   * The user-defined depth of history, with a minimum value of 0, that overrides, for this build only,
   * any previous depth of history defined in the build project.
   *
   * @default No override
   */
  readonly gitCloneDepthOverride?: number;
  /**
   *  Information about the Git submodules configuration for this build of an AWS CodeBuild build project.
   *
   * @default No override
   */
  readonly gitSubmodulesConfigOverride?: GitSubmodulesConfig;
  /**
   * A buildspec file declaration that overrides, for this build only,
   * the latest one already defined in the build project.
   *
   * @default No override
   */
  readonly buildspecOverride?: String;
  /**
   * Contains information that defines how the build project reports the build status to the source provider.
   * This option is only used when the source provider is GITHUB, GITHUB_ENTERPRISE, or BITBUCKET.
   *
   * @default No override
   */
  readonly buildStatusConfigOverride?: BuildStatusConfig;
  /**
   * Enable this flag to override the insecure SSL setting that is specified in the build project.
   * The insecure SSL setting determines whether to ignore SSL warnings while connecting to the project source code.
   * This override applies only if the build's source is GitHub Enterprise.
   *
   * @default No override
   */
  readonly insecureSslOverride?: boolean;
  /**
   * Set to true to report to your source provider the status of a build's start and completion.
   * If you use this option with a source provider other than GitHub, GitHub Enterprise, or Bitbucket,
   * an invalidInputException is thrown.
   *
   * @default No override
   */
  readonly reportBuildStatusOverride?: boolean;
  /**
   * A container type for this build that overrides the one specified in the build project.
   *
   * @default No override
   */
  readonly environmentTypeOverride?: string;
  /**
   * The name of an image for this build that overrides the one specified in the build project.
   *
   * @default No override
   */
  readonly imageOverride?: String;
  /**
   * The name of a compute type for this build that overrides the one specified in the build project.
   *
   * @default No override
   */
  readonly computeTypeOverride?: codebuild.ComputeType;
  /**
   * The name of a certificate for this build that overrides the one specified in the build project.
   *
   * @default No override
   */
  readonly certificateOverride?: String;
  /**
   * A ProjectCache object specified for this build that overrides the one defined in the build project.
   *
   * @default No override
   */
  readonly cacheOverride?: ProjectCache;
  /**
   * The name of a service role for this build that overrides the one specified in the build project.
   *
   * @default No override
   */
  readonly serviceRoleOverride?: String;
  /**
   * The number of build timeout minutes, from 5 to 480 (8 hours), that overrides, for this build only,
   * the latest setting already defined in the build project.
   *
   * @default No override
   */
  readonly timeoutInMinutesOverride?: number;
  /**
   * The number of minutes a build is allowed to be queued before it times out.
   *
   * @default No override
   */
  readonly queuedTimeoutInMinutesOverride?: number;
  /**
   * The AWS Key Management Service (AWS KMS) customer master key (CMK)
   * that overrides the one specified in the build project.
   * The CMK key encrypts the build output artifacts.
   *
   * @default No override
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
   * @default No override
   */
  readonly logsConfigOverride?: LogsConfig;
  /**
   *  The credentials for access to a private registry.
   *
   * @default No override
   */
  readonly registryCredentialOverride?: RegistryCredential;
  /**
   * The type of credentials AWS CodeBuild uses to pull images in your build.
   *
   * @default No override
   */
  readonly imagePullCredentialsTypeOverride?: codebuild.ImagePullPrincipalType;
  /**
   * Specifies if session debugging is enabled for this build
   *
   * @default No override
   */
  readonly debugSessionEnabled?: boolean;
  /**
   * Enable this flag to override privileged mode in the build project.
   *
   * @default No override
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
