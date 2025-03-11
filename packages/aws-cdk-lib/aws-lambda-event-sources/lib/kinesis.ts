import * as constructs from 'constructs';
import { StreamEventSource, StreamEventSourceProps } from './stream';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';

export interface KinesisEventSourceProps extends StreamEventSourceProps {
  /**
   * The time from which to start reading, in Unix time seconds.
   *
   * @default - no timestamp
   */
  readonly startingPositionTimestamp?: number;
}

/**
 * Props for use with {@link KinesisEventSourceBase}
 */
interface KinesisSource {
  readonly node: constructs.Node;
  readonly sourceArn: string;
  readonly eventSourceName: string;
  grantRead(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Base class for {@link KinesisEventSource} and {@link KinesisConsumerEventSource}
 */
abstract class KinesisEventSourceBase extends StreamEventSource {
  private _eventSourceMappingId?: string = undefined;
  private _eventSourceMappingArn?: string = undefined;
  private startingPositionTimestamp?: number;

  constructor(readonly source: KinesisSource, props: KinesisEventSourceProps) {
    super(props);
    this.startingPositionTimestamp = props.startingPositionTimestamp;

    this.props.batchSize !== undefined && cdk.withResolved(this.props.batchSize, batchSize => {
      if (batchSize < 1 || batchSize > 10000) {
        throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`);
      }
    });
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`${this.source.eventSourceName}:${cdk.Names.nodeUniqueId(this.source.node)}`,
      this.enrichMappingOptions({
        eventSourceArn: this.source.sourceArn,
        startingPositionTimestamp: this.startingPositionTimestamp,
        metricsConfig: this.props.metricsConfig,
        supportS3OnFailureDestination: true,
      }),
    );
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;
    this._eventSourceMappingArn = eventSourceMapping.eventSourceMappingArn;

    this.source.grantRead(target);
  }

  /**
   * The identifier for this EventSourceMapping
   */
  public get eventSourceMappingId(): string {
    if (!this._eventSourceMappingId) {
      throw new Error(`${this.source.eventSourceName} is not yet bound to an event source mapping`);
    }
    return this._eventSourceMappingId;
  }

  /**
   * The ARN for this EventSourceMapping
   */
  public get eventSourceMappingArn(): string {
    if (!this._eventSourceMappingArn) {
      throw new Error(`${this.source.eventSourceName} is not yet bound to an event source mapping`);
    }
    return this._eventSourceMappingArn;
  }
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource extends KinesisEventSourceBase {
  constructor(readonly stream: kinesis.IStream, props: KinesisEventSourceProps) {
    super({ ...stream, eventSourceName: 'KinesisEventSource', sourceArn: stream.streamArn, grantRead: stream.grantRead.bind(stream) }, props);
  }
}

/**
 * Use an Amazon Kinesis stream consumer as an event source for AWS Lambda.
 */
export class KinesisConsumerEventSource extends KinesisEventSourceBase {
  constructor(readonly streamConsumer: kinesis.IStreamConsumer, props: KinesisEventSourceProps) {
    super({ ...streamConsumer, eventSourceName: 'KinesisConsumerEventSource', sourceArn: streamConsumer.streamConsumerArn, grantRead: streamConsumer.grantRead.bind(streamConsumer) }, props);
  }
}
