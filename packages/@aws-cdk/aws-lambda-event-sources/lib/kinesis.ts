import * as kinesis from '@aws-cdk/aws-kinesis';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { StreamEventSource, StreamEventSourceProps } from './stream';

export interface KinesisEventSourceProps extends StreamEventSourceProps {
  /**
   * A list of event filtering criteria to control which events Lambda sends to
   * your function for processing. You can define up to five different filters
   * for a single event source. If an event satisfies any one of these five
   * filters, Lambda sends the event to your function. Otherwise, Lambda
   * discards the event. An event either satisfies the filter criteria or it
   * doesn't. If you're using batching windows, Lambda applies your filter
   * criteria to each new event to determine whether to add it to the current
   * batch.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html
   *
   * @default - none
   *
   * @example
   * import * as kinesis from '@aws-cdk/aws-kinesis';
   * import * as sources from '@aws-cdk/aws-lambda-event-sources';
   * declare const stream: kinesis.IStream;
   * new sources.KinesisEventSource(stream, {
   *   startingPosition: lambda.StartingPosition.TRIM_HORIZON,
   *   filterPatterns: [
   *     { data: { balance: [{ numeric: [">", 500] }] } }
   *   ]
   * });
   */
  readonly filterPatterns?: lambda.FilterPattern[];
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource extends StreamEventSource {
  private _eventSourceMappingId?: string = undefined;
  private innerProps: KinesisEventSourceProps;

  constructor(readonly stream: kinesis.IStream, props: KinesisEventSourceProps) {
    super(props);

    this.props.batchSize !== undefined && cdk.withResolved(this.props.batchSize, batchSize => {
      if (batchSize < 1 || batchSize > 10000) {
        throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`);
      }
    });
    if ((props.filterPatterns?.length ?? 0) > 5) {
      throw new Error(`Maximum number of filter criteria for a single event source is five (given ${props.filterPatterns?.length}).`);
    }
    this.innerProps = props;
  }

  protected enrichMappingOptions(options: lambda.EventSourceMappingOptions): lambda.EventSourceMappingOptions {
    const eventSourceMapping = super.enrichMappingOptions(options);
    return {
      ...eventSourceMapping,
      filterPatterns: this.innerProps.filterPatterns,
    };
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`KinesisEventSource:${cdk.Names.nodeUniqueId(this.stream.node)}`,
      this.enrichMappingOptions({ eventSourceArn: this.stream.streamArn }),
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
