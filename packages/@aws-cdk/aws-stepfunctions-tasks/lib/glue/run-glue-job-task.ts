import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration, Stack } from '@aws-cdk/core';
import { getResourceArn } from '../resource-arn-suffix';

/**
 * Properties for RunGlueJobTask
 *
 * @deprecated use `GlueStartJobRun`
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
   * The job arguments specifically for this run.
   *
   * For this job run, they replace the default arguments set in the job definition itself.
   *
   * @default - Default arguments set in the job definition
   */
  readonly arguments?: { [key: string]: string };

  /**
   * The job run timeout.
   *
   * This is the maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status.
   * Must be at least 1 minute.
   *
   * @default - Default timeout set in the job definition
   */
  readonly timeout?: Duration;

  /**
   * The name of the SecurityConfiguration structure to be used with this job run.
   *
   * This must match the Glue API
   * [single-line string pattern](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-common.html#aws-glue-api-regex-oneLine).
   *
   * @default - Default configuration set in the job definition
   */
  readonly securityConfiguration?: string;

  /**
   * After a job run starts, the number of minutes to wait before sending a job run delay notification.
   *
   * Must be at least 1 minute.
   *
   * @default - Default delay set in the job definition
   */
  readonly notifyDelayAfter?: Duration;
}

/**
 * Invoke a Glue job as a Task
 *
 * OUTPUT: the output of this task is a JobRun structure, for details consult
 * https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-runs.html#aws-glue-api-jobs-runs-JobRun
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html
 *
 * @deprecated use `GlueStartJobRun`
 */
export class RunGlueJobTask implements sfn.IStepFunctionsTask {
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly glueJobName: string, private readonly props: RunGlueJobTaskProps = {}) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC,
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call Glue.`);
    }
  }

  public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig {
    const notificationProperty = this.props.notifyDelayAfter ? { NotifyDelayAfter: this.props.notifyDelayAfter.toMinutes() } : null;
    let iamActions: string[] | undefined;
    if (this.integrationPattern === sfn.ServiceIntegrationPattern.FIRE_AND_FORGET) {
      iamActions = ['glue:StartJobRun'];
    } else if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
      iamActions = [
        'glue:StartJobRun',
        'glue:GetJobRun',
        'glue:GetJobRuns',
        'glue:BatchStopJobRun',
      ];
    }
    return {
      resourceArn: getResourceArn('glue', 'startJobRun', this.integrationPattern),
      policyStatements: [new iam.PolicyStatement({
        resources: [
          Stack.of(task).formatArn({
            service: 'glue',
            resource: 'job',
            resourceName: this.glueJobName,
          }),
        ],
        actions: iamActions,
      })],
      metricPrefixSingular: 'GlueJob',
      metricPrefixPlural: 'GlueJobs',
      metricDimensions: { GlueJobName: this.glueJobName },
      parameters: {
        JobName: this.glueJobName,
        Arguments: this.props.arguments,
        Timeout: this.props.timeout?.toMinutes(),
        SecurityConfiguration: this.props.securityConfiguration,
        NotificationProperty: notificationProperty,
      },
    };
  }
}
