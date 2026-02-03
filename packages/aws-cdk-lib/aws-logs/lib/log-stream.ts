import type { Construct } from 'constructs';
import { CfnLogStream } from './logs.generated';
import type { IResource, RemovalPolicy } from '../../core';
import { Resource, UnscopedValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { ILogGroupRef, ILogStreamRef, LogStreamReference } from '../../interfaces/generated/aws-logs-interfaces.generated';

export interface ILogStream extends IResource, ILogStreamRef {
  /**
   * The name of this log stream
   * @attribute
   */
  readonly logStreamName: string;
}

/**
 * Attributes for importing a LogStream
 */
export interface LogStreamAttributes {
  /**
   * The name of the log stream
   */
  readonly logStreamName: string;

  /**
   * The name of the log group
   *
   * @default - When not provided, logStreamRef will throw an error
   */
  readonly logGroupName: string;
}

/**
 * Properties for a LogStream
 */
export interface LogStreamProps {
  /**
   * The log group to create a log stream for.
   */
  readonly logGroup: ILogGroupRef;

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
   * Import an existing LogStream
   */
  public static fromLogStreamName(scope: Construct, id: string, logStreamName: string): ILogStream {
    class Import extends Resource implements ILogStream {
      public readonly logStreamName = logStreamName;

      public get logStreamRef() {
        return {
          get logGroupName(): string {
            throw new UnscopedValidationError('Cannot access logGroupName on a LogStream obtained from fromLogStreamName. Use LogStream.fromLogStreamAttributes() instead.');
          },
          logStreamName: this.logStreamName,
        };
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing LogStream using its attributes
   */
  public static fromLogStreamAttributes(scope: Construct, id: string, attrs: LogStreamAttributes): ILogStream {
    class Import extends Resource implements ILogStream {
      public readonly logStreamName = attrs.logStreamName;
      public get logStreamRef(): LogStreamReference {
        return {
          logGroupName: attrs.logGroupName,
          logStreamName: this.logStreamName,
        };
      }
    }

    return new Import(scope, id);
  }

  private readonly resource: CfnLogStream;

  private readonly logGroupName: string;

  /**
   * The name of this log stream
   */
  @memoizedGetter
  public get logStreamName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  constructor(scope: Construct, id: string, props: LogStreamProps) {
    super(scope, id, {
      physicalName: props.logStreamName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.logGroupName = props.logGroup.logGroupRef.logGroupName;

    this.resource = new CfnLogStream(this, 'Resource', {
      logGroupName: this.logGroupName,
      logStreamName: this.physicalName,
    });

    this.resource.applyRemovalPolicy(props.removalPolicy);
  }

  public get logStreamRef(): LogStreamReference {
    return {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
    };
  }
}
