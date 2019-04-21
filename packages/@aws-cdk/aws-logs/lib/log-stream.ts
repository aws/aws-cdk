import { Construct, DeletionPolicy, IResource, Resource } from '@aws-cdk/cdk';
import { ILogGroup } from './log-group';
import { CfnLogStream } from './logs.generated';

export interface ILogStream extends IResource {
  /**
   * The name of this log stream
   */
  readonly logStreamName: string;
}

/**
 * Properties for a LogStream
 */
export interface LogStreamProps {
  /**
   * The log group to create a log stream for.
   */
  readonly logGroup: ILogGroup;

  /**
   * The name of the log stream to create.
   *
   * The name must be unique within the log group.
   *
   * @default Automatically generated
   */
  readonly logStreamName?: string;

  /**
   * Retain the log stream if the stack or containing construct ceases to exist
   *
   * Normally you want to retain the log stream so you can diagnose issues
   * from logs even after a deployment that no longer includes the log stream.
   *
   * The date-based retention policy of your log group will age out the logs
   * after a certain time.
   *
   * @default true
   */
  readonly retainLogStream?: boolean;
}

/**
 * Define a Log Stream in a Log Group
 */
export class LogStream extends Resource implements ILogStream {
  /**
   * Import an existing LogGroup
   */
  public static fromLogStreamName(scope: Construct, logStreamName: string): ILogStream {
    class Import extends Construct implements ILogStream {
      public readonly logStreamName = logStreamName;
    }

    return new Import(scope, logStreamName);
  }

  /**
   * The name of this log stream
   */
  public readonly logStreamName: string;

  constructor(scope: Construct, id: string, props: LogStreamProps) {
    super(scope, id);

    const resource = new CfnLogStream(this, 'Resource', {
      logGroupName: props.logGroup.logGroupName,
      logStreamName: props.logStreamName
    });

    if (props.retainLogStream !== false) {
      resource.options.deletionPolicy = DeletionPolicy.Retain;
    }

    this.logStreamName = resource.logStreamName;
  }
}
