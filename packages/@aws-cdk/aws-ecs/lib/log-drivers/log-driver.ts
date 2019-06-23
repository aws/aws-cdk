import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { AwsLogDriver, AwsLogDriverProps } from './aws-log-driver';

/**
 * Base class for log drivers
 */
export abstract class LogDriver {
  /**
   * Create an AWS Logs logdriver
   */
  public static awsLogs(props: AwsLogDriverProps): LogDriver {
    return new AwsLogDriver(props);
  }

  /**
   * Called when the log driver is configured on a container
   */
  public abstract bind(scope: Construct, containerDefinition: ContainerDefinition): LogDriverConfig;
}

/**
 * Configuration to create a log driver from
 */
export interface LogDriverConfig {
  /**
   * Name of the log driver to use
   */
  readonly logDriver: string;

  /**
   * Log-driver specific option set
   */
  readonly options?: { [key: string]: string };
}