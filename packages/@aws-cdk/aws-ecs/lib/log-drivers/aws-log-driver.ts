import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from '../container-definition';
import { CfnTaskDefinition } from '../ecs.generated';
import { LogDriver } from "./log-driver";

/**
 * Properties for defining a new AWS Log Driver
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
   * @default A log group is automatically created
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * This option defines a multiline start pattern in Python strftime format.
   *
   * A log message consists of a line that matches the pattern and any
   * following lines that don’t match the pattern. Thus the matched line is
   * the delimiter between log messages.
   */
  readonly datetimeFormat?: string;

  /**
   * This option defines a multiline start pattern using a regular expression.
   *
   * A log message consists of a line that matches the pattern and any
   * following lines that don’t match the pattern. Thus the matched line is
   * the delimiter between log messages.
   */
  readonly multilinePattern?: string;
}

/**
 * A log driver that will log to an AWS Log Group
 */
export class AwsLogDriver extends LogDriver {
  /**
   * The log group that the logs will be sent to
   */
  public readonly logGroup: logs.ILogGroup;

  constructor(scope: cdk.Construct, id: string, private readonly props: AwsLogDriverProps) {
    super(scope, id);
    this.logGroup = props.logGroup || new logs.LogGroup(this, 'LogGroup', {
        retentionDays: 365,
    });
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(containerDefinition: ContainerDefinition): void {
    this.logGroup.grantWrite(containerDefinition.taskDefinition.obtainExecutionRole());
  }

  /**
   * Return the log driver CloudFormation JSON
   */
  public renderLogDriver(): CfnTaskDefinition.LogConfigurationProperty {
    return {
      logDriver: 'awslogs',
      options: removeEmpty({
        'awslogs-group': this.logGroup.logGroupName,
        'awslogs-stream-prefix': this.props.streamPrefix,
        'awslogs-region': this.node.stack.region,
        'awslogs-datetime-format': this.props.datetimeFormat,
        'awslogs-multiline-pattern': this.props.multilinePattern,
      }),
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
