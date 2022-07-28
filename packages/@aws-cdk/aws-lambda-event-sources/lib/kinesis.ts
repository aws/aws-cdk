import * as kinesis from '@aws-cdk/aws-kinesis';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { StreamEventSource, StreamEventSourceProps } from './stream';

export interface KinesisEventSourceProps extends StreamEventSourceProps {
  /**
   * The time from which to start reading, in Unix time seconds.
   *
   * @default - no timestamp
   */
  readonly startingPositionTimestamp?: number;
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource extends StreamEventSource {
  private _eventSourceMappingId?: string = undefined;
  private startingPositionTimestamp?: number;

  constructor(readonly stream: kinesis.IStream, props: KinesisEventSourceProps) {
    super(props);
    this.startingPositionTimestamp = props.startingPositionTimestamp;

    this.props.batchSize !== undefined && cdk.withResolved(this.props.batchSize, batchSize => {
      if (batchSize < 1 || batchSize > 10000) {
        throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`);
      }
    });
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`KinesisEventSource:${cdk.Names.nodeUniqueId(this.stream.node)}`,
      this.enrichMappingOptions({
        eventSourceArn: this.stream.streamArn,
        startingPositionTimestamp: this.startingPositionTimestamp,
      }),
    );
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    this.stream.grantRead(target);

    // The `grantRead` API provides all the permissions recommended by the Kinesis team for reading a stream.
    // `DescribeStream` permissions are not required to read a stream as it's covered by the `DescribeStreamSummary`
    // and `SubscribeToShard` APIs.
    // The Lambda::EventSourceMapping resource validates against the `DescribeStream` permission. So we add it explicitly.
    // FIXME This permission can be removed when the event source mapping resource drops it from validation.
    this.stream.grant(target, 'kinesis:DescribeStream');
  }

  /**
   * The identifier for this EventSourceMapping
   */
  public get eventSourceMappingId(): string {
    if (!this._eventSourceMappingId) {
      throw new Error('KinesisEventSource is not yet bound to an event source mapping');
    }
    return this._eventSourceMappingId;
  }
}
