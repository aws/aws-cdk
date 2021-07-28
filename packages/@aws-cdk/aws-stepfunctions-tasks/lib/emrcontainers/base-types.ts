import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';

/**
 * The information about job driver for Spark submit.
 */
export interface SparkSubmitJobDriver {

  /**
   * The entry point of job application.
   * Length Constraints: Minimum length of 1. Maximum length of 256.
   *
   * @default - No entry point
   */
  readonly entryPoint: sfn.TaskInput;

  /**
   * The arguments for job application.
   * Length Constraints: Minimum length of 1. Maximum length of 10280.
   *
   * @default - No arguments defined
   */
  readonly entryPointArguments?: sfn.TaskInput;

  /**
   * The Spark submit parameters that are used for job runs.
   * Length Constraints: Minimum length of 1. Maximum length of 102400.
   *
   * @default - No spark submit parameters
   */
  readonly sparkSubmitParameters?: string;
}

/**
 * Specify the driver that the job runs on.
 */
export interface JobDriver {

  /**
   * The job driver parameters specified for spark submit.
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_SparkSubmitJobDriver.html
   *
   * @default - No job driver parameters specified.
   */
  readonly sparkSubmitJobDriver?: SparkSubmitJobDriver;
}

/**
 * The classification within a EMR Containers application configuration.
 */
export class Classification {

  /**
   * Sets the maximizeResourceAllocation property to true or false.
   * When true, Amazon EMR automatically configures spark-defaults properties based on cluster hardware configuration.
   *
   * For more info:
   * @see https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark-configure.html#emr-spark-maximizeresourceallocation
   *
   * @returns 'spark'
   */
  static configSpark = new Classification('spark');

  /**
   * Sets values in the spark-defaults.conf file.
   *
   * For more info:
   * @see https://spark.apache.org/docs/latest/configuration.html
   *
   * @returns 'spark-defaults'
   */
  static configSparkDefaults = new Classification('spark-defaults');

  /**
   * Sets values in the spark-env.sh file.
   *
   * For more info:
   * @see https://spark.apache.org/docs/latest/configuration.html#environment-variables
   *
   * @returns 'spark-env'
   */
  static configSparkEnv = new Classification('spark-env');

  /**
   * Sets values in the hive-site.xml for Spark.
   *
   * @returns 'spark-hive-site'
   */
  static configSparkHiveSite = new Classification('spark-hive-site');

  /**
   * Sets values in the log4j.properties file.
   *
   * For more settings and info:
   * @see https://github.com/apache/spark/blob/master/conf/log4j.properties.template
   *
   * @returns 'spark-log4j'
   */
  static configSparkLog4j = new Classification('spark-log4j');

  /**
   * Sets values in the metrics.properties file.
   *
   * For more settings and info:
   * @see https://github.com/apache/spark/blob/master/conf/metrics.properties.template
   *
   * @returns 'spark-metrics'
   */
  static configSparkMetrics = new Classification('spark-metrics');

  /**
   * Creates a new Classification, can be extended to support a classification
   *
   * @param classificationStatement A literal string in case a new EMR classification is released, if not already defined.
   */
  constructor(public readonly classificationStatement: string) { }
}

/**
 * A configuration specification to be used when provisioning virtual clusters,
 * which can include configurations for applications and software bundled with Amazon EMR on EKS.
 * A configuration consists of a classification, properties, and optional nested configurations.
 * A classification refers to an application-specific configuration file.
 * Properties are the settings you want to change in that file.
 */
export interface ApplicationConfiguration {

  /**
   * The classification within a configuration.
   * Length Constraints: Minimum length of 1. Maximum length of 1024.
   */
  readonly classification: Classification;

  /**
   * A list of additional configurations to apply within a configuration object.
   * Array Members: Maximum number of 100 items.
   *
   * @default - No other configurations
   */
  readonly nestedConfig?: ApplicationConfiguration[];

  /**
   * A set of properties specified within a configuration classification.
   * Map Entries: Maximum number of 100 items.
   *
   * @default - No properties
   */
  readonly properties?: { [key: string]: string };
}

/**
 * Configuration setting for monitoring.
 */
export interface Monitoring {

  /**
   * If set to true, will automatically create a Cloudwatch Log Group and S3 bucket
   *
   * @default - false
   */
  readonly logging?: boolean

  /**
   * A log group for CloudWatch monitoring.
   * You can configure your jobs to send log information to CloudWatch Logs.
   *
   * @default - Automatically generated
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * A log stream name prefix for Cloudwatch monitoring.
   *
   * @default - No log stream prefix
   */
  readonly logStreamNamePrefix?: string;

  /**
   * Amazon S3 Bucket for monitoring log publishing.
   * You can configure your jobs to send log information to Amazon S3.
   *
   * @default - Automatically generated
   */
  readonly logBucket?: s3.IBucket;

  /**
   * Monitoring configurations for the persistent application UI.
   *
   * Valid values - True or False
   *
   * @default - True
   */
  readonly persistentAppUI?: boolean;
}

/**
 * The Amazon EMR release version to use for the job run.
 */
export class ReleaseLabel {

  /**
   * EMR Release version 5.32.0
   *
   * @returns 'emr-5.32.0-latest'
   */
  static readonly EMR_5_32_0 = new ReleaseLabel('emr-5.32.0-latest');

  /**
   * EMR Release version 5.33.0
   *
   * @returns 'emr-5.33.0-latest'
   */
  static readonly EMR_5_33_0 = new ReleaseLabel('emr-5.33.0-latest');

  /**
   * EMR Release version 6.2.0
   *
   * @returns 'emr-6.2.0-latest'
   */
  static readonly EMR_6_2_0 = new ReleaseLabel('emr-6.2.0-latest');

  /**
   * EMR Release version 6.3.0
   *
   * @returns 'emr-6.3.0-latest'
   */
  static readonly EMR_6_3_0 = new ReleaseLabel('emr-6.3.0-latest');

  /**
   * Initializes the label string, can be extended in case a new EMR Release occurs
   *
   * @param label A literal string that contains the release-version ex. 'emr-x.x.x-latest'
   */
  constructor(public readonly label: string) { }
}

/**
 * Class that returns a virtual cluster's id depending on input type
 */
export class VirtualClusterInput {

  /**
   * Input for a virtualClusterId from a Task Input
   *
   * @param taskInput Task Input that contains a virtualClusterId.
   * @returns a Task Input's value - typically a literal string or path that contains the virtualClusterId.
   */
  static fromTaskInput(taskInput: sfn.TaskInput): VirtualClusterInput {
    return new VirtualClusterInput(taskInput.value);
  }

  /**
   * Input for virtualClusterId from a string
   *
   * @param virtualClusterId literal string containing the virtualClusterId
   * @returns the virtualClusterId
   */
  static fromVirtualClusterId(virtualClusterId: string): VirtualClusterInput {
    return new VirtualClusterInput(virtualClusterId);
  }

  /**
   * Initializes the virtual cluster ID.
   *
   * @param id The VirtualCluster Id
   */
  private constructor(public readonly id: string) { }
}
