import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import * as constructs from 'constructs';
import { Code } from '../code';
import { Job, JobProps } from './job';
import { Token } from 'aws-cdk-lib';
import { EOL } from 'os';

/**
 * Code props for different {@link Code} assets used by different types of Spark jobs.
 */
export interface SparkExtraCodeProps {
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
}

/**
 * Properties for enabling Spark UI monitoring feature for Spark-based Glue jobs.
 *
 * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
 * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
 */
export interface SparkUIProps {
  /**
   * The bucket where the Glue job stores the logs.
   *
   * @default a new bucket will be created.
   */
  readonly bucket?: s3.IBucket;

  /**
   * The path inside the bucket (objects prefix) where the Glue job stores the logs.
   * Use format `'/foo/bar'`
   *
   * @default - the logs will be written at the root of the bucket
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
 * Common properties for different types of Spark jobs.
 */
export interface SparkJobProps extends JobProps {
  /**
   * Enables the Spark UI debugging and monitoring with the specified props.
   *
   * @default - Spark UI debugging and monitoring is disabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  readonly sparkUI?: SparkUIProps;
}

/**
 * Base class for different types of Spark Jobs.
 */
export abstract class SparkJob extends Job {
  public readonly role: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The Spark UI logs location if Spark UI monitoring and debugging is enabled.
   *
   * @see https://docs.aws.amazon.com/glue/latest/dg/monitor-spark-ui-jobs.html
   * @see https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html
   */
  public readonly sparkUILoggingLocation?: SparkUILoggingLocation;

  constructor(scope: constructs.Construct, id: string, props: SparkJobProps) {
    super(scope, id, {
      physicalName: props.jobName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.role = props.role;
    this.grantPrincipal = this.role;

    this.sparkUILoggingLocation = props.sparkUI ? this.setupSparkUILoggingLocation(props.sparkUI) : undefined;
  }

  protected nonExecutableCommonArguments(props: SparkJobProps): {[key: string]: string} {
    // Enable CloudWatch metrics and continuous logging by default as a best practice
    const continuousLoggingArgs = this.setupContinuousLogging(this.role, props.continuousLogging);
    const profilingMetricsArgs = { '--enable-metrics': '' };
    const observabilityMetricsArgs = { '--enable-observability-metrics': 'true' };

    // Set spark ui args, if spark ui logging had been setup
    const sparkUIArgs = this.sparkUILoggingLocation ? ({
      '--enable-spark-ui': 'true',
      '--spark-event-logs-path': this.sparkUILoggingLocation.bucket.s3UrlForObject(this.sparkUILoggingLocation.prefix).replace(/\/?$/, '/'), // path will always end with a slash
    }): {};

    return {
      ...continuousLoggingArgs,
      ...profilingMetricsArgs,
      ...observabilityMetricsArgs,
      ...sparkUIArgs,
      ...this.checkNoReservedArgs(props.defaultArguments),
    };
  }

  /**
   * Set the arguments for extra {@link Code}-related properties
   */
  protected setupExtraCodeArguments(args: { [key: string]: string }, props: SparkExtraCodeProps) {
    if (props.extraJars && props.extraJars.length > 0) {
      args['--extra-jars'] = props.extraJars.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (props.extraJarsFirst) {
      args['--user-jars-first'] = 'true';
    }
    if (props.extraPythonFiles && props.extraPythonFiles.length > 0) {
      args['--extra-py-files'] = props.extraPythonFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
    if (props.extraFiles && props.extraFiles.length > 0) {
      args['--extra-files'] = props.extraFiles.map(code => this.codeS3ObjectUrl(code)).join(',');
    }
  }

  private setupSparkUILoggingLocation(props: SparkUIProps): SparkUILoggingLocation {
    validateSparkUiPrefix(props.prefix);
    const bucket = props.bucket ?? new s3.Bucket(this, 'SparkUIBucket', { enforceSSL: true, encryption: s3.BucketEncryption.S3_MANAGED });
    bucket.grantReadWrite(this, cleanSparkUiPrefixForGrant(props.prefix));
    return {
      prefix: props.prefix,
      bucket,
    };
  }
}

function validateSparkUiPrefix(prefix?: string): void {
  if (!prefix || Token.isUnresolved(prefix)) {
    // skip validation if prefix is not specified or is a token
    return;
  }

  const errors: string[] = [];

  if (!prefix.startsWith('/')) {
    errors.push('Prefix must begin with \'/\'');
  }

  if (prefix.endsWith('/')) {
    errors.push('Prefix must not end with \'/\'');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid prefix format (value: ${prefix})${EOL}${errors.join(EOL)}`);
  }
}

function cleanSparkUiPrefixForGrant(prefix?: string): string | undefined {
  return prefix !== undefined ? prefix.slice(1) + '/*' : undefined;
}
