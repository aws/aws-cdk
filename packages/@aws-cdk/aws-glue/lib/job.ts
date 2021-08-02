import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { IConnection } from './connection';
import { CfnJob } from './glue.generated';
import { ISecurityConfiguration } from './security-configuration';

/**
 * AWS Glue version determines the versions of Apache Spark and Python that are available to the job.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/add-job.html.
 *
 * If you need to use a GlueVersion that doesn't exist as a static member, you
 * can instantiate a `GlueVersion` object, e.g: `GlueVersion.of('1.5')`.
 */
export class GlueVersion {
  /**
   * Glue version using Spark 2.2.1 and Python 2.7
   */
  public static readonly V0_9 = new GlueVersion('0.9');

  /**
   * Glue version using Spark 2.4.3, Python 2.7 and Python 3.6
   */
  public static readonly V1_0 = new GlueVersion('1.0');

  /**
   * Glue version using Spark 2.4.3 and Python 3.7
   */
  public static readonly V2_0 = new GlueVersion('2.0');

  /**
   * Custom Glue version
   * @param version custom version
   */
  public static of(version: string): GlueVersion {
    return new GlueVersion(version);
  }

  /**
   * The name of this GlueVersion, as expected by Job resource.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

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
 * Python version
 */
export enum PythonVersion {
  /**
   * Python 2 (the exact version depends on GlueVersion and JobCommand used)
   */
  TWO = '2',

  /**
   * Python 3 (the exact version depends on GlueVersion and JobCommand used)
   */
  THREE = '3',
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
 * The job command name used for job run.
 *
 * If you need to use a JobCommandName that doesn't exist as a static member, you
 * can instantiate a `JobCommandName` object, e.g: `JobCommandName.of('other name')`.
 */
export class JobCommandName {
  /**
   * Command for running a Glue ETL job.
   */
  public static readonly ETL = new JobCommandName('glueetl');

  /**
   * Command for running a Glue streaming job.
   */
  public static readonly STREAMING = new JobCommandName('gluestreaming');

  /**
   * Command for running a Glue python shell job.
   */
  public static readonly PYTHON_SHELL = new JobCommandName('pythonshell');

  /**
   * Custom command name
   * @param name command name
   */
  public static of(name: string): WorkerType {
    return new JobCommandName(name);
  }

  /**
   * The name of this JobCommandName, as expected by Job resource.
   */
  public readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }
}

/**
 * JobCommand specifies the execution environment and the code executed when a job is run.
 */
export class JobCommand {

  /**
   * Create a glueetl JobCommand with the given scriptLocation
   *
   * @param scriptLocation specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job.
   * @param pythonVersion specifies the Python shell version for the ETL job. default is PythonVersion.TWO.
   */
  public static etl(scriptLocation: string, pythonVersion?: PythonVersion) {
    return new JobCommand(JobCommandName.ETL, scriptLocation, pythonVersion);
  }

  /**
   * Create a gluestreaming JobCommand with the given scriptLocation
   *
   * @param scriptLocation specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job.
   * @param pythonVersion specifies the Python shell version for the streaming job. default is PythonVersion.TWO.
   */
  public static streaming(scriptLocation: string, pythonVersion?: PythonVersion) {
    return new JobCommand(JobCommandName.STREAMING, scriptLocation, pythonVersion);
  }

  /**
   * Create a pythonshell JobCommand with the given scriptLocation and pythonVersion
   *
   * @param scriptLocation specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job.
   * @param pythonVersion the Python version being used to execute a Python shell job. default is PythonVersion.TWO.
   */
  public static pythonShell(scriptLocation: string, pythonVersion?: PythonVersion) {
    return new JobCommand(JobCommandName.PYTHON_SHELL, scriptLocation, pythonVersion);
  }

  /**
   * The name of the job command e.g. glueetl for an Apache Spark ETL job or pythonshell for a Python shell job.
   */
  readonly name: JobCommandName;

  /**
   * Specifies the Amazon Simple Storage Service (Amazon S3) path to a script that executes a job.
   */
  readonly scriptLocation: string;

  /**
   * The Python version being used to execute a Python shell job.
   */
  readonly pythonVersion?: PythonVersion;

  constructor(name: JobCommandName, scriptLocation: string, pythonVersion?: PythonVersion) {
    this.name = name;
    this.scriptLocation = scriptLocation;
    this.pythonVersion = pythonVersion;
  }
}

/**
 * Constants for some of the special parameters used by {@link Job}.
 *
 * These constants can be used as argument names in {@link JobProps.defaultArguments}.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
 */
export enum JobSpecialArgumentNames {
  /**
   * The script programming language. This value must be either `scala` or `python`. If this parameter is not present, the default is `python`.
   */
  JOB_LANGUAGE = '--job-language',

  /**
   * The Scala class that serves as the entry point for your Scala script. This applies only if your `--job-language` is set to `scala`.
   */
  CLASS = '--class',

  /**
   * The Amazon Simple Storage Service (Amazon S3) location where your ETL script is located (in the form `s3://path/to/my/script.py`).
   * This parameter overrides a script location set in the JobCommand object.
   */
  SCRIPT_LOCATION = '--scriptLocation',

  /**
   * The Amazon S3 paths to additional Python modules that AWS Glue adds to the Python path before executing your script.
   * Multiple values must be complete paths separated by a comma (`,`).
   */
  EXTRA_PY_FILES = '--extra-py-files',

  /**
   * The Amazon S3 paths to additional Java `.jar` files that AWS Glue adds to the Java classpath before executing your script.
   * Multiple values must be complete paths separated by a comma (`,`).
   */
  EXTRA_JARS = '--extra-jars',

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   * This option is only available in AWS Glue version 2.0.
   */
  USER_JARS_FIRST = '--user-jars-first',

  /**
   * The Amazon S3 paths to additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   * Multiple values must be complete paths separated by a comma (`,`).
   */
  EXTRA_FILES = '--extra-files',

  /**
   * Controls the behavior of a job bookmark. The following option values can be set.
   */
  JOB_BOOKMARK_OPTION = '--job-bookmark-option',

  /**
   * Specifies an Amazon S3 path to a bucket that can be used as a temporary directory for the job.
   */
  TEMP_DIR = '--TempDir',

  /**
   * Enables the EMRFS S3-optimized committer for writing Parquet data into Amazon S3.
   * Setting the value to `true` enables the committer. By default the flag is turned off.
   */
  ENABLE_S3_PARQUET_OPTIMIZED_COMMITTER = '--enable-s3-parquet-optimized-committer',

  /**
   * Sets the EMRFS rename algorithm version to version 2.
   * This option is only available on AWS Glue version 1.0.
   */
  ENABLE_RENAME_ALGORITHM_V2 = '--enable-rename-algorithm-v2',

  /**
   * Enables using the AWS Glue Data Catalog as an Apache Spark Hive metastore.
   */
  ENABLE_GLUE_DATA_CATALOG = '--enable-glue-datacatalog',

  /**
   * Enables the collection of metrics for job profiling for this job run.
   * To enable metrics, only specify the key; no value is needed.
   */
  ENABLE_METRICS = '--enable-metrics',

  /**
   * Enables real-time continuous logging for AWS Glue jobs to view real-time Apache Spark job logs in CloudWatch.
   */
  ENABLE_CONTINUOUS_LOGGING = '--enable-continuous-cloudwatch-log',

  /**
   * Specifies a standard filter (true) or no filter (false) for continuous logging.
   * Choosing the standard filter prunes out non-useful Apache Spark driver/executor and Apache Hadoop YARN heartbeat log messages.
   * Choosing no filter gives all the log messages.
   */
  ENABLE_CONTINUOUS_LOG_FILTER = '--enable-continuous-log-filter',

  /**
   * Specifies a custom Amazon CloudWatch log group name for a job enabled for continuous logging.
   */
  LOG_GROUP = '--continuous-log-logGroup',

  /**
   * Specifies a custom CloudWatch log stream prefix for a job enabled for continuous logging.
   */
  LOG_STREAM_PREFIX = '--continuous-log-logStreamPrefix',

  /**
   * Specifies a custom conversion log pattern for a job enabled for continuous logging.
   */
  LOG_CONVERSION_PATTERN = '--continuous-log-conversionPattern',

  /**
   * Enables Apache Spark web UI.
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   */
  ENABLE_SPARK_UI = '--enable-spark-ui',

  /**
   * Specifies the Amazon S3 path for storing the Spark event logs for the job.
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   */
  SPARK_UI_LOGS_PATH = '--spark-event-logs-path',
}

/**
 * Interface representing a created or an imported {@link Job}.
 */
export interface IJob extends cdk.IResource {
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
   * Defines a CloudWatch event rule triggered when this job moves to the SUCCEEDED state.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onSuccess(id?: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule triggered when this job moves to the FAILED state.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onFailure(id?: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Defines a CloudWatch event rule triggered when this job moves to the TIMEOUT state.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types
   */
  onTimeout(id?: string, options?: events.OnEventOptions): events.Rule;

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

  /**
   * Create a CloudWatch Metric that's based on Glue Job events
   * {@see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#glue-event-types}
   * The metric has namespace = 'AWS/Events', metricName = 'TriggeredRules' and RuleName = rule.ruleName dimension.
   *
   * @param rule for use in setting RuleName dimension value
   * @param props metric properties
   */
  protected static metricRule(rule: events.IRule, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Events',
      metricName: 'TriggeredRules',
      dimensions: { RuleName: rule.ruleName },
      statistic: cloudwatch.Statistic.SUM,
      ...props,
    }).attachTo(rule);
  }


  /**
   * Returns the job arn
   * @param scope
   * @param jobName
   */
  protected static buildJobArn(scope: constructs.Construct, jobName: string) : string {
    return cdk.Stack.of(scope).formatArn({
      service: 'glue',
      resource: 'job',
      resourceName: jobName,
    });
  }

  public abstract readonly jobArn: string;
  public abstract readonly jobName: string;
  private cachedRules: Record<string, events.Rule> = {};

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
   * Return a CloudWatch Event Rule matching JobState.SUCCEEDED.
   *
   * If no id or options are provided, the created rule is cached. Later no-args calls with retrieves from cache but ones with args.
   * Later calls with args lead to the creation of a new Rule
   *
   * @param id optional construct id. default is SUCCEEDEDRule
   * @param options optional event options. default is {}
   */
  public onSuccess(id?: string, options: events.OnEventOptions = {}): events.Rule {
    return this.rule(JobState.SUCCEEDED, id, options);
  }

  /**
   * Return a CloudWatch Event Rule matching FAILED state.
   *
   * If no id or options are provided, the created rule is cached. Later no-args calls with retrieves from cache but ones with args.
   * Later calls with args lead to the creation of a new Rule
   *
   * @param id optional construct id. default is FAILEDRule
   * @param options optional event options. default is {}
   */
  public onFailure(id?: string, options: events.OnEventOptions = {}): events.Rule {
    return this.rule(JobState.FAILED, id, options);
  }

  /**
   * Return a CloudWatch Event Rule matching TIMEOUT state.
   *
   * If no id or options are provided, the created rule is cached. Later no-args calls with retrieves from cache but ones with args.
   * Later calls with args lead to the creation of a new Rule
   *
   * @param id optional construct id. default is TIMEOUTRule
   * @param options optional event options. default is {}
   */
  public onTimeout(id?: string, options: events.OnEventOptions = {}): events.Rule {
    return this.rule(JobState.TIMEOUT, id, options);
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
      dimensions: {
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
    return JobBase.metricRule(this.onSuccess(), props);
  }

  /**
   * Return a CloudWatch Metric indicating job failure.
   *
   * This metric is based on the Rule returned by no-args onFailure() call.
   */
  public metricFailure(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return JobBase.metricRule(this.onFailure(), props);
  }

  /**
   * Return a CloudWatch Metric indicating job timeout.
   *
   * This metric is based on the Rule returned by no-args onTimeout() call.
   */
  public metricTimeout(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return JobBase.metricRule(this.onTimeout(), props);
  }

  /**
   * Creates a new rule for a transition into the input jobState or attempt to create-if-necessary and retrieve the default rule
   * - A new rule is created but not cached if the id parameter is specified
   * - A create/retrieve from cache scenario happens when no explicit id (and options) are not provided
   * The reason is that the default rule is used by onSuccess, onFailure and onTimeout methods which are in turn used by metrics methods.
   *
   * @param jobState the job state
   * @param id optional construct id
   * @param options optional event options
   * @private
   */
  private rule(jobState: JobState, id?: string, options: events.OnEventOptions = {}): events.Rule {
    // No caching
    if (id) {
      const rule = this.onEvent(id, options);
      rule.addEventPattern({
        detail: {
          state: [jobState],
        },
      });
      return rule;
    }
    // Caching
    const ruleId = `${jobState}Rule`;
    if (!this.cachedRules[ruleId]) {
      const rule = this.onEvent(ruleId, {
        description: `Rule triggered when Glue job ${this.jobName} is in ${jobState} state`,
      });
      rule.addEventPattern({
        detail: {
          state: [jobState],
        },
      });
      this.cachedRules[ruleId] = rule;
    }
    return this.cachedRules[ruleId];
  }

}

/**
 * Attributes for importing {@link Job}.
 */
export interface JobAttributes {
  /**
   * The name of the job.
   */
  readonly jobName: string;
}

/**
 * Construction properties for {@link Job}.
 */
export interface JobProps {
  /**
   * The name of the job.
   *
   * @default cloudformation generated name.
   */
  readonly jobName?: string;

  /**
   * The description of the job.
   *
   * @default no value.
   */
  readonly description?: string;

  /**
   * The number of AWS Glue data processing units (DPUs) that can be allocated when this job runs.
   * Cannot be used for Glue version 2.0 and later - workerType and numberOfWorkers should be used instead.
   *
   * @default 10 when you specify an Apache Spark ETL or Sreaming job, 0.0625 DPU when you specify a Python shell job.
   */
  readonly maxCapacity?: number;

  /**
   * The maximum number of times to retry this job after a JobRun fails.
   *
   * @default 0
   */
  readonly maxRetries?: number;

  /**
   * The maximum number of concurrent runs allowed for the job.
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
   * Glue version determines the versions of Apache Spark and Python that AWS Glue supports. The Python version indicates the version supported for jobs of type Spark.
   *
   */
  readonly glueVersion: GlueVersion;

  /**
   * The type of predefined worker that is allocated when a job runs.
   *
   * @default differs based on specific glueVersion
   */
  readonly workerType?: WorkerType;

  /**
   * The number of workers of a defined {@link WorkerType} that are allocated when a job runs.
   *
   * @default differs based on specific glueVersion/workerType
   */
  readonly numberOfWorkers?: number;

  /**
   * The {@link Connection}s used for this job.
   *
   * @default no connection.
   */
  readonly connections?: IConnection [];

  /**
   * The {@link SecurityConfiguration} to use for this job.
   *
   * @default no security configuration.
   */
  readonly securityConfiguration?: ISecurityConfiguration;

  /**
   * The default arguments for this job, specified as name-value pairs.
   *
   * {@link JobSpecialArgumentNames} defines some of the Special Parameters used by AWS Glue.
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html A list of Special Parameters Used by AWS Glue
   * @default no arguments
   */
  readonly defaultArguments?: { [key: string]: string };

  /**
   * The tags to use with this job.
   *
   * @default no tags
   */
  readonly tags?: { [key: string]: string };

  /**
   * The IAM role associated with this job.
   *
   * @default an IAM role is generated
   */
  readonly role?: iam.IRole;

  /**
   * The job command specifying the type of the job e.g. glueetl or pythonshell and relevant parameters.
   */
  readonly jobCommand: JobCommand;
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
      public readonly jobArn = JobBase.buildJobArn(scope, attrs.jobName);
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
   * The IAM role associated with this job.
   */
  public readonly role: iam.IRole;

  constructor(scope: constructs.Construct, id: string, props: JobProps) {
    super(scope, id, {
      physicalName: props.jobName,
    });

    // Create a basic service role if one is not provided https://docs.aws.amazon.com/glue/latest/dg/create-service-policy.html
    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
    });

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: props.jobCommand.name.name,
        scriptLocation: props.jobCommand.scriptLocation,
        pythonVersion: props.jobCommand.pythonVersion,
      },
      glueVersion: props.glueVersion?.name,
      workerType: props.workerType?.name,
      numberOfWorkers: props.numberOfWorkers,
      maxCapacity: props.maxCapacity,
      maxRetries: props.maxRetries,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      notificationProperty: props.notifyDelayAfter ? { notifyDelayAfter: props.notifyDelayAfter.toMinutes() } : undefined,
      timeout: props.timeout ? props.timeout.toMinutes() : undefined,
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration ? props.securityConfiguration.securityConfigurationName : undefined,
      defaultArguments: props.defaultArguments,
      tags: props.tags,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = JobBase.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }
}
