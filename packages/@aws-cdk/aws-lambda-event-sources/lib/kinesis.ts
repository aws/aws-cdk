import * as kinesis from '@aws-cdk/aws-kinesis';
import * as lambda from '@aws-cdk/aws-lambda';
import {StreamEventSource, StreamEventSourceProps} from './stream';

export interface KinesisEventSourceProps extends StreamEventSourceProps {
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource extends StreamEventSource {
  private _eventSourceMappingId: string | undefined = undefined;

  constructor(readonly stream: kinesis.IStream, props: KinesisEventSourceProps) {
    super(props);

    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 10000)) {
      throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`KinesisEventSource:${this.stream.node.uniqueId}`,
      this.enrichMappingOptions({eventSourceArn: this.stream.streamArn})
    );
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    this.stream.grantRead(target);
  }

  /**
   * The Ref of the EventSourceMapping
   */
  public get eventSourceMappingId(): string | undefined {
    return this._eventSourceMappingId;
  }
}
