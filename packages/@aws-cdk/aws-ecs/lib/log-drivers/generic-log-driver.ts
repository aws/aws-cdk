import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * A log driver that sends logs to the specified driver.
 */
export class GenericLogDriver extends LogDriver {
  /**
   * The log driver to use for the container. The valid values listed for this parameter are log drivers
   * that the Amazon ECS container agent can communicate with by default. You cannot use awslogs with the GenericLogDriver.
   * You must use the AwsLogDriver if you want to use awslogs.
   *
   * For tasks using the Fargate launch type, the supported log drivers are awslogs and splunk.
   * For tasks using the EC2 launch type, the supported log drivers are awslogs, syslog, gelf, fluentd, splunk, journald, and json-file.
   *
   */
  private logDriver: string;

  /**
   * The configuration options to send to the log driver.
   */
  private options: { [key: string]: string };

  /**
   * Constructs a new instance of the GenericLogDriver class.
   *
   * @param props the generic log driver configuration options.
   */
  constructor(private readonly props: LogDriverConfig) {
    super();
  }

  /**
   * Called when the log driver is configured on a container.
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    this.logDriver = this.props.logDriver;
    this.options = this.props.options || {};

    return {
      logDriver: this.logDriver,
      options: removeEmpty(this.options),
    };
  }
}

/**
 * Remove undefined values from a dictionary
 */
function removeEmpty<T>(x: {[key: string]: (T | undefined)}): {[key: string]: T} {
  for (const key of Object.keys(x)) {
    if (!x[key]) {
      delete x[key];
    }
  }
  return x as any;
}
