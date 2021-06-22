import * as sfn from '@aws-cdk/aws-stepfunctions';

/**
 * The information about job driver for Spark submit.
 */
export interface SparkSubmitJobDriver {

  /**
   * The entry point of job application.
   * 
   * @default - No entry point
   */
  readonly entryPoint: string;

  /**
   * The arguments for job application.
   * 
   * @default - No arguments defined
   */
  readonly entryPointArguments?: string[];

  /**
   * The Spark submit parameters that are used for job runs.
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
   * Length Constraints: Minimum length of 1. Maximum length of 102400.
   * 
   * @default - No job driver parameters specified.
   */
  readonly sparkSubmitJobDriver?: SparkSubmitJobDriver;
}

/**
 * A configuration specification to be used when provisioning virtual clusters, 
 * which can include configurations for applications and software bundled with Amazon EMR on EKS. 
 * A configuration consists of a classification, properties, and optional nested configurations. 
 * A classification refers to an application-specific configuration file. 
 * Properties are the settings you want to change in that file. 
 */
export interface Configuration {

  /**
   * The classification within a configuration.
   * 
   * @default -
   */
  readonly classification: string;

  /**
   * A list of additional configurations to apply within a configuration object.
   * 
   * @default -
   */
  readonly configurations?: Configuration[];

  /**
   * A set of properties specified within a configuration classification.
   * 
   * @default -
   */
  readonly properties?: { [key: string]: string };
}

/**
 * Monitoring configurations for CloudWatch.
 */
export interface CloudWatchMonitoringConfiguration {
  
  /**
   * The name of the log group for log publishing.
   * 
   * @default - 
   */
  readonly logGroupName: string;

  /**
   * The specified name prefix for log streams.
   * 
   * @default -
   */
  readonly logStreamNamePrefix?: string;
}

/**
 *  Amazon S3 configuration for monitoring log publishing. You can configure your jobs to send log information to Amazon S3. 
 */
export interface S3MonitoringConfiguration {

  /**
   * Amazon S3 destination URI for log publishing.
   * 
   * @default - 
   */
  readonly logUri: string;
}

/**
 * Configuration setting for monitoring.
 */
export interface MonitoringConfiguration {

  /**
   * Monitoring configurations for CloudWatch.
   * 
   * @default -
   */
  readonly cloudWatchMonitoringConfig?: CloudWatchMonitoringConfiguration;

  /**
   * Monitoring configurations for the persistent application UI. 
   * Valid values - ENABLED | DISABLED
   * 
   * @default - 
   */
  readonly persistentAppUI?: string;
  
  /**
   * Amazon S3 configuration for monitoring log publishing.
   * 
   * @default -
   */
  readonly s3MonitoringConfig?: S3MonitoringConfiguration;
}

/**
 * A configuration specification to be used to override existing configurations.
 */
export interface ConfigurationOverrides {
  
  /**
   * The configurations for the application running by the job run. 
   * 
   * @default - 
   */
  readonly applicationConfig?: Configuration[];

  /**
   * The configurations for monitoring.
   * 
   * @default - 
   */
  readonly monitoringConfig?: MonitoringConfiguration;
}