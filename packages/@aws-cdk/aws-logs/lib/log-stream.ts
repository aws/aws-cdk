import { CfnOutput, Construct, DeletionPolicy, IResource, Resource } from '@aws-cdk/cdk';
import { ILogGroup } from './log-group';
import { CfnLogStream } from './logs.generated';

export interface ILogStream extends IResource {
  /**
   * The name of this log stream
   */
  readonly logStreamName: string;

  /**
   * Export this LogStream
   */
  export(): LogStreamImportProps;
}

/**
 * Properties for importing a LogStream
 */
export interface LogStreamImportProps {
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
  public static import(scope: Construct, id: string, props: LogStreamImportProps): ILogStream {
    return new ImportedLogStream(scope, id, props);
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

  /**
   * Export this LogStream
   */
  public export(): LogStreamImportProps {
    return {
      logStreamName: new CfnOutput(this, 'LogStreamName', { value: this.logStreamName }).makeImportValue().toString()
    };
  }
}

/**
 * An imported LogStream
 */
class ImportedLogStream extends Construct implements ILogStream {
  /**
   * The name of this log stream
   */
  public readonly logStreamName: string;

  constructor(scope: Construct, id: string, private readonly props: LogStreamImportProps) {
    super(scope, id);

    this.logStreamName = props.logStreamName;
  }

  public export() {
    return this.props;
  }
}
