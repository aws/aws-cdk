import { AwsLogDriver, AwsLogDriverProps } from './aws-log-driver';
import { FireLensLogDriver, FireLensLogDriverProps } from './firelens-log-driver';
import { FluentdLogDriver, FluentdLogDriverProps } from './fluentd-log-driver';
import { GelfLogDriver, GelfLogDriverProps } from './gelf-log-driver';
import { JournaldLogDriver, JournaldLogDriverProps } from './journald-log-driver';
import { JsonFileLogDriver, JsonFileLogDriverProps } from './json-file-log-driver';
import { LogDriver } from './log-driver';
import { SplunkLogDriver, SplunkLogDriverProps } from './splunk-log-driver';
import { SyslogLogDriver, SyslogLogDriverProps } from './syslog-log-driver';

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
   * Creates a log driver configuration that sends log information to firelens log router.
   * For detail configurations, please refer to Amazon ECS FireLens Examples:
   * https://github.com/aws-samples/amazon-ecs-firelens-examples
   */
  public static firelens(props: FireLensLogDriverProps): LogDriver {
    return new FireLensLogDriver(props);
  }
}
