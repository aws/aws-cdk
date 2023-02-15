import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Code, JobExecutable, JobExecutableConfig, JobType } from '.';
import { IConnection } from './connection';
import { CfnJob } from './glue.generated';
import { ISecurityConfiguration } from './security-configuration';

/**
 * The type of predefined worker that is allocated when a job runs.
 *
 * If you need to use a WorkerType that doesn't exist as a static member, you
 * can instantiate a `WorkerType` object, e.g: `WorkerType.of('other type')`.
 */
export class WorkerType {
  /**
   * Each worker provides 4 vCPU, 16 GB of memory and a 50GB disk, and 2 executors per worker.
   */
  public static readonly STANDARD = new WorkerType('Standard');

  /**
   * Each worker maps to 1 DPU (4 vCPU, 16 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  public static readonly G_1X = new WorkerType('G.1X');

  /**
   * Each worker maps to 2 DPU (8 vCPU, 32 GB of memory, 128 GB disk), and provides 1 executor per worker. Suitable for memory-intensive jobs.
   */
  public static readonly G_2X = new WorkerType('G.2X');

  /**
   * Each worker maps to 0.25 DPU (2 vCPU, 4 GB of memory, 64 GB disk), and provides 1 executor per worker. Suitable for low volume streaming jobs.
   */
  public static readonly G_025X = new WorkerType('G.025X');

  /**
   * Each worker maps to 2 high-memory DPU [M-DPU] (8 vCPU, 64 GB of memory, 128 GB disk). Supported in Ray jobs.
   */
  public static readonly Z_2X = new WorkerType('Z.2X');

  /**
   * Custom worker type
   * @param workerType custom worker type
   */
  public static of(workerType: string): WorkerType {
    return new WorkerType(workerType);
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
 * Job states emitted by Glue to CloudWatch Events.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types for more information.
 */
export enum JobState {
  /**
   * State indicating job run succeeded
   */
  SUCCEEDED = 'SUCCEEDED',

  /**
   * State indicating job run failed
   */
  FAILED = 'FAILED',

  /**
   * State indicating job run timed out
   */
  TIMEOUT = 'TIMEOUT',

  /**
   * State indicating job is starting
   */
  STARTING = 'STARTING',

  /**
   * State indicating job is running
   */
  RUNNING = 'RUNNING',

  /**
   * State indicating job is stopping
   */
  STOPPING = 'STOPPING',

  /**
   * State indicating job stopped
   */
  STOPPED = 'STOPPED',
}

/**
 * The Glue CloudWatch metric type.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitoring-awsglue-with-cloudwatch-metrics.html
 */
export enum MetricType {
  /**
   * A value at a point in time.
   */
  GAUGE = 'gauge',

  /**
   * An aggregate number.
   */
  COUNT = 'count',
}

/**
 * Interface representing a created or an imported `Job`.
 */
export interface IJob extends cdk.IResource, iam.IGrantable {
  /**
   * The name of the job.
   * @attribute
   */
  readonly jobName: string;

  /**
   * The ARN of the job.
   * @attribute
   */
  readonly jobArn: string;

  /**
   * Defines a CloudWatch event rule triggered when something happens with this job.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule triggered when this job moves to the input jobState.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onStateChange(id: string, jobState: JobState, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule triggered when this job moves to the SUCCEEDED state.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onSuccess(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule triggered when this job moves to the FAILED state.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onFailure(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule triggered when this job moves to the TIMEOUT state.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onTimeout(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Create a CloudWatch metric.
   *
   * @param metricName name of the metric typically prefixed with `glue.driver.`, `glue.<executorId>.` or `glue.ALL.`.
   * @param type the metric type.
   * @param props metric options.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitoring-awsglue-with-cloudwatch-metrics.html
   */
  metric(metricName: string, type: MetricType, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Create a CloudWatch Metric indicating job success.
   */
  metricSuccess(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Create a CloudWatch Metric indicating job failure.
   */
  metricFailure(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Create a CloudWatch Metric indicating job timeout.
   */
  metricTimeout(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

abstract class JobBase extends cdk.Resource implements IJob {

  public abstract readonly jobArn: string;
  public abstract readonly jobName: string;
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * Create a CloudWatch Event Rule for this Glue Job when it's in a given state
   *
   * @param id construct id
   * @param options event options. Note that some values are overridden if provided, these are
   *  - eventPattern.source = ['aws.glue']
   *  - eventPattern.detailType = ['Glue Job State Change', 'Glue Job Run Status']
   *  - eventPattern.detail.jobName = [this.jobName]
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  public onEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.glue'],
      detailType: ['Glue Job State Change', 'Glue Job Run Status'],
      detail: {
        jobName: [this.jobName],
      },
    });
    return rule;
  }

  /**
   * Create a CloudWatch Event Rule for the transition into the input jobState.
   *
   * @param id construct id.
   * @param jobState the job state.
   * @param options optional event options.
   */
  public onStateChange(id: string, jobState: JobState, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, {
      description: `Rule triggered when Glue job ${this.jobName} is in ${jobState} state`,
      ...options,
    });
    rule.addEventPattern({
      detail: {
        state: [jobState],
      },
    });
    return rule;
  }

  /**
   * Create a CloudWatch Event Rule matching JobState.SUCCEEDED.
   *
   * @param id construct id.
   * @param options optional event options. default is {}.
   */
  public onSuccess(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onStateChange(id, JobState.SUCCEEDED, options);
  }

  /**
   * Return a CloudWatch Event Rule matching FAILED state.
   *
   * @param id construct id.
   * @param options optional event options. default is {}.
   */
  public onFailure(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onStateChange(id, JobState.FAILED, options);
  }

  /**
   * Return a CloudWatch Event Rule matching TIMEOUT state.
   *
   * @param id construct id.
   * @param options optional event options. default is {}.
   */
  public onTimeout(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.onStateChange(id, JobState.TIMEOUT, options);
  }

  /**
   * Create a CloudWatch metric.
   *
   * @param metricName name of the metric typically prefixed with `glue.driver.`, `glue.<executorId>.` or `glue.ALL.`.
   * @param type the metric type.
   * @param props metric options.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitoring-awsglue-with-cloudwatch-metrics.html
   */
  public metric(metricName: string, type: MetricType, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      metricName,
      namespace: 'Glue',
      dimensionsMap: {
        JobName: this.jobName,
        JobRunId: 'ALL',
        Type: type,
      },
      ...props,
    }).attachTo(this);
  }

  /**
   * Return a CloudWatch Metric indicating job success.
   *
   * This metric is based on the Rule returned by no-args onSuccess() call.
   */
  public metricSuccess(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return metricRule(this.metricJobStateRule('SuccessMetricRule', JobState.SUCCEEDED), props);
  }

  /**
   * Return a CloudWatch Metric indicating job failure.
   *
   * This metric is based on the Rule returned by no-args onFailure() call.
   */
  public metricFailure(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return metricRule(this.metricJobStateRule('FailureMetricRule', JobState.FAILED), props);
  }

  /**
   * Return a CloudWatch Metric indicating job timeout.
   *
   * This metric is based on the Rule returned by no-args onTimeout() call.
   */
  public metricTimeout(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return metricRule(this.metricJobStateRule('TimeoutMetricRule', JobState.TIMEOUT), props);
  }

  /**
   * Creates or retrieves a singleton event rule for the input job state for use with the metric JobState methods.
   *
   * @param id construct id.
   * @param jobState the job state.
   * @private
   */
  private metricJobStateRule(id: string, jobState: JobState): events.Rule {
    return this.node.tryFindChild(id) as events.Rule ?? this.onStateChange(id, jobState);
  }
}

/**
 * Properties for enabling Spark UI monitoring feature for Spark-based Glue jobs.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 */
export interface SparkUIProps {
  /**
   * Enable Spark UI.
   */
  readonly enabled: boolean

  /**
   * The bucket where the Glue job stores the logs.
   *
   * @default a new bucket will be created.
   */
  readonly bucket?: s3.IBucket;

  /**
   * The path inside the bucket (objects prefix) where the Glue job stores the logs.
   *
   * @default '/' - the logs will be written at the root of the bucket
   */
  readonly prefix?: string;
}

/**
 * The Spark UI logging location.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 */
export interface SparkUILoggingLocation {
  /**
   * The bucket where the Glue job stores the logs.
   */
  readonly bucket: s3.IBucket;

  /**
   * The path inside the bucket (objects prefix) where the Glue job stores the logs.
   *
   * @default '/' - the logs will be written at the root of the bucket
   */
  readonly prefix?: string;
}

/**
 * Properties for enabling Continuous Logging for Glue Jobs.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-continuous-logging-enable.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 */
export interface ContinuousLoggingProps {
  /**
   * Enable continouous logging.
   */
  readonly enabled: boolean;

  /**
   * Specify a custom CloudWatch log group name.
   *
   * @default - a log group is created with name `/aws-glue/jobs/logs-v2/`.
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * Specify a custom CloudWatch log stream prefix.
   *
   * @default - the job run ID.
   */
  readonly logStreamPrefix?: string;

  /**
   * Filter out non-useful Apache Spark driver/executor and Apache Hadoop YARN heartbeat log messages.
   *
   * @default true
   */
  readonly quiet?: boolean;

  /**
   * Apply the provided conversion pattern.
   *
   * This is a Log4j Conversion Pattern to customize driver and executor logs.
   *
   * @default `%d{yy/MM/dd HH:mm:ss} %p %c{1}: %m%n`
   */
  readonly conversionPattern?: string;
}

/**
 * Attributes for importing `Job`.
 */
export interface JobAttributes {
  /**
   * The name of the job.
   */
  readonly jobName: string;

  /**
   * The IAM role assumed by Glue to run this job.
   *
   * @default - undefined
   */
  readonly role?: iam.IRole;
}

/**
 * Construction properties for `Job`.
 */
export interface JobProps {
  /**
   * The job's executable properties.
   */
  readonly executable: JobExecutable;

  /**
   * The name of the job.
   *
   * @default - a name is automatically generated
   */
  readonly jobName?: string;

  /**
   * The description of the job.
   *
   * @default - no value
   */
  readonly description?: string;

  /**
   * The number of AWS Glue data processing units (DPUs) that can be allocated when this job runs.
   * Cannot be used for Glue version 2.0 and later - workerType and workerCount should be used instead.
   *
   * @default - 10 when job type is Apache Spark ETL or streaming, 0.0625 when job type is Python shell
   */
  readonly maxCapacity?: number;

  /**
   * The maximum number of times to retry this job after a job run fails.
   *
   * @default 0
   */
  readonly maxRetries?: number;

  /**
   * The maximum number of concurrent runs allowed for the job.
   *
   * An error is returned when this threshold is reached. The maximum value you can specify is controlled by a service limit.
   *
   * @default 1
   */
  readonly maxConcurrentRuns?: number;

  /**
   * The number of minutes to wait after a job run starts, before sending a job run delay notification.
   *
   * @default - no delay notifications
   */
  readonly notifyDelayAfter?: cdk.Duration;

  /**
   * The maximum time that a job run can consume resources before it is terminated and enters TIMEOUT status.
   *
   * @default cdk.Duration.hours(48)
   */
  readonly timeout?: cdk.Duration;

  /**
   * The type of predefined worker that is allocated when a job runs.
   *
   * @default - differs based on specific Glue version
   */
  readonly workerType?: WorkerType;

  /**
   * The number of workers of a defined `WorkerType` that are allocated when a job runs.
   *
   * @default - differs based on specific Glue version/worker type
   */
  readonly workerCount?: number;

  /**
   * The `Connection`s used for this job.
   *
   * Connections are used to connect to other AWS Service or resources within a VPC.
   *
   * @default [] - no connections are added to the job
   */
  readonly connections?: IConnection[];

  /**
   * The `SecurityConfiguration` to use for this job.
   *
   * @default - no security configuration.
   */
  readonly securityConfiguration?: ISecurityConfiguration;

  /**
   * The default arguments for this job, specified as name-value pairs.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html for a list of reserved parameters
   * @default - no arguments
   */
  readonly defaultArguments?: { [key: string]: string };

  /**
   * The tags to add to the resources on which the job runs
   *
   * @default {} - no tags
   */
  readonly tags?: { [key: string]: string };

  /**
   * The IAM role assumed by Glue to run this job.
   *
   * If providing a custom role, it needs to trust the Glue service principal (glue.amazonaws.com) and be granted sufficient permissions.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/getting-started-access.html
   *
   * @default - a role is automatically generated
   */
  readonly role?: iam.IRole;

  /**
   * Enables the collection of metrics for job profiling.
   *
   * @default - no profiling metrics emitted.
   *
   * @see `--enable-metrics` at https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly enableProfilingMetrics? :boolean;

  /**
   * Enables the Spark UI debugging and monitoring with the specified props.
   *
   * @default - Spark UI debugging and monitoring is disabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly sparkUI?: SparkUIProps,

  /**
   * Enables continuous logging with the specified props.
   *
   * @default - continuous logging is disabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-continuous-logging-enable.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly continuousLogging?: ContinuousLoggingProps,
}

/**
 * A Glue Job.
 */
export class Job extends JobBase {
  /**
   * Creates a Glue Job
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param attrs Import attributes
   */
  public static fromJobAttributes(scope: constructs.Construct, id: string, attrs: JobAttributes): IJob {
    class Import extends JobBase {
      public readonly jobName = attrs.jobName;
      public readonly jobArn = jobArn(scope, attrs.jobName);
      public readonly grantPrincipal = attrs.role ?? new iam.UnknownPrincipal({ resource: this });
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of the job.
   */
  public readonly jobArn: string;

  /**
   * The name of the job.
   */
  public readonly jobName: string;

  /**
   * The IAM role Glue assumes to run this job.
   */
  public readonly role: iam.IRole;

  /**
   * The principal this Glue Job is running as.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The Spark UI logs location if Spark UI monitoring and debugging is enabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  public readonly sparkUILoggingLocation?: SparkUILoggingLocation;

  constructor(scope: constructs.Construct, id: string, props: JobProps) {
    super(scope, id, {
      physicalName: props.jobName,
    });

    const executable = props.executable.bind();

    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
    });
    this.grantPrincipal = this.role;

    const sparkUI = props.sparkUI?.enabled ? this.setupSparkUI(executable, this.role, props.sparkUI) : undefined;
    this.sparkUILoggingLocation = sparkUI?.location;
    const continuousLoggingArgs = props.continuousLogging?.enabled ? this.setupContinuousLogging(this.role, props.continuousLogging) : {};
    const profilingMetricsArgs = props.enableProfilingMetrics ? { '--enable-metrics': '' } : {};

    const defaultArguments = {
      ...this.executableArguments(executable),
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...sparkUI?.args,
      ...this.checkNoReservedArgs(props.defaultArguments),
    };

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: executable.type.name,
        scriptLocation: this.codeS3ObjectUrl(executable.script),
        pythonVersion: executable.pythonVersion,
      },
      glueVersion: executable.glueVersion.name,
      workerType: props.workerType?.name,
      numberOfWorkers: props.workerCount,
      maxCapacity: props.maxCapacity,
      maxRetries: props.maxRetries,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      notificationProperty: props.notifyDelayAfter ? { notifyDelayAfter: props.notifyDelayAfter.toMinutes() } : undefined,
      timeout: props.timeout?.toMinutes(),
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration?.securityConfigurationName,
      tags: props.tags,
      defaultArguments,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = jobArn(this, resourceName);
    this.jobName = resourceName;
  }

  /**
   * Check no usage of reserved arguments.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  private checkNoReservedArgs(defaultArguments?: { [key: string]: string }) {
    if (defaultArguments) {
      const reservedArgs = new Set(['--debug', '--mode', '--JOB_NAME']);
      Object.keys(defaultArguments).forEach((arg) => {
        if (reservedArgs.has(arg)) {
          throw new Error(`The ${arg} argument is reserved by Glue. Don't set it`);
        }
      });
    }
    return defaultArguments;
  }

  private executableArguments(config: JobExecutableConfig) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = config.language;
    if (config.className) {
      args['--class'] = config.className;
    }
    if (config.extraJars && config.extraJars?.length > 0) {
      args['--extra-jars'] = config.extraJars.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (config.extraPythonFiles && config.extraPythonFiles.length > 0) {
      args['--extra-py-files'] = config.extraPythonFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (config.extraFiles && config.extraFiles.length > 0) {
      args['--extra-files'] = config.extraFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (config.extraJarsFirst) {
      args['--user-jars-first'] = 'true';
    }
    return args;
  }

  private setupSparkUI(executable: JobExecutableConfig, role: iam.IRole, props: SparkUIProps) {
    if (JobType.PYTHON_SHELL === executable.type) {
      throw new Error('Spark UI is not available for JobType.PYTHON_SHELL jobs');
    } else if (JobType.RAY === executable.type) {
      throw new Error('Spark UI is not available for JobType.RAY jobs');
    }

    const bucket = props.bucket ?? new s3.Bucket(this, 'SparkUIBucket');
    bucket.grantReadWrite(role);
    const args = {
      '--enable-spark-ui': 'true',
      '--spark-event-logs-path': bucket.s3UrlForObject(props.prefix),
    };

    return {
      location: {
        prefix: props.prefix,
        bucket,
      },
      args,
    };
  }

  private setupContinuousLogging(role: iam.IRole, props: ContinuousLoggingProps) {
    const args: {[key: string]: string} = {
      '--enable-continuous-cloudwatch-log': 'true',
      '--enable-continuous-log-filter': (props.quiet ?? true).toString(),
    };

    if (props.logGroup) {
      args['--continuous-log-logGroup'] = props.logGroup.logGroupName;
      props.logGroup.grantWrite(role);
    }

    if (props.logStreamPrefix) {
      args['--continuous-log-logStreamPrefix'] = props.logStreamPrefix;
    }
    if (props.conversionPattern) {
      args['--continuous-log-conversionPattern'] = props.conversionPattern;
    }
    return args;
  }

  private codeS3ObjectUrl(code: Code) {
    const s3Location = code.bind(this, this.role).s3Location;
    return `s3://${s3Location.bucketName}/${s3Location.objectKey}`;
  }
}

/**
 * Create a CloudWatch Metric that's based on Glue Job events
 * {@see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types}
 * The metric has namespace = 'AWS/Events', metricName = 'TriggeredRules' and RuleName = rule.ruleName dimension.
 *
 * @param rule for use in setting RuleName dimension value
 * @param props metric properties
 */
function metricRule(rule: events.IRule, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
  return new cloudwatch.Metric({
    namespace: 'AWS/Events',
    metricName: 'TriggeredRules',
    dimensionsMap: { RuleName: rule.ruleName },
    statistic: cloudwatch.Statistic.SUM,
    ...props,
  }).attachTo(rule);
}


/**
 * Returns the job arn
 * @param scope
 * @param jobName
 */
function jobArn(scope: constructs.Construct, jobName: string) : string {
  return cdk.Stack.of(scope).formatArn({
    service: 'glue',
    resource: 'job',
    resourceName: jobName,
  });
}
