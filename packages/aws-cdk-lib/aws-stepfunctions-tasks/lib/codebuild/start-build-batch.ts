import { Construct } from 'constructs';
import * as codebuild from '../../../aws-codebuild';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for CodeBuildStartBuildBatch
 */
export interface CodeBuildStartBuildBatchProps extends sfn.TaskStateBaseProps {
  /**
   * CodeBuild project to start
   */
  readonly project: codebuild.IProject;

  /**
   * A set of environment variables to be used for this build only.
   *
   * @default - the latest environment variables already defined in the build project.
   */
  readonly environmentVariablesOverride?: { [name: string]: codebuild.BuildEnvironmentVariable };
}

/**
 * Start a CodeBuild BatchBuild as a task
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/APIReference/API_StartBuildBatch.html
 */
export class CodeBuildStartBuildBatch extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: CodeBuildStartBuildBatchProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, CodeBuildStartBuildBatch.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskMetrics = {
      metricPrefixSingular: 'CodeBuildProject',
      metricPrefixPlural: 'CodeBuildProjects',
      metricDimensions: {
        ProjectArn: this.props.project.projectArn,
      },
    };

    this.taskPolicies = this.configurePolicyStatements();
  }

  /**
   * Configure the necessary permissions to invoke the CodeBuild StartBuildBatch API
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/codebuild-iam.html#codebuild-iam-startbuildbatch
   */
  private configurePolicyStatements(): iam.PolicyStatement[] {
    let policyStatements: iam.PolicyStatement[];

    switch (this.integrationPattern) {
      case sfn.IntegrationPattern.RUN_JOB:
        policyStatements = [
          new iam.PolicyStatement({
            resources: [this.props.project.projectArn],
            actions: [
              'codebuild:StartBuildBatch',
              'codebuild:StopBuildBatch',
              'codebuild:BatchGetBuildBatches',
            ],
          }),
          new iam.PolicyStatement({
            actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
            resources: [
              cdk.Stack.of(this).formatArn({
                service: 'events',
                resource: 'rule/StepFunctionsGetEventForCodeBuildStartBuildBatchRule',
              }),
            ],
          }),
        ];
        break;
      case sfn.IntegrationPattern.REQUEST_RESPONSE:
        policyStatements = [
          new iam.PolicyStatement({
            resources: [this.props.project.projectArn],
            actions: ['codebuild:StartBuildBatch'],
          }),
        ];
        break;
      default:
        throw new Error(`Unsupported integration pattern: ${this.integrationPattern}`);
    }

    return policyStatements;
  }

  /**
   * Provides the CodeBuild StartBuild service integration task configuration
   *
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('codebuild', 'startBuildBatch', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ProjectName: this.props.project.projectName,
        EnvironmentVariablesOverride: this.props.environmentVariablesOverride
          ? this.serializeEnvVariables(this.props.environmentVariablesOverride)
          : undefined,
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
}
