import { Construct } from 'constructs';
import { LogDriver, LogDriverConfig } from './log-driver';
import { removeEmpty } from './utils';
import * as iam from '../../../aws-iam';
import * as logs from '../../../aws-logs';
import { Size, SizeRoundingBehavior } from '../../../core';
import { ContainerDefinition } from '../container-definition';

/**
 * awslogs provides two modes for delivering messages from the container to the log driver
 */
export enum AwsLogDriverMode {

  /**
   * (default) direct, blocking delivery from container to driver.
   */
  BLOCKING = 'blocking',

  /**
   * The non-blocking message delivery mode prevents applications from blocking due to logging back pressure.
   * Applications are likely to fail in unexpected ways when STDERR or STDOUT streams block.
   */
  NON_BLOCKING = 'non-blocking',
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

  /**
   * When AwsLogDriverMode.NON_BLOCKING is configured, this parameter
   * controls the size of the non-blocking buffer used to temporarily
   * store messages. This parameter is not valid with
   * AwsLogDriverMode.BLOCKING.
   *
   * @default - 1 megabyte if driver mode is non-blocking, otherwise this property is not set
   */
  readonly maxBufferSize?: Size;
}

/**
 * A log driver that sends log information to CloudWatch Logs.
 */
export class AwsLogDriver extends LogDriver {
  /**
   * The log group to send log streams to.
   *
   * Only available after the LogDriver has been bound to a ContainerDefinition.
   */
  public logGroup?: logs.ILogGroup;

  /**
   * Constructs a new instance of the AwsLogDriver class.
   *
   * @param props the awslogs log driver configuration options.
   */
  constructor(private readonly props: AwsLogDriverProps) {
    super();

    if (props.logGroup && props.logRetention) {
      throw new Error('Cannot specify both `logGroup` and `logRetentionDays`.');
    }

    if (props.maxBufferSize && props.mode !== AwsLogDriverMode.NON_BLOCKING) {
      throw new Error('Cannot specify `maxBufferSize` when the driver mode is blocking');
    }
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(scope: Construct, containerDefinition: ContainerDefinition): LogDriverConfig {
    this.logGroup = this.props.logGroup || new logs.LogGroup(scope, 'LogGroup', {
      retention: this.props.logRetention || Infinity,
    });

    const maxBufferSize = this.props.maxBufferSize
      ? `${this.props.maxBufferSize.toBytes({ rounding: SizeRoundingBehavior.FLOOR })}b`
      : undefined;

    // These policies are required for the Execution role to use awslogs driver.
    // In cases where `addToExecutionRolePolicy` is not implemented,
    // for example, when used from aws-batch construct,
    // use `obtainExecutionRole` instead of `addToExecutionRolePolicy` to grant policies to the Execution role.
    // See https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html#enable_awslogs
    const execRole = containerDefinition.taskDefinition.obtainExecutionRole();
    execRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [this.logGroup.logGroupArn],
    }));

    return {
      logDriver: 'awslogs',
      options: removeEmpty({
        'awslogs-group': this.logGroup.logGroupName,
        'awslogs-stream-prefix': this.props.streamPrefix,
        'awslogs-region': this.logGroup.env.region,
        'awslogs-datetime-format': this.props.datetimeFormat,
        'awslogs-multiline-pattern': this.props.multilinePattern,
        'mode': this.props.mode,
        'max-buffer-size': maxBufferSize,
      }),
    };
  }
}
