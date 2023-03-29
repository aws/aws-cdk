import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { CfnApplicationCloudWatchLoggingOptionV2, CfnApplicationV2 } from '@aws-cdk/aws-kinesisanalytics';
import * as logs from '@aws-cdk/aws-logs';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ApplicationCode } from './application-code';
import { environmentProperties } from './private/environment-properties';
import { flinkApplicationConfiguration } from './private/flink-application-configuration';
import { validateFlinkApplicationProps as validateApplicationProps } from './private/validation';
import { LogLevel, MetricsLevel, Runtime } from './types';

/**
 * An interface expressing the public properties on both an imported and
 * CDK-created Flink application.
 */
export interface IApplication extends core.IResource, ec2.IConnectable, iam.IGrantable {
  /**
   * The application ARN.
   *
   * @attribute
   */
  readonly applicationArn: string;

  /**
   * The name of the Flink application.
   *
   * @attribute
   */
  readonly applicationName: string;

  /**
   * The application IAM role.
   */
  readonly role?: iam.IRole;

  /**
   * Convenience method for adding a policy statement to the application role.
   */
  addToRolePolicy(policyStatement: iam.PolicyStatement): boolean;

  /**
   * Return a CloudWatch metric associated with this Flink application.
   *
   * @param metricName The name of the metric
   * @param props Customization properties
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of Kinesis Processing Units that are used to run your stream
   * processing application. The average number of KPUs used each hour
   * determines the billing for your application.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricKpus(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time elapsed during an outage for failing/recovering jobs.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricDowntime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time that the job has been running without interruption.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - sample count over 5 minutes
   */
  metricUptime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of times this job has fully restarted since it was
   * submitted. This metric does not measure fine-grained restarts.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricFullRestarts(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of times checkpointing has failed.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricNumberOfFailedCheckpoints(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time it took to complete the last checkpoint.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - maximum over 5 minutes
   */
  metricLastCheckpointDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total size of the last checkpoint.
   *
   * Units: Bytes
   *
   * Reporting Level: Application
   *
   * @default - maximum over 5 minutes
   */
  metricLastCheckpointSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The overall percentage of CPU utilization across task managers. For
   * example, if there are five task managers, Kinesis Data Analytics publishes
   * five samples of this metric per reporting interval.
   *
   * Units: Percentage
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricCpuUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Overall heap memory utilization across task managers. For example, if there
   * are five task managers, Kinesis Data Analytics publishes five samples of
   * this metric per reporting interval.
   *
   * Units: Percentage
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricHeapMemoryUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total time spent performing old garbage collection operations.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricOldGenerationGCTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of old garbage collection operations that have occurred
   * across all task managers.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricOldGenerationGCCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
	 * The total number of live threads used by the application.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricThreadsCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of records this application, operator, or task has
   * received.
   *
   * Units: Count
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsIn(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of records this application, operator or task has
   * received per second.
   *
   * Units: Count/Second
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsInPerSecond(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of records this application, operator or task has emitted.
   *
   * Units: Count
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total number of records this application, operator or task has emitted
   * per second.
   *
   * Units: Count/Second
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsOutPerSecond(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The number of records this operator or task has dropped due to arriving late.
   *
   * Units: Count
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - sum over 5 minutes
   */
  metricNumLateRecordsDropped(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The last watermark this application/operator/task/thread has received.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - maximum over 5 minutes
   */
  metricCurrentInputWatermark(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The last watermark this application/operator/task/thread has received.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - maximum over 5 minutes
   */
  metricCurrentOutputWatermark(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The amount of managed memory currently used.
   *
   * Units: Bytes
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricManagedMemoryUsed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The total amount of managed memory.
   *
   * Units: Bytes
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricManagedMemoryTotal(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Derived from managedMemoryUsed/managedMemoryTotal.
   *
   * Units: Percentage
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricManagedMemoryUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time (in milliseconds) this task or operator is idle (has no data to
   * process) per second. Idle time excludes back pressured time, so if the task
   * is back pressured it is not idle.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricIdleTimeMsPerSecond(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time (in milliseconds) this task or operator is back pressured per
   * second.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricBackPressuredTimeMsPerSecond(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * The time (in milliseconds) this task or operator is busy (neither idle nor
   * back pressured) per second. Can be NaN, if the value could not be
   * calculated.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricBusyTimePerMsPerSecond(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * Implements the functionality shared between CDK created and imported
 * IApplications.
 */
abstract class ApplicationBase extends core.Resource implements IApplication {
  public abstract readonly applicationArn: string;
  public abstract readonly applicationName: string;
  public abstract readonly role?: iam.IRole;

  // Implement iam.IGrantable interface
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * The underlying connections object for the connections getter.
   *
   * @internal
   */
  protected _connections?: ec2.Connections;

  /** Implement the convenience `IApplication.addToPrincipalPolicy` method. */
  public addToRolePolicy(policyStatement: iam.PolicyStatement): boolean {
    if (this.role) {
      this.role.addToPrincipalPolicy(policyStatement);
      return true;
    }

    return false;
  }

  public get connections() {
    if (!this._connections) {
      throw new Error('This Application isn\'t associated with a VPC. Provide a "vpc" prop when creating the Application or "securityGroups" when importing it.');
    }
    return this._connections;
  }

  /**
   * Return a CloudWatch metric associated with this Flink application.
   *
   * @param metricName The name of the metric
   * @param props Customization properties
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions) {
    return new cloudwatch.Metric({
      namespace: 'AWS/KinesisAnalytics',
      metricName,
      dimensionsMap: { Application: this.applicationName },
      ...props,
    }).attachTo(this);
  }

  /**
   * The number of Kinesis Processing Units that are used to run your stream
   * processing application. The average number of KPUs used each hour
   * determines the billing for your application.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricKpus(props?: cloudwatch.MetricOptions) {
    return this.metric('KPUs', { statistic: 'Average', ...props });
  }


  /**
   * The time elapsed during an outage for failing/recovering jobs.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricDowntime(props?: cloudwatch.MetricOptions) {
    return this.metric('downtime', { statistic: 'Average', ...props });
  }

  /**
   * The time that the job has been running without interruption.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricUptime(props?: cloudwatch.MetricOptions) {
    return this.metric('uptime', { statistic: 'Average', ...props });
  }

  /**
   * The total number of times this job has fully restarted since it was
   * submitted. This metric does not measure fine-grained restarts.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricFullRestarts(props?: cloudwatch.MetricOptions) {
    return this.metric('fullRestarts', { statistic: 'Sum', ...props });
  }

  /**
   * The number of times checkpointing has failed.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricNumberOfFailedCheckpoints(props?: cloudwatch.MetricOptions) {
    return this.metric('numberOfFailedCheckpoints', { statistic: 'Sum', ...props });
  }

  /**
   * The time it took to complete the last checkpoint.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - maximum over 5 minutes
   */
  metricLastCheckpointDuration(props?: cloudwatch.MetricOptions) {
    return this.metric('lastCheckpointDuration', { statistic: 'Maximum', ...props });
  }

  /**
   * The total size of the last checkpoint.
   *
   * Units: Bytes
   *
   * Reporting Level: Application
   *
   * @default - maximum over 5 minutes
   */
  metricLastCheckpointSize(props?: cloudwatch.MetricOptions) {
    return this.metric('lastCheckpointSize', { statistic: 'Maximum', ...props });
  }

  /**
   * The overall percentage of CPU utilization across task managers. For
   * example, if there are five task managers, Kinesis Data Analytics publishes
   * five samples of this metric per reporting interval.
   *
   * Units: Percentage
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricCpuUtilization(props?: cloudwatch.MetricOptions) {
    return this.metric('cpuUtilization', { statistic: 'Average', ...props });
  }

  /**
   * Overall heap memory utilization across task managers. For example, if there
   * are five task managers, Kinesis Data Analytics publishes five samples of
   * this metric per reporting interval.
   *
   * Units: Percentage
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricHeapMemoryUtilization(props?: cloudwatch.MetricOptions) {
    return this.metric('heapMemoryUtilization', { statistic: 'Average', ...props });
  }

  /**
   * The total time spent performing old garbage collection operations.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricOldGenerationGCTime(props?: cloudwatch.MetricOptions) {
    return this.metric('oldGenerationGCTime', { statistic: 'Sum', ...props });
  }

  /**
   * The total number of old garbage collection operations that have occurred
   * across all task managers.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - sum over 5 minutes
   */
  metricOldGenerationGCCount(props?: cloudwatch.MetricOptions) {
    return this.metric('oldGenerationGCCount', { statistic: 'Sum', ...props });
  }

  /**
   * The total number of live threads used by the application.
   *
   * Units: Count
   *
   * Reporting Level: Application
   *
   * @default - average over 5 minutes
   */
  metricThreadsCount(props?: cloudwatch.MetricOptions) {
    return this.metric('threadsCount', { statistic: 'Average', ...props });
  }

  /**
   * The total number of records this application, operator, or task has
   * received.
   *
   * Units: Count
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsIn(props?: cloudwatch.MetricOptions) {
    return this.metric('numRecordsIn', { statistic: 'Average', ...props });
  }

  /**
   * The total number of records this application, operator or task has received
   * per second.
   *
   * Units: Count/Second
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsInPerSecond(props?: cloudwatch.MetricOptions) {
    return this.metric('numRecordsInPerSecond', { statistic: 'Average', ...props });
  }

  /**
   * The total number of records this application, operator or task has emitted.
   *
   * Units: Count
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsOut(props?: cloudwatch.MetricOptions) {
    return this.metric('numRecordsOut', { statistic: 'Average', ...props });
  }

  /**
   * The total number of records this application, operator or task has emitted
   * per second.
   *
   * Units: Count/Second
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricNumRecordsOutPerSecond(props?: cloudwatch.MetricOptions) {
    return this.metric('numRecordsOutPerSecond', { statistic: 'Average', ...props });
  }

  /**
   * The number of records this operator or task has dropped due to arriving
   * late.
   *
   * Units: Count
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - sum over 5 minutes
   */
  metricNumLateRecordsDropped(props?: cloudwatch.MetricOptions) {
    return this.metric('numLateRecordsDropped', { statistic: 'Sum', ...props });
  }

  /**
   * The last watermark this application/operator/task/thread has received.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - maximum over 5 minutes
   */
  metricCurrentInputWatermark(props?: cloudwatch.MetricOptions) {
    return this.metric('currentInputWatermark', { statistic: 'Maximum', ...props });
  }

  /**
   * The last watermark this application/operator/task/thread has received.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - maximum over 5 minutes
   */
  metricCurrentOutputWatermark(props?: cloudwatch.MetricOptions) {
    return this.metric('currentOutputWatermark', { statistic: 'Maximum', ...props });
  }

  /**
   * The amount of managed memory currently used.
   *
   * Units: Bytes
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricManagedMemoryUsed(props?: cloudwatch.MetricOptions) {
    return this.metric('managedMemoryUsed', { statistic: 'Average', ...props });
  }

  /**
   * The total amount of managed memory.
   *
   * Units: Bytes
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricManagedMemoryTotal(props?: cloudwatch.MetricOptions) {
    return this.metric('managedMemoryTotal', { statistic: 'Average', ...props });
  }

  /**
   * Derived from managedMemoryUsed/managedMemoryTotal.
   *
   * Units: Percentage
   *
   * Reporting Level: Application, Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricManagedMemoryUtilization(props?: cloudwatch.MetricOptions) {
    return this.metric('managedMemoryUtilization', { statistic: 'Average', ...props });
  }

  /**
   * The time (in milliseconds) this task or operator is idle (has no data to
   * process) per second. Idle time excludes back pressured time, so if the task
   * is back pressured it is not idle.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricIdleTimeMsPerSecond(props?: cloudwatch.MetricOptions) {
    return this.metric('idleTimeMsPerSecond', { statistic: 'Average', ...props });
  }

  /**
   * The time (in milliseconds) this task or operator is back pressured per
   * second.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricBackPressuredTimeMsPerSecond(props?: cloudwatch.MetricOptions) {
    return this.metric('backPressuredTimeMsPerSecond', { statistic: 'Average', ...props });
  }

  /**
   * The time (in milliseconds) this task or operator is busy (neither idle nor
   * back pressured) per second. Can be NaN, if the value could not be
   * calculated.
   *
   * Units: Milliseconds
   *
   * Reporting Level: Operator, Task, Parallelism
   *
   * @default - average over 5 minutes
   */
  metricBusyTimePerMsPerSecond(props?: cloudwatch.MetricOptions) {
    return this.metric('busyTimePerMsPerSecond', { statistic: 'Average', ...props });
  }
}

/**
 * Attributes used for importing an Application with Application.fromApplicationAttributes.
 */
export interface ApplicationAttributes {
  /**
   * The ARN of the Flink application.
   *
   * Format: arn:<partition>:kinesisanalytics:<region>:<account-id>:application/<application-name>
   */
  readonly applicationArn: string;

  /**
   * The security groups for this Flink application if deployed in a VPC.
   *
   * @default - no security groups
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * Props for creating an Application construct.
 */
export interface ApplicationProps {
  /**
   * A name for your Application that is unique to an AWS account.
   *
   * @default - CloudFormation-generated name
   */
  readonly applicationName?: string;

  /**
   * The Flink version to use for this application.
   */
  readonly runtime: Runtime;

  /**
   * The Flink code asset to run.
   */
  readonly code: ApplicationCode;

  /**
   * Whether checkpointing is enabled while your application runs.
   *
   * @default true
   */
  readonly checkpointingEnabled?: boolean;

  /**
   * The interval between checkpoints.
   *
   * @default - 1 minute
   */
  readonly checkpointInterval?: core.Duration;

  /**
   * The minimum amount of time in to wait after a checkpoint finishes to start
   * a new checkpoint.
   *
   * @default - 5 seconds
   */
  readonly minPauseBetweenCheckpoints?: core.Duration;

  /**
   * The level of log verbosity from the Flink application.
   *
   * @default FlinkLogLevel.INFO
   */
  readonly logLevel?: LogLevel;

  /**
   * Describes the granularity of the CloudWatch metrics for an application.
   * Use caution with Parallelism level metrics. Parallelism granularity logs
   * metrics for each parallel thread and can quickly become expensive when
   * parallelism is high (e.g. > 64).
   *
   * @default MetricsLevel.APPLICATION
   */
  readonly metricsLevel?: MetricsLevel;

  /**
   * Whether the Kinesis Data Analytics service can increase the parallelism of
   * the application in response to resource usage.
   *
   * @default true
   */
  readonly autoScalingEnabled?: boolean;

  /**
   * The initial parallelism for the application. Kinesis Data Analytics can
   * stop the app, increase the parallelism, and start the app again if
   * autoScalingEnabled is true (the default value).
   *
   * @default 1
   */
  readonly parallelism?: number;

  /**
   * The Flink parallelism allowed per Kinesis Processing Unit (KPU).
   *
   * @default 1
   */
  readonly parallelismPerKpu?: number

  /**
   * Determines if Flink snapshots are enabled.
   *
   * @default true
   */
  readonly snapshotsEnabled?: boolean;

  /**
   * Configuration PropertyGroups. You can use these property groups to pass
   * arbitrary runtime configuration values to your Flink app.
   *
   * @default - No property group configuration provided to the Flink app
   */
  readonly propertyGroups?: { readonly [propertyId: string]: { [mapKey: string]: string } };

  /**
   * A role to use to grant permissions to your application. Prefer omitting
   * this property and using the default role.
   *
   * @default - a new Role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Provide a RemovalPolicy to override the default.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: core.RemovalPolicy;

  /**
   * The log group to send log entries to.
   *
   * @default - CDK's default LogGroup
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * Deploy the Flink application in a VPC.
   *
   * @default - no VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Choose which VPC subnets to use.
   *
   * @default - SubnetType.PRIVATE_WITH_EGRESS subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security groups to use with a provided VPC.
   *
   * @default - a new security group is created for this application.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * An imported Flink application.
 */
class Import extends ApplicationBase {
  public readonly grantPrincipal: iam.IPrincipal;
  public readonly role?: iam.IRole;
  public readonly applicationName: string;
  public readonly applicationArn: string;

  constructor(scope: Construct, id: string, attrs: { applicationArn: string, securityGroups?: ec2.ISecurityGroup[] }) {
    super(scope, id);

    // Imported applications have no associated role or grantPrincipal
    this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
    this.role = undefined;

    this.applicationArn = attrs.applicationArn;
    const applicationName = core.Stack.of(scope).splitArn(attrs.applicationArn, core.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (!applicationName) {
      throw new Error(`applicationArn for fromApplicationArn (${attrs.applicationArn}) must include resource name`);
    }
    this.applicationName = applicationName;

    const securityGroups = attrs.securityGroups ?? [];
    if (securityGroups.length > 0) {
      this._connections = new ec2.Connections({ securityGroups });
    }
  }
}

/**
 * The L2 construct for Flink Kinesis Data Applications.
 *
 * @resource AWS::KinesisAnalyticsV2::Application
 *
 */
export class Application extends ApplicationBase {
  /**
   * Import an existing Flink application defined outside of CDK code by
   * applicationName.
   */
  public static fromApplicationName(scope: Construct, id: string, applicationName: string): IApplication {
    const applicationArn = core.Stack.of(scope).formatArn(applicationArnComponents(applicationName));

    return new Import(scope, id, { applicationArn });
  }

  /**
   * Import an existing application defined outside of CDK code by
   * applicationArn.
   */
  public static fromApplicationArn(scope: Construct, id: string, applicationArn: string): IApplication {
    return new Import(scope, id, { applicationArn });
  }

  /**
   * Import an existing application defined outside of CDK code.
   */
  public static fromApplicationAttributes(scope: Construct, id: string, attrs: ApplicationAttributes): IApplication {
    return new Import(scope, id, {
      applicationArn: attrs.applicationArn,
      securityGroups: attrs.securityGroups,
    });
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

  // Role must be optional for JSII compatibility
  public readonly role?: iam.IRole;

  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, { physicalName: props.applicationName });
    validateApplicationProps(props);

    this.role = props.role ?? new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('kinesisanalytics.amazonaws.com'),
    });
    this.grantPrincipal = this.role;

    // Permit metric publishing to CloudWatch
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['cloudwatch:PutMetricData'],
      resources: ['*'],
    }));

    const code = props.code.bind(this);
    code.bucket.grantRead(this);

    let vpcConfigurations;
    if (props.vpc) {
      const securityGroups = props.securityGroups ?? [
        new ec2.SecurityGroup(this, 'SecurityGroup', {
          vpc: props.vpc,
        }),
      ];
      this._connections = new ec2.Connections({ securityGroups });
      const subnetSelection = props.vpcSubnets ?? {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      };
      vpcConfigurations = [{
        securityGroupIds: securityGroups.map(sg => sg.securityGroupId),
        subnetIds: props.vpc.selectSubnets(subnetSelection).subnetIds,
      }];
    }

    const resource = new CfnApplicationV2(this, 'Resource', {
      applicationName: props.applicationName,
      runtimeEnvironment: props.runtime.value,
      serviceExecutionRole: this.role.roleArn,
      applicationConfiguration: {
        ...code.applicationCodeConfigurationProperty,
        environmentProperties: environmentProperties(props.propertyGroups),
        flinkApplicationConfiguration: flinkApplicationConfiguration({
          checkpointingEnabled: props.checkpointingEnabled,
          checkpointInterval: props.checkpointInterval,
          minPauseBetweenCheckpoints: props.minPauseBetweenCheckpoints,
          logLevel: props.logLevel,
          metricsLevel: props.metricsLevel,
          autoScalingEnabled: props.autoScalingEnabled,
          parallelism: props.parallelism,
          parallelismPerKpu: props.parallelismPerKpu,
        }),
        applicationSnapshotConfiguration: {
          snapshotsEnabled: props.snapshotsEnabled ?? true,
        },
        vpcConfigurations,
      },
    });
    resource.node.addDependency(this.role);

    const logGroup = props.logGroup ?? new logs.LogGroup(this, 'LogGroup');
    const logStream = new logs.LogStream(this, 'LogStream', { logGroup });

    /* Permit logging */

    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:DescribeLogGroups'],
      resources: [
        core.Stack.of(this).formatArn({
          service: 'logs',
          resource: 'log-group',
          arnFormat: core.ArnFormat.COLON_RESOURCE_NAME,
          resourceName: '*',
        }),
      ],
    }));

    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:DescribeLogStreams'],
      resources: [logGroup.logGroupArn],
    }));

    const logStreamArn = `arn:${core.Aws.PARTITION}:logs:${core.Aws.REGION}:${core.Aws.ACCOUNT_ID}:log-group:${logGroup.logGroupName}:log-stream:${logStream.logStreamName}`;
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:PutLogEvents'],
      resources: [logStreamArn],
    }));

    new CfnApplicationCloudWatchLoggingOptionV2(this, 'LoggingOption', {
      applicationName: resource.ref,
      cloudWatchLoggingOption: {
        logStreamArn,
      },
    });

    // Permissions required for VPC usage per:
    // https://docs.aws.amazon.com/kinesisanalytics/latest/java/vpc-permissions.html
    if (props.vpc) {
      this.role.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: [
          'ec2:DescribeVpcs',
          'ec2:DescribeSubnets',
          'ec2:DescribeSecurityGroups',
          'ec2:DescribeDhcpOptions',
          'ec2:CreateNetworkInterface',
          'ec2:CreateNetworkInterfacePermission',
          'ec2:DescribeNetworkInterfaces',
          'ec2:DeleteNetworkInterface',
        ],
        resources: ['*'],
      }));
    }

    this.applicationName = this.getResourceNameAttribute(resource.ref);
    this.applicationArn = this.getResourceArnAttribute(
      core.Stack.of(this).formatArn(applicationArnComponents(resource.ref)),
      applicationArnComponents(this.physicalName),
    );

    resource.applyRemovalPolicy(props.removalPolicy, {
      default: core.RemovalPolicy.DESTROY,
    });
  }
}

function applicationArnComponents(resourceName: string): core.ArnComponents {
  return {
    service: 'kinesisanalytics',
    resource: 'application',
    resourceName,
  };
}
