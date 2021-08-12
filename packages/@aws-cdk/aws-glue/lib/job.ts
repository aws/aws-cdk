import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { JobExecutable, JobExecutableConfig } from '.';
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
    // Caching (for metric methods and default arg-less event methods)
    const cachedRuleId = `${jobState}Rule`;
    const cachedRule = this.node.tryFindChild(cachedRuleId);
    // Use the already created rule if no id is provided (arg-less event methods or events supporting metrics)
    if (!id && cachedRule) {
      return cachedRule as events.Rule;
    }
    const rule = this.onEvent(id || cachedRuleId, {
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
   * The type of predefined worker that is allocated when a job runs.
   *
   * @default differs based on specific glue version
   */
  readonly workerType?: WorkerType;

  /**
   * The number of workers of a defined {@link WorkerType} that are allocated when a job runs.
   *
   * @default differs based on specific glue version/worker type
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
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html for a list of  special parameters Used by AWS Glue
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
   * The job's executable properties.
   */
  readonly executable: JobExecutable;

  // TODO '--TempDir': 's3-path-to-directory' we should have a prop to enable setting this, and enable a bucket to be created
  // or one specified, the role should also be updated to have access to that bucket

  // TODO --enable-metrics confirm if it's needed for count/guage metrics or not and add a prop
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

    const executable = props.executable.bind(this);
    const defaultArguments = {
      ...this.executableArguments(executable),
      ...props.defaultArguments,
    };

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: executable.type.name,
        scriptLocation: executable.scriptLocation,
        pythonVersion: executable.pythonVersion,
      },
      glueVersion: executable.glueVersion.name,
      workerType: props.workerType?.name,
      numberOfWorkers: props.numberOfWorkers,
      maxCapacity: props.maxCapacity,
      maxRetries: props.maxRetries,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      notificationProperty: props.notifyDelayAfter ? { notifyDelayAfter: props.notifyDelayAfter.toMinutes() } : undefined,
      timeout: props.timeout ? props.timeout.toMinutes() : undefined,
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration ? props.securityConfiguration.securityConfigurationName : undefined,
      tags: props.tags,
      defaultArguments,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = JobBase.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }

  private executableArguments(config: JobExecutableConfig) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = config.language;
    if (config.className) {
      args['--class'] = config.className;
    }
    if (config.extraJars && config.extraJars.length > 0) {
      args['--extra-jars'] = config.extraJars.join(',');
    }
    if (config.extraPythonFiles && config.extraPythonFiles.length > 0) {
      args['--extra-py-files'] = config.extraPythonFiles.join(',');
    }
    if (config.extraFiles && config.extraFiles.length > 0) {
      args['--extra-files'] = config.extraFiles.join(',');
    }
    if (config.extraJarsFirst) {
      args['--user-jars-first'] = 'true';
    }
    return args;
  }
}
