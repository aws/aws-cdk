import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Duration, Stack } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for starting an AWS Glue job as a task
 */
export interface GlueStartJobRunProps extends sfn.TaskStateBaseProps {

  /**
   * Glue job name
   */
  readonly glueJobName: string;

  /**
   * The job arguments specifically for this run.
   *
   * For this job run, they replace the default arguments set in the job
   * definition itself.
   *
   * @default - Default arguments set in the job definition
   */
  readonly arguments?: sfn.TaskInput;

  /**
   * The name of the SecurityConfiguration structure to be used with this job run.
   *
   * This must match the Glue API
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-common.html#aws-glue-api-regex-oneLine
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

  /**
   * The worker configuration for this run.
   *
   * @default - Default worker configuration in the job definition
   */
  readonly workerConfiguration?: WorkerConfigurationProperty;
}

/**
 * Properties for the worker configuration.
 */
export interface WorkerConfigurationProperty {
  /**
   * The type of predefined worker that is allocated when a job runs.
   */
  readonly workerType: WorkerType;

  /**
   * The number of workers of a defined `WorkerType` that are allocated when a job runs.
   */
  readonly numberOfWorkers: number;
}

/**
 * Starts an AWS Glue job in a Task state
 *
 * OUTPUT: the output of this task is a JobRun structure, for details consult
 * https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-jobs-runs.html#aws-glue-api-jobs-runs-JobRun
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-glue.html
 */
export class GlueStartJobRun extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: GlueStartJobRunProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, GlueStartJobRun.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.getPolicies();

    this.taskMetrics = {
      metricPrefixSingular: 'GlueJob',
      metricPrefixPlural: 'GlueJobs',
      metricDimensions: { GlueJobName: this.props.glueJobName },
    };
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    const notificationProperty = this.props.notifyDelayAfter ? { NotifyDelayAfter: this.props.notifyDelayAfter.toMinutes() } : null;

    let timeout: number | undefined = undefined;
    if (this.props.timeout) {
      timeout = this.props.timeout.toMinutes();
    } else if (this.props.taskTimeout?.seconds) {
      timeout = Duration.seconds(this.props.taskTimeout.seconds).toMinutes();
    } else if (this.props.taskTimeout?.path) {
      timeout = sfn.JsonPath.numberAt(this.props.taskTimeout.path);
    }

    return {
      Resource: integrationResourceArn('glue', 'startJobRun', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        JobName: this.props.glueJobName,
        Arguments: this.props.arguments?.value,
        Timeout: timeout,
        SecurityConfiguration: this.props.securityConfiguration,
        NotificationProperty: notificationProperty,
        WorkerType: this.props.workerConfiguration?.workerType,
        NumberOfWorkers: this.props.workerConfiguration?.numberOfWorkers,
      }),
      TimeoutSeconds: undefined,
      TimeoutSecondsPath: undefined,
    };
  }

  private getPolicies(): iam.PolicyStatement[] {
    let iamActions: string[] | undefined;
    if (this.integrationPattern === sfn.IntegrationPattern.REQUEST_RESPONSE) {
      iamActions = ['glue:StartJobRun'];
    } else if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      iamActions = [
        'glue:StartJobRun',
        'glue:GetJobRun',
        'glue:GetJobRuns',
        'glue:BatchStopJobRun',
      ];
    }

    return [new iam.PolicyStatement({
      resources: [
        Stack.of(this).formatArn({
          service: 'glue',
          resource: 'job',
          resourceName: this.props.glueJobName,
        }),
      ],
      actions: iamActions,
    })];
  }
}

/**
 * The type of predefined worker that is allocated when a job runs.
 *
 * If you need to use a WorkerType that doesn't exist as a static member, you
 * can instantiate a `WorkerType` object, e.g: `WorkerType.of('other type')`.
 */
export enum WorkerType {
  /**
   * Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   */
  STANDARD ='Standard',

  /**
   * Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  G_1X ='G.1X',

  /**
   * Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  G_2X ='G.2X',

  /**
   * Each worker maps to 4 DPU (16 vCPU, 64 GB of memory, 256 GB disk), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  G_4X ='G.4X',

  /**
   * Each worker maps to 8 DPU (32 vCPU, 128 GB of memory, 512 GB disk), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  G_8X ='G.8X',

  /**
   * Each worker maps to 0.25 DPU (2 vCPU, 4 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for low volume streaming jobs.
   */
  G_025X ='G.025X',

  /**
   * Each worker maps to 2 high-memory DPU [M-DPU] (8 vCPU, 64 GB of memory, 128 GB disk). Supported in Ray jobs.
   */
  Z_2X ='Z.2X',
}
