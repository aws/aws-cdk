import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { CfnJob } from 'aws-cdk-lib/aws-glue';
import { Job, JobProperties } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, JobLanguage, WorkerType } from '../constants';
import { SparkUIProps, SparkUILoggingLocation, validateSparkUiPrefix, cleanSparkUiPrefixForGrant } from './spark-ui-utils';
import { Code } from '../code';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Properties for creating a Scala Spark ETL job
 */
export interface ScalaSparkEtlJobProps extends JobProperties {
  /**
   * Enables the Spark UI debugging and monitoring with the specified props.
   *
   * @default - Spark UI debugging and monitoring is disabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly sparkUI?: SparkUIProps;

  /**
   * Class name (required for Scala scripts)
   * Package and class name for the entry point of Glue job execution for
   * Java scripts
   **/
  readonly className: string;

  /**
   * Extra Jars S3 URL (optional)
   * S3 URL where additional jar dependencies are located
   * @default - no extra jar files
   */
  readonly extraJars?: Code[];

  /**
   * Specifies whether job run queuing is enabled for the job runs for this job.
   * A value of true means job run queuing is enabled for the job runs.
   * If false or not populated, the job runs will not be considered for queueing.
   * If this field does not match the value set in the job run, then the value from
   * the job run field will be used. This property must be set to false for flex jobs.
   * If this property is enabled, maxRetries must be set to zero.
   *
   * @default - no job run queuing
   */
  readonly jobRunQueuingEnabled?: boolean;
}

/**
 * Spark ETL Jobs class
 *
 * ETL jobs support pySpark and Scala languages, for which there are separate
 * but similar constructors. ETL jobs default to the G2 worker type, but you
 * can override this default with other supported worker type values
 * (G1, G2, G4 and G8). ETL jobs defaults to Glue version 4.0, which you can
 * override to 3.0. The following ETL features are enabled by default:
 * —enable-metrics, —enable-spark-ui, —enable-continuous-cloudwatch-log.
 * You can find more details about version, worker type and other features
 * in Glue's public documentation.
 */
export class ScalaSparkEtlJob extends Job {
  public readonly jobArn: string;
  public readonly jobName: string;
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The Spark UI logs location if Spark UI monitoring and debugging is enabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  public readonly sparkUILoggingLocation?: SparkUILoggingLocation;

  /**
   * ScalaSparkEtlJob constructor
   */
  constructor(scope: Construct, id: string, props: ScalaSparkEtlJobProps) {
    super(scope, id, {
      physicalName: props.jobName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Set up role and permissions for principal
    this.role = props.role, {
      assumedBy: new iam.ServicePrincipal('glue.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')],
    };
    this.grantPrincipal = this.role;

    // Enable SparkUI by default as a best practice
    const sparkUIArgs = props.sparkUI?.bucket ? this.setupSparkUI(this.role, props.sparkUI) : undefined;
    this.sparkUILoggingLocation = sparkUIArgs?.location;

    // Enable CloudWatch metrics and continuous logging by default as a best practice
    const continuousLoggingArgs = this.setupContinuousLogging(this.role, props.continuousLogging);
    const profilingMetricsArgs = { '--enable-metrics': '' };
    const observabilityMetricsArgs = { '--enable-observability-metrics': 'true' };

    // Gather executable arguments
    const execuatbleArgs = this.executableArguments(props);

    // Mandatory className argument
    if (props.className === undefined) {
      throw new Error('className must be set for Scala ETL Jobs');
    }

    // Conbine command line arguments into a single line item
    const defaultArguments = {
      ...execuatbleArgs,
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...observabilityMetricsArgs,
      ...sparkUIArgs?.args,
      ...this.checkNoReservedArgs(props.defaultArguments),
    };

    if ((!props.workerType && props.numberOfWorkers !== undefined) || (props.workerType && props.numberOfWorkers === undefined)) {
      throw new Error('Both workerType and numberOfWorkers must be set');
    }

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: JobType.ETL,
        scriptLocation: this.codeS3ObjectUrl(props.script),
      },
      glueVersion: props.glueVersion ? props.glueVersion : GlueVersion.V4_0,
      workerType: props.workerType ? props.workerType : WorkerType.G_1X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers : 10,
      maxRetries: props.jobRunQueuingEnabled ? 0 : props.maxRetries,
      jobRunQueuingEnabled: props.jobRunQueuingEnabled ? props.jobRunQueuingEnabled : false,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      timeout: props.timeout?.toMinutes(),
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration?.securityConfigurationName,
      tags: props.tags,
      defaultArguments,
    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = this.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }

  /**
   * Set the executable arguments with best practices enabled by default
   *
   * @returns An array of arguments for Glue to use on execution
   */
  private executableArguments(props: ScalaSparkEtlJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.SCALA;
    args['--class'] = props.className!;

    if (props.extraJars && props.extraJars?.length > 0) {
      args['--extra-jars'] = props.extraJars.map(code => this.codeS3ObjectUrl(code)).join(',');
    }

    return args;
  }

  private setupSparkUI(role: iam.IRole, sparkUiProps: SparkUIProps) {
    validateSparkUiPrefix(sparkUiProps.prefix);
    const bucket = sparkUiProps.bucket ?? new Bucket(this, 'SparkUIBucket', { enforceSSL: true, encryption: BucketEncryption.S3_MANAGED });
    bucket.grantReadWrite(role, cleanSparkUiPrefixForGrant(sparkUiProps.prefix));
    const args = {
      '--enable-spark-ui': 'true',
      '--spark-event-logs-path': bucket.s3UrlForObject(sparkUiProps.prefix).replace(/\/?$/, '/'), // path will always end with a slash
    };

    return {
      location: {
        prefix: sparkUiProps.prefix,
        bucket,
      },
      args,
    };
  }
}
