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

  /**
   * The excecution class of the job.
   *
   * @default - STANDARD
   */
  readonly executionClass?: ExecutionClass;
}

/**
 * Properties for the worker configuration.
 */
export interface WorkerConfigurationProperty {
  /**
   * The type of predefined worker that is allocated when a job runs.
   *
   * @default - must choose one of `workerType` or `workerTypeV2`
   * @deprecated Use `workerTypeV2` for more flexibility in defining worker types.
   */
  readonly workerType?: WorkerType;

  /**
   * The type of predefined worker that is allocated when a job runs. Can be one of the
   * predefined values or dynamic values using `WorkerTypeV2.of(...)`.
   *
   * @default - must choose one of `workerType` or `workerTypeV2`
   */
  readonly workerTypeV2?: WorkerTypeV2;

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

    if (this.props.workerConfiguration) {
      const workerConfiguration = this.props.workerConfiguration;
      if (workerConfiguration?.workerTypeV2 && workerConfiguration.workerType) {
        throw new Error('You cannot set both \'workerType\' and \'workerTypeV2\' properties in \'workerConfiguration\'.');
      }
      if (!workerConfiguration.workerTypeV2 && !workerConfiguration.workerType) {
        throw new Error('You must set either \'workerType\' or \'workerTypeV2\' property in \'workerConfiguration\'.');
      }
    }
    const workerType = this.props.workerConfiguration?.workerType ?? this.props.workerConfiguration?.workerTypeV2?.name;

    return {
      Resource: integrationResourceArn('glue', 'startJobRun', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        JobName: this.props.glueJobName,
        Arguments: this.props.arguments?.value,
        Timeout: timeout,
        SecurityConfiguration: this.props.securityConfiguration,
        NotificationProperty: notificationProperty,
        WorkerType: workerType,
        NumberOfWorkers: this.props.workerConfiguration?.numberOfWorkers,
        ExecutionClass: this.props.executionClass,
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
 * @deprecated Use `workerTypeV2` property for `WorkerConfigurationProperty`
 */
export enum WorkerType {
  /**
   * Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   */
  STANDARD = 'Standard',

  /**
   * Each worker maps to 0.25 DPU (2 vCPU, 4 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for low volume streaming jobs.
   */
  G_025X = 'G.025X',

  /**
   * Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  G_1X = 'G.1X',

  /**
   * Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  G_2X = 'G.2X',

  /**
   * Each worker maps to 4 DPU (16 vCPU, 64 GB of memory, 256 GB disk), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  G_4X = 'G.4X',

  /**
   * Each worker maps to 8 DPU (32 vCPU, 128 GB of memory, 512 GB disk), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  G_8X = 'G.8X',

  /**
   * Each worker maps to 2 high-memory DPU [M-DPU] (8 vCPU, 64 GB of memory, 128 GB disk). Supported in Ray jobs.
   */
  Z_2X = 'Z.2X',
}

/**
 * The type of predefined worker that is allocated when a job runs.
 *
 * If you need to use a WorkerTypeV2 that doesn't exist as a static member, you
 * can instantiate a `WorkerTypeV2` object, e.g: `WorkerTypeV2.of('other type')`.
 */
export class WorkerTypeV2 {
  /**
   * Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   */
  public static readonly STANDARD = new WorkerTypeV2('Standard');

  /**
   * Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  public static readonly G_1X = new WorkerTypeV2('G.1X');

  /**
   * Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  public static readonly G_2X = new WorkerTypeV2('G.2X');

  /**
   * Each worker maps to 4 DPU (16 vCPU, 64 GB of memory, 256 GB disk), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  public static readonly G_4X = new WorkerTypeV2('G.4X');

  /**
   * Each worker maps to 8 DPU (32 vCPU, 128 GB of memory, 512 GB disk), and provides 1 executor per worker. We recommend this worker type for jobs whose workloads contain your most demanding transforms, aggregations, joins, and queries. This worker type is available only for AWS Glue version 3.0 or later jobs.
   */
  public static readonly G_8X = new WorkerTypeV2('G.8X');

  /**
   * Each worker maps to 0.25 DPU (2 vCPU, 4 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for low volume streaming jobs.
   */
  public static readonly G_025X = new WorkerTypeV2('G.025X');

  /**
   * Each worker maps to 2 high-memory DPU [M-DPU] (8 vCPU, 64 GB of memory, 128 GB disk). Supported in Ray jobs.
   */
  public static readonly Z_2X = new WorkerTypeV2('Z.2X');

  /**
   * Custom worker type
   * @param workerType custom worker type
   */
  public static of(workerType: string): WorkerTypeV2 {
    return new WorkerTypeV2(workerType);
  }

  /**
   * The name of this WorkerType, as expected by Job resource.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * The excecution class of the job.
 */
export enum ExecutionClass {
  /**
   * The flexible execution class is appropriate for time-insensitive jobs whose start and completion times may vary.
   * Only jobs with AWS Glue version 3.0 and above and command type `glueetl` will be allowed to set `ExecutionClass` to `FLEX`.
   * The flexible execution class is available for Spark jobs.
   */
  FLEX = 'FLEX',

  /**
   * The standard execution class is ideal for time-sensitive workloads that require fast job startup and dedicated resources.
   */
  STANDARD = 'STANDARD',
}
