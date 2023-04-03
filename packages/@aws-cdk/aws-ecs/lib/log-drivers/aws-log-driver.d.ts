import * as logs from '@aws-cdk/aws-logs';
import { Construct } from 'constructs';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ContainerDefinition } from '../container-definition';
/**
 * awslogs provides two modes for delivering messages from the container to the log driver
 */
export declare enum AwsLogDriverMode {
    /**
     * (default) direct, blocking delivery from container to driver.
     */
    BLOCKING = "blocking",
    /**
     * The non-blocking message delivery mode prevents applications from blocking due to logging back pressure.
     * Applications are likely to fail in unexpected ways when STDERR or STDOUT streams block.
     */
    NON_BLOCKING = "non-blocking"
}
/**
 * Specifies the awslogs log driver configuration options.
 */
export interface AwsLogDriverProps {
    /**
     * Prefix for the log streams
     *
     * The awslogs-stream-prefix option allows you to associate a log stream
     * with the specified prefix, the container name, and the ID of the Amazon
     * ECS task to which the container belongs. If you specify a prefix with
     * this option, then the log stream takes the following format:
     *
     *     prefix-name/container-name/ecs-task-id
     */
    readonly streamPrefix: string;
    /**
     * The log group to log to
     *
     * @default - A log group is automatically created.
     */
    readonly logGroup?: logs.ILogGroup;
    /**
     * The number of days log events are kept in CloudWatch Logs when the log
     * group is automatically created by this construct.
     *
     * @default - Logs never expire.
     */
    readonly logRetention?: logs.RetentionDays;
    /**
     * This option defines a multiline start pattern in Python strftime format.
     *
     * A log message consists of a line that matches the pattern and any
     * following lines that don’t match the pattern. Thus the matched line is
     * the delimiter between log messages.
     *
     * @default - No multiline matching.
     */
    readonly datetimeFormat?: string;
    /**
     * This option defines a multiline start pattern using a regular expression.
     *
     * A log message consists of a line that matches the pattern and any
     * following lines that don’t match the pattern. Thus the matched line is
     * the delimiter between log messages.
     *
     * This option is ignored if datetimeFormat is also configured.
     *
     * @default - No multiline matching.
     */
    readonly multilinePattern?: string;
    /**
     * The delivery mode of log messages from the container to awslogs.
     *
     * @default - AwsLogDriverMode.BLOCKING
     */
    readonly mode?: AwsLogDriverMode;
}
/**
 * A log driver that sends log information to CloudWatch Logs.
 */
export declare class AwsLogDriver extends LogDriver {
    private readonly props;
    /**
     * The log group to send log streams to.
     *
     * Only available after the LogDriver has been bound to a ContainerDefinition.
     */
    logGroup?: logs.ILogGroup;
    /**
     * Constructs a new instance of the AwsLogDriver class.
     *
     * @param props the awslogs log driver configuration options.
     */
    constructor(props: AwsLogDriverProps);
    /**
     * Called when the log driver is configured on a container
     */
    bind(scope: Construct, containerDefinition: ContainerDefinition): LogDriverConfig;
}
