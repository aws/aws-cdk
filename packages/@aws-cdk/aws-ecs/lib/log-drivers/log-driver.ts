import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { AwsLogDriver, AwsLogDriverProps } from './aws-log-driver';
import { FluentdLogDriver, FluentdLogDriverProps } from './fluentd-log-driver';
import { GelfLogDriver, GelfLogDriverProps } from './gelf-log-driver';
import { JournaldLogDriver, JournaldLogDriverProps } from './journald-log-driver';
import { JsonFileLogDriver, JsonFileLogDriverProps } from './json-file-log-driver';
import { SplunkLogDriver, SplunkLogDriverProps } from './splunk-log-driver';
import { SyslogLogDriver, SyslogLogDriverProps } from './syslog-log-driver';

/**
 * The base class for log drivers.
 */
export abstract class LogDriver {
  /**
   * Creates a log driver configuration that sends log information to CloudWatch Logs.
   */
  public static awsLogs(props: AwsLogDriverProps): LogDriver {
    return new AwsLogDriver(props);
  }

  /**
   * Creates a log driver configuration that sends log information to fluentd Logs.
   */
  public static fluentd(props?: FluentdLogDriverProps): LogDriver {
    return new FluentdLogDriver(props);
  }

  /**
   * Creates a log driver configuration that sends log information to gelf Logs.
   */
  public static gelf(props: GelfLogDriverProps): LogDriver {
    return new GelfLogDriver(props);
  }

  /**
   * Creates a log driver configuration that sends log information to journald Logs.
   */
  public static journald(props?: JournaldLogDriverProps): LogDriver {
    return new JournaldLogDriver(props);
  }

  /**
   * Creates a log driver configuration that sends log information to json-file Logs.
   */
  public static jsonFile(props?: JsonFileLogDriverProps): LogDriver {
    return new JsonFileLogDriver(props);
  }

  /**
   * Creates a log driver configuration that sends log information to splunk Logs.
   */
  public static splunk(props: SplunkLogDriverProps): LogDriver {
    return new SplunkLogDriver(props);
  }

  /**
   * Creates a log driver configuration that sends log information to syslog Logs.
   */
  public static syslog(props?: SyslogLogDriverProps): LogDriver {
    return new SyslogLogDriver(props);
  }

  /**
   * Called when the log driver is configured on a container
   */
  public abstract bind(scope: Construct, containerDefinition: ContainerDefinition): LogDriverConfig;
}

/**
 * The configuration to use when creating a log driver.
 */
export interface LogDriverConfig {
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