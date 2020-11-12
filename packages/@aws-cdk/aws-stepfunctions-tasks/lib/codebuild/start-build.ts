import * as codebuild from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Override properties for CodeBuildStartBuild
 *
 */
export interface OverrideProjectProps extends codebuild.StartBuildOptions {
  /**
   * Specifies if session debugging is enabled for this build.
   *
   * @default - the session debugging is disabled.
   */
  readonly debugSessionEnabled?: boolean;

  /**
   * A unique, case sensitive identifier you provide to ensure the idempotency of the StartBuild request.
   *
   * @default - no idempotency token.
   */
  readonly idempotencyToken?: string;
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
   * A set of environment variables to be used for this build only.
   *
   * @deprecated - use {@link OverrideProjectProps.environmentVariables} instead
   * @default - the latest environment variables already defined in the build project.
   */
  readonly environmentVariablesOverride?: { [name: string]: codebuild.BuildEnvironmentVariable };

  /**
   * Override properties of the build of CodeBuild.
   *
   * @default - no override properties.
   */
  readonly overrides?: OverrideProjectProps;
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

  constructor(scope: Construct, id: string, private readonly props: CodeBuildStartBuildProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, CodeBuildStartBuild.SUPPORTED_INTEGRATION_PATTERNS);
    this.validateOverridingParameters(props);

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
    const sourceConfig = this.props.overrides?.source?.bind(this.props.project.stack, this.props.project);
    const secondarySources = this.props.overrides?.secondarySources?.map(source => source.bind(this.props.project.stack, this.props.project));
    return {
      Resource: integrationResourceArn('codebuild', 'startBuild', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ProjectName: this.props.project.projectName,
        ArtifactsOverride: this.props.overrides?.artifacts?.bind(this.props.project.stack, this.props.project).artifactsProperty,
        BuildspecOverride: this.props.overrides?.buildSpec?.toBuildSpec(),
        BuildStatusConfigOverride: sourceConfig?.sourceProperty.buildStatusConfig,
        ComputeTypeOverride: this.props.overrides?.environment?.computeType,
        DebugSessionEnabled: this.props.overrides?.debugSessionEnabled,
        EncryptionKeyOverride: this.props.overrides?.encryptionKey?.keyArn,
        EnvironmentTypeOverride: this.props.overrides?.environment?.buildImage?.type,
        EnvironmentVariablesOverride: this.props.overrides?.environmentVariables ?
          this.serializeEnvVariables(this.props.overrides?.environmentVariables!) :
          (this.props.environmentVariablesOverride
            ? this.serializeEnvVariables(this.props.environmentVariablesOverride)
            : undefined),
        GitCloneDepthOverride: sourceConfig?.sourceProperty.gitCloneDepth,
        GitSubmodulesConfigOverride: sourceConfig?.sourceProperty.gitSubmodulesConfig,
        IdempotencyToken: this.props.overrides?.idempotencyToken,
        ImageOverride: this.props.overrides?.environment?.buildImage?.imageId,
        ImagePullCredentialsTypeOverride: this.props.overrides?.environment?.buildImage?.imagePullPrincipalType,
        InsecureSslOverride: sourceConfig?.sourceProperty.insecureSsl,
        PrivilegedModeOverride: this.props.overrides?.environment?.privileged,
        RegistryCredentialOverride: this.props.overrides?.environment?.buildImage?.secretsManagerCredentials ? {
          credentialProvider: 'SECRETS_MANAGER',
          credential: this.props.overrides!.environment!.buildImage!.secretsManagerCredentials.secretArn,
        } : undefined,
        ReportBuildStatusOverride: sourceConfig?.sourceProperty.reportBuildStatus,
        SecondaryArtifactsOverride: this.props.overrides?.secondaryArtifacts?.map(artifact =>
          artifact.bind(this.props.project.stack, this.props.project).artifactsProperty,
        ),
        SecondarySourcesOverride: secondarySources?.map(source => source.sourceProperty),
        SecondarySourcesVersionOverride: secondarySources?.map(source => {
          return {
            sourceIdentifier: source.sourceProperty.sourceIdentifier,
            sourceVersion: source.sourceVersion,
          };
        }),
        ServiceRoleOverride: this.props.overrides?.role?.roleArn,
        SourceAuthOverride: sourceConfig?.sourceProperty.auth,
        SourceLocationOverride: sourceConfig?.sourceProperty.location,
        SourceTypeOverride: this.props.overrides?.source?.type,
        SourceVersion: sourceConfig?.sourceVersion,
        TimeoutInMinutesOverride: this.props.overrides?.timeout?.toMinutes(),
      }),
    };
  }

  private serializeEnvVariables(environmentVariables: { [name: string]: codebuild.BuildEnvironmentVariable }) {
    return Object.keys(environmentVariables).map(name => ({
      Name: name,
      Type: environmentVariables[name].type || codebuild.BuildEnvironmentVariableType.PLAINTEXT,
      Value: environmentVariables[name].value,
    }));
  }

  private validateOverridingParameters(props: CodeBuildStartBuildProps) {
    if (props.overrides?.secondaryArtifacts && props.overrides!.secondaryArtifacts!.length > 12) {
      throw new Error(`The maximum overrides that can be specified for 'secondaryArtifacts' is 12. Received: ${props.overrides!.secondaryArtifacts!.length}`);
    }
    if (props.overrides?.secondarySources && props.overrides!.secondarySources!.length > 12) {
      throw new Error(`The maximum overrides that can be specified for 'secondarySources' is 12. Received: ${props.overrides!.secondarySources!.length}`);
    }
    if (props.overrides?.timeout && (props.overrides!.timeout!.toMinutes() < 5
      || props.overrides!.timeout!.toMinutes() > 480)) {
      throw new Error('The value of override property "timeout" must be between 5 and 480 minutes.');
    }
  }
}
