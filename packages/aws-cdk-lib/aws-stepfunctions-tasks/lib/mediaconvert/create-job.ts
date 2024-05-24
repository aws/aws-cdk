import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import * as cdk from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for creating a MediaConvert Job
 *
 * See the CreateJob API for complete documentation
 * @see https://docs.aws.amazon.com/mediaconvert/latest/apireference/jobs.html#jobspost
 *
 */
export interface MediaConvertCreateJobProps extends sfn.TaskStateBaseProps {

  /**
   * The input data for the MediaConvert Create Job invocation
   */
  readonly createJobRequest: { [key: string]: any };

}

/**
 * A Step Functions Task to create a job in MediaConvert.
 *
 * The JobConfiguration/Request Syntax is defined in the Parameters in the Task State
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-mediaconvert.html
 *
 * Response syntax: see CreateJobResponse schema
 * https://docs.aws.amazon.com/mediaconvert/latest/apireference/jobs.html#jobs-response-examples
 *
 */
export class MediaConvertCreateJob extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies: iam.PolicyStatement[] | undefined;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: MediaConvertCreateJobProps) {
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, MediaConvertCreateJob.SUPPORTED_INTEGRATION_PATTERNS);

    cdk.requireProperty(props.createJobRequest, 'Role', this);
    cdk.requireProperty(props.createJobRequest, 'Settings', this);

    this.taskPolicies = this.renderPolicyStatements();
  }

  private renderPolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.props.createJobRequest.Role],
        conditions: {
          StringLike: { 'iam:PassedToService': 'mediaconvert.amazonaws.com' },
        },
      }),
      new iam.PolicyStatement({
        actions: ['mediaconvert:CreateJob'],
        resources: ['*'],
      }),
    ];

    if (this.props.integrationPattern == sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['mediaconvert:GetJob', 'mediaconvert:CancelJob'],
          resources: ['*'],
        }),
      );
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          resources: [
            Stack.of(this).formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForMediaConvertJobRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }

  /**
   * Provides the MediaConvert CreateJob Service Integration Task Configuration
   *
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('mediaconvert', 'createJob', this.props.integrationPattern),
      Parameters: this.props.createJobRequest,
    };
  }
}
