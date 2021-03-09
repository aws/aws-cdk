import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from '../index';
import { removeEmpty } from './utils';

/**
 * The configuration to use when creating a log driver.
 */
export interface GenericLogDriverProps {
  /**
   * The log driver to use for the container. The valid values listed for this parameter are log drivers
   * that the Amazon ECS container agent can communicate with by default.
   *
   * For tasks using the Fargate launch type, the supported log drivers are awslogs and splunk.
   * For tasks using the EC2 launch type, the supported log drivers are awslogs, syslog, gelf, fluentd, splunk, journald, and json-file.
   *
   * For more information about using the awslogs log driver, see
   * [Using the awslogs Log Driver](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html)
   * in the Amazon Elastic Container Service Developer Guide.
   */
  readonly logDriver: string;

  /**
   * The configuration options to send to the log driver.
   */
  readonly options?: { [key: string]: string };
}

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
  constructor(props: GenericLogDriverProps) {
    super();

    this.logDriver = props.logDriver;
    this.options = props.options || {};
  }

  /**
   * Called when the log driver is configured on a container.
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: this.logDriver,
      options: removeEmpty(this.options),
    };
  }
}
