import cdk = require('@aws-cdk/cdk');
import { LogGroupRef } from './log-group';
import { cloudformation } from './logs.generated';

/**
 * Properties for importing a LogStream
 */
export interface LogStreamRefProps {
  logStreamName: string;
}

/**
 * A Log Stream in a Log Group
 */
export abstract class LogStreamRef extends cdk.Construct {
  /**
   * Import an existing LogGroup
   */
  public static import(parent: cdk.Construct, id: string, props: LogStreamRefProps): LogStreamRef {
    return new ImportedLogStream(parent, id, props);
  }

  /**
   * The name of this log stream
   */
  public abstract readonly logStreamName: string;

  /**
   * Export this LogStream
   */
  public export(): LogStreamRefProps {
    return {
      logStreamName: new cdk.Output(this, 'LogStreamName', { value: this.logStreamName }).makeImportValue().toString()
    };
  }
}

/**
 * Properties for a LogStream
 */
export interface LogStreamProps {
  /**
   * The log group to create a log stream for.
   */
  logGroup: LogGroupRef;

  /**
   * The name of the log stream to create.
   *
   * The name must be unique within the log group.
   *
   * @default Automatically generated
   */
  logStreamName?: string;

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
  retainLogStream?: boolean;
}

/**
 * Define a Log Stream in a Log Group
 */
export class LogStream extends LogStreamRef {
  /**
   * The name of this log stream
   */
  public readonly logStreamName: string;

  constructor(parent: cdk.Construct, id: string, props: LogStreamProps) {
    super(parent, id);

    const resource = new cloudformation.LogStreamResource(this, 'Resource', {
      logGroupName: props.logGroup.logGroupName,
      logStreamName: props.logStreamName
    });

    if (props.retainLogStream !== false) {
      resource.options.deletionPolicy = cdk.DeletionPolicy.Retain;
    }

    this.logStreamName = resource.logStreamName;
  }
}

/**
 * An imported LogStream
 */
class ImportedLogStream extends LogStreamRef {
  /**
   * The name of this log stream
   */
  public readonly logStreamName: string;

  constructor(parent: cdk.Construct, id: string, props: LogStreamRefProps) {
    super(parent, id);

    this.logStreamName = props.logStreamName;
  }
}
