import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for InvokeBatchJob
 *
 * @experimental
 */
export interface InvokeBatchJobProps {
  /**
   * The job definition used by this job.
   * This value can be one of name, name:revision, or the Amazon Resource Name (ARN) for the job definition.
   * If name is specified without a revision then the latest active revision is used
   */
  readonly jobDefinition: string;

  /**
   * The name of the job.
   * The first character must be alphanumeric, and up to 128 letters (uppercase and lowercase),
   * numbers, hyphens, and underscores are allowed.
   */
  readonly jobName: string;

  /**
   * The job queue into which the job is submitted.
   * You can specify either the name or the Amazon Resource Name (ARN) of the queue.
   *
   */
  readonly jobQueue: string;

  /**
   * The service integration pattern indicates different ways to call TerminateCluster.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default SYNC
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;

  /**
   * The payload to be passed as parametrs to the batch job
   *
   * @default - No parameters are passed
   */
  readonly payload?: { [key: string]: any };
}

/**
 * A Step Functions Task to invoke AWS Batch
 *
 * @experimental
 */
export class InvokeBatchJob implements sfn.IStepFunctionsTask {
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: InvokeBatchJobProps) {
    this.integrationPattern =
      props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(
        `Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call InvokeBatchJob.`
      );
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn(
        'batch',
        'submitJob',
        this.integrationPattern
      ),
      policyStatements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: [
            'batch:SubmitJob',
            'batch:DescribeJobs',
            'batch:TerminateJob'
          ]
        }),
        new iam.PolicyStatement({
          resources: [
            `arn:aws:events:${Aws.REGION}:${Aws.ACCOUNT_ID}:rule/StepFunctionsGetEventsForBatchJobsRule`
          ],
          actions: [
            'events:PutTargets',
            'events:PutRule',
            'events:DescribeRule'
          ]
        })
      ],
      parameters: {
        JobDefinition: this.props.jobDefinition,
        JobName: this.props.jobName,
        JobQueue: this.props.jobQueue,
        Parameter: this.props.payload
      }
    };
  }
}
