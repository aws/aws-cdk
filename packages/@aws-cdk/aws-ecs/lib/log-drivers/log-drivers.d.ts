import { AwsLogDriverProps } from './aws-log-driver';
import { FireLensLogDriverProps } from './firelens-log-driver';
import { FluentdLogDriverProps } from './fluentd-log-driver';
import { GelfLogDriverProps } from './gelf-log-driver';
import { JournaldLogDriverProps } from './journald-log-driver';
import { JsonFileLogDriverProps } from './json-file-log-driver';
import { LogDriver } from './log-driver';
import { SplunkLogDriverProps } from './splunk-log-driver';
import { SyslogLogDriverProps } from './syslog-log-driver';
/**
 * The base class for log drivers.
 */
export declare class LogDrivers {
    /**
     * Creates a log driver configuration that sends log information to CloudWatch Logs.
     */
    static awsLogs(props: AwsLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to fluentd Logs.
     */
    static fluentd(props?: FluentdLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to gelf Logs.
     */
    static gelf(props: GelfLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to journald Logs.
     */
    static journald(props?: JournaldLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to json-file Logs.
     */
    static jsonFile(props?: JsonFileLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to splunk Logs.
     */
    static splunk(props: SplunkLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to syslog Logs.
     */
    static syslog(props?: SyslogLogDriverProps): LogDriver;
    /**
     * Creates a log driver configuration that sends log information to firelens log router.
     * For detail configurations, please refer to Amazon ECS FireLens Examples:
     * https://github.com/aws-samples/amazon-ecs-firelens-examples
     */
    static firelens(props: FireLensLogDriverProps): LogDriver;
}
