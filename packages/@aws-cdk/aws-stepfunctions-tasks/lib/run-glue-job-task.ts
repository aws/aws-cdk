import * as glue from '@aws-cdk/aws-glue';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for RunGlueJobTask
 */
export interface RunGlueJobTaskProps {

  /**
   * The service integration pattern indicates different ways to start the Glue job.
   *
   * The valid value for Glue is either FIRE_AND_FORGET or SYNC.
   *
   * @default FIRE_AND_FORGET
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;

  /**
   * The ID of a previous JobRun to retry.
   *
   * @default - Creates new run
   */
  readonly jobRunId?: string;

  /**
   * The job arguments specifically for this run. For this job run, they replace the
   * default arguments set in the job definition itself.
   *
   * @default - Only arguments consumed by Glue
   */
  readonly arguments?: { [key: string]: string };

  /**
   * The number of AWS Glue data processing units (DPUs) to allocate to this JobRun.
   *
   * @default - 10
   */
  readonly allocatedCapacity?: number;

  /**
   * The JobRun timeout in minutes. This is the maximum time that a job run can consume
   * resources before it is terminated and enters TIMEOUT status.
   *
   * @default - 2,880 (48 hours)
   */
  readonly timeout?: Duration;

  /**
   * The name of the SecurityConfiguration structure to be used with this job run.
   *
   * @default - No configuration
   */
  readonly securityConfiguration?: string;

  /**
   * Specifies configuration properties of a job run notification.
   *
   * @default - No configuration
   */
  readonly notificationProperty?: glue.CfnJob.NotificationPropertyProperty;
}

/**
 * Invoke a Glue job as a Task
 *
 * OUTPUT: the output of this task is a JobRun structure, for details consult
 * https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-runs.html#aws-glue-api-jobs-runs-JobRun
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html
 */
export class RunGlueJobTask implements sfn.IStepFunctionsTask {
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly glueJobName: string, private readonly props: RunGlueJobTaskProps = {}) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call Glue.`);
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn("glue", "startJobRun", this.integrationPattern),
      policyStatements: [new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "glue:StartJobRun",
          "glue:GetJobRun",
          "glue:GetJobRuns",
          "glue:BatchStopJobRun"
        ],
      })],
      metricPrefixSingular: 'GlueJob',
      metricPrefixPlural: 'GlueJobs',
      metricDimensions: { GlueJobName: this.glueJobName },
      parameters: {
        JobName: this.glueJobName,
        JobRunId: this.props.jobRunId,
        Arguments: this.props.arguments,
        AllocatedCapacity: this.props.allocatedCapacity,
        Timeout: this.props.timeout,
        SecurityConfiguration: this.props.securityConfiguration,
        NotificationProperty: this.props.notificationProperty
      }
    };
  }
}
