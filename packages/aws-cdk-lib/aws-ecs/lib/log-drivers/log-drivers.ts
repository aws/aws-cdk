import type { AwsLogDriverProps } from './aws-log-driver';
import { AwsLogDriver } from './aws-log-driver';
import type { FireLensLogDriverProps } from './firelens-log-driver';
import { FireLensLogDriver } from './firelens-log-driver';
import type { FluentdLogDriverProps } from './fluentd-log-driver';
import { FluentdLogDriver } from './fluentd-log-driver';
import type { GelfLogDriverProps } from './gelf-log-driver';
import { GelfLogDriver } from './gelf-log-driver';
import type { JournaldLogDriverProps } from './journald-log-driver';
import { JournaldLogDriver } from './journald-log-driver';
import type { JsonFileLogDriverProps } from './json-file-log-driver';
import { JsonFileLogDriver } from './json-file-log-driver';
import type { LogDriver } from './log-driver';
import { NoneLogDriver } from './none-log-driver';
import type { SplunkLogDriverProps } from './splunk-log-driver';
import { SplunkLogDriver } from './splunk-log-driver';
import type { SyslogLogDriverProps } from './syslog-log-driver';
import { SyslogLogDriver } from './syslog-log-driver';

/**
 * The base class for log drivers.
 */
export class LogDrivers {
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
   * Creates a log driver configuration that disables logging (Docker `none` driver).
   */
  public static none(): LogDriver {
    return new NoneLogDriver();
  }

  /**
   * Creates a log driver configuration that sends log information to firelens log router.
   * For detail configurations, please refer to Amazon ECS FireLens Examples:
   * https://github.com/aws-samples/amazon-ecs-firelens-examples
   */
  public static firelens(props: FireLensLogDriverProps): LogDriver {
    return new FireLensLogDriver(props);
  }
}
