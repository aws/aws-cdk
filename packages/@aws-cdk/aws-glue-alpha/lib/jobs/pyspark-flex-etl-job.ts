import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { CfnJob } from 'aws-cdk-lib/aws-glue';
import { Job, JobProperties } from './job';
import { Construct } from 'constructs';
import { JobType, GlueVersion, JobLanguage, PythonVersion, WorkerType, ExecutionClass } from '../constants';
import { SparkUIProps, SparkUILoggingLocation, validateSparkUiPrefix, cleanSparkUiPrefixForGrant } from './spark-ui-utils';
import * as cdk from 'aws-cdk-lib/core';
import { Code } from '../code';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Properties for PySparkFlexEtlJob
 */
export interface PySparkFlexEtlJobProps extends JobProperties {
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
   * Specifies configuration properties of a notification (optional).
   * After a job run starts, the number of minutes to wait before sending a job run delay notification.
   * @default - undefined
   */
  readonly notifyDelayAfter?: cdk.Duration;

  /**
   * Additional Python files that AWS Glue adds to the Python path before executing your script.
   *
   * @default - no extra python files specified.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
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

}

/**
 * Flex Jobs class
 *
 * Flex jobs supports Python and Scala language.
 * The flexible execution class is appropriate for non-urgent jobs such as
 * pre-production jobs, testing, and one-time data loads.
 * Flexible job runs are supported for jobs using AWS Glue version 3.0 or later and G.1X or
 * G.2X worker types but will default to the latest version of Glue (currently Glue 3.0.)
 *
 * Similar to ETL, we’ll enable these features: —enable-metrics, —enable-spark-ui,
 * —enable-continuous-cloudwatch-log
 */
export class PySparkFlexEtlJob extends Job {
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
   * PySparkFlexEtlJob constructor
   */
  constructor(scope: Construct, id: string, props: PySparkFlexEtlJobProps) {
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

    // Conbine command line arguments into a single line item
    const defaultArguments = {
      ...execuatbleArgs,
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...observabilityMetricsArgs,
      ...sparkUIArgs?.args,
      ...this.checkNoReservedArgs(props.defaultArguments),
    };

    const jobResource = new CfnJob(this, 'Resource', {
      name: props.jobName,
      description: props.description,
      role: this.role.roleArn,
      command: {
        name: JobType.ETL,
        scriptLocation: this.codeS3ObjectUrl(props.script),
        pythonVersion: PythonVersion.THREE,
      },
      glueVersion: props.glueVersion ? props.glueVersion : GlueVersion.V3_0,
      workerType: props.workerType ? props.workerType : WorkerType.G_1X,
      numberOfWorkers: props.numberOfWorkers ? props.numberOfWorkers : 10,
      maxRetries: props.maxRetries,
      executionProperty: props.maxConcurrentRuns ? { maxConcurrentRuns: props.maxConcurrentRuns } : undefined,
      notificationProperty: props.notifyDelayAfter ? { notifyDelayAfter: props.notifyDelayAfter.toMinutes() } : undefined,
      timeout: props.timeout?.toMinutes(),
      connections: props.connections ? { connections: props.connections.map((connection) => connection.connectionName) } : undefined,
      securityConfiguration: props.securityConfiguration?.securityConfigurationName,
      tags: props.tags,
      executionClass: ExecutionClass.FLEX,
      jobRunQueuingEnabled: false,
      defaultArguments,

    });

    const resourceName = this.getResourceNameAttribute(jobResource.ref);
    this.jobArn = this.buildJobArn(this, resourceName);
    this.jobName = resourceName;
  }

  /**
   *Set the executable arguments with best practices enabled by default
   *
   * @returns An array of arguments for Glue to use on execution
   */
  private executableArguments(props: PySparkFlexEtlJobProps) {
    const args: { [key: string]: string } = {};
    args['--job-language'] = JobLanguage.PYTHON;

    if (props.extraPythonFiles && props.extraPythonFiles.length > 0) {
      args['--extra-py-files'] = props.extraPythonFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (props.extraFiles && props.extraFiles.length > 0) {
      args['--extra-files'] = props.extraFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (props.extraJars && props.extraJars?.length > 0) {
      args['--extra-jars'] = props.extraJars.map(code => this.codeS3ObjectUrl(code)).join(',');
    }

    return args;
  }

  /**
   * Set the arguments for sparkUI with best practices enabled by default
   *
   * @returns An array of arguments for enabling sparkUI
   */

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
