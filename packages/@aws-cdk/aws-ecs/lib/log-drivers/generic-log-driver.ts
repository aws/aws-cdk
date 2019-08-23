import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * A log driver that sends log information to CloudWatch Logs.
 */
export class GenericLogDriver extends LogDriver {
  /**
   * The log driver to use for the container. The valid values listed for this parameter are log drivers
   * that the Amazon ECS container agent can communicate with by default. You cannot use awslogs with the GenericLogDriver.
   * You must use the AwsLogDriver if you want to use awslogs.
   *
   * For more information about using the awslogs log driver, see
   * [Using the awslogs Log Driver](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html)
   * in the Amazon Elastic Container Service Developer Guide.
   */
  public logDriver: string;

  /**
   * The configuration options to send to the log driver.
   */
  public options: { [key: string]: string };

  /**
   * Constructs a new instance of the GenericLogDriver class.
   *
   * @param props the generic log driver configuration options.
   */
  constructor(private readonly props: LogDriverConfig) {
    super();

    if (props.logDriver === 'awslogs') {
      throw new Error('awslogs is not a valid logDriver for the GenericLogDriver. Please use the AwsLogDriver.');
    }
  }

  /**
   * Called when the log driver is configured on a container.
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    this.logDriver = this.props.logDriver;
    this.options = this.props.options

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
