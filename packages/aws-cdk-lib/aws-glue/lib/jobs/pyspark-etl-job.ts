import type { Construct } from 'constructs';
import type * as cdk from '../../../core';
import { Annotations } from '../../../core';
import { lit, memoizedGetter } from '../../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import type { Code } from '../code';
import { JobType, GlueVersion, JobLanguage, PythonVersion, WorkerType } from '../constants';
import type { SparkJobProps } from './spark-job';
import { SparkJob } from './spark-job';
import { CfnJob } from '../glue.generated';

/**
 * Properties for creating a Python Spark ETL job
 */
export interface PySparkEtlJobProps extends SparkJobProps {
  /**
   * Specifies configuration properties of a notification (optional).
   * After a job run starts, the number of minutes to wait before sending a job run delay notification.
   * @default - undefined
   */
  readonly notifyDelayAfter?: cdk.Duration;

  /**
   * Extra Python Files S3 URL (optional)
   * S3 URL where additional python dependencies are located
   *
   * @default - no extra files
   */
  readonly extraPythonFiles?: Code[];

  /**
   * Additional files, such as configuration files that AWS Glue copies to the working directory of your script before executing it.
   *
   * @default - no extra files specified.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraFiles?: Code[];

  /**
   * Extra Jars S3 URL (optional)
   * S3 URL where additional jar dependencies are located
   * @default - no extra jar files
   */
  readonly extraJars?: Code[];

  /**
   * Setting this value to true prioritizes the customer's extra JAR files in the classpath.
   *
   * @default false - priority is not given to user-provided jars
   *
   * @see `--user-jars-first` in https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly extraJarsFirst?: boolean;

  /**
   * Specifies whether job run queuing is enabled for the job runs for this job.
   * A value of true means job run queuing is enabled for the job runs.
   * If false or not populated, the job runs will not be considered for queueing.
   * If this field does not match the value set in the job run, then the value from
   * the job run field will be used. This property must be set to false for flex jobs.
   * If this property is enabled, maxRetries must be set to zero.
   *
   * @default false
   */
  readonly jobRunQueuingEnabled?: boolean;
}

/**
 * PySpark ETL Jobs class
 *
 * ETL jobs support pySpark and Scala languages, for which there are separate
 * but similar constructors. ETL jobs default to the `G_1X` worker type, but you
 * can override this default with any other supported `WorkerType`
 * (e.g. `G_2X`, `G_4X`, `G_8X`). ETL jobs default to Glue version 4.0, which you
 * can override to any supported `GlueVersion` (e.g. 3.0, 5.0, 5.1). The following ETL features are enabled by default:
 * --enable-metrics, --enable-continuous-cloudwatch-log. The Spark UI
 * (--enable-spark-ui) is off by default; enable it by setting the `sparkUI` prop.
 * You can find more details about version, worker type and other features
 * in Glue's public documentation.
 */
@propertyInjectable
export class PySparkEtlJob extends SparkJob {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.PySparkEtlJob';
  private resource: CfnJob;

  /**
   * PySparkEtlJob constructor
   */
  constructor(scope: Construct, id: string, props: PySparkEtlJobProps) {
    super(scope, id, props);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Register the construct-managed arguments, then merge in the user's escape-hatch arguments.
    this.executableArguments(props);
    this.nonExecutableCommonArguments(props);
    const defaultArguments = this.mergeDefaultArguments(props.defaultArguments);

    if (props.jobRunQueuingEnabled === true && props.maxRetries !== undefined && props.maxRetries > 0) {
      Annotations.of(this).addWarningV2(lit`GlueMaxRetriesQueuingEnabled`,
        `maxRetries was set to ${props.maxRetries}. Overriding it to 0 with since job run queuing is enabled (service constraint)`);
    }

    this.resource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: JobType.ETL,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        pythonVersion: PythonVersion.THREE,
      },
      glueVersion: props.glueVersion ?? GlueVersion.V4_0,
      workerType: props.workerConfiguration?.workerType ?? WorkerType.G_1X,
      numberOfWorkers: props.workerConfiguration?.numberOfWorkers ?? 10,
      maxRetries: props.jobRunQueuingEnabled ? 0 : props.maxRetries,
      jobRunQueuingEnabled: props.jobRunQueuingEnabled ? props.jobRunQueuingEnabled : false,
      notificationProperty: props.notifyDelayAfter ? { notifyDelayAfter: props.notifyDelayAfter.toMinutes() } : undefined,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      timeout: props.timeout?.toMinutes(),
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration?.securityConfigurationName,
      tags: props.tags,
      defaultArguments,
    });
  }

  @memoizedGetter
  public get jobArn(): string {
    return this.buildJobArn(this, this.jobName);
  }

  @memoizedGetter
  public get jobName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  /**
   * Register the executable arguments with best practices enabled by default.
   */
  private executableArguments(props: PySparkEtlJobProps): void {
    this.setManagedArgument('--job-language', JobLanguage.PYTHON);
    this.setupExtraCodeArguments(props);
  }
}
