import { Construct } from 'constructs';
import { ILogGroup } from './log-group';
import { CfnLogStream } from './logs.generated';
import { IResource, RemovalPolicy, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

export interface ILogStream extends IResource {
  /**
   * The name of this log stream
   * @attribute
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
   * Determine what happens when the log stream resource is removed from the
   * app.
   *
   * Normally you want to retain the log stream so you can diagnose issues from
   * logs even after a deployment that no longer includes the log stream.
   *
   * The date-based retention policy of your log group will age out the logs
   * after a certain time.
   *
   * @default RemovalPolicy.Retain
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Define a Log Stream in a Log Group
 */
@propertyInjectable
export class LogStream extends Resource implements ILogStream {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.LogStream';

  /**
   * Import an existing LogGroup
   */
  public static fromLogStreamName(scope: Construct, id: string, logStreamName: string): ILogStream {
    class Import extends Resource implements ILogStream {
      public readonly logStreamName = logStreamName;
    }

    return new Import(scope, id);
  }

  /**
   * The name of this log stream
   */
  public readonly logStreamName: string;

  constructor(scope: Construct, id: string, props: LogStreamProps) {
    super(scope, id, {
      physicalName: props.logStreamName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnLogStream(this, 'Resource', {
      logGroupName: props.logGroup.logGroupName,
      logStreamName: this.physicalName,
    });

    resource.applyRemovalPolicy(props.removalPolicy);
    this.logStreamName = this.getResourceNameAttribute(resource.ref);
  }
}
