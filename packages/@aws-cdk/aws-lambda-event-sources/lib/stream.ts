import lambda = require('@aws-cdk/aws-lambda');
import {Duration} from '@aws-cdk/core';

/**
 * The set of properties for event sources that follow the streaming model,
 * such as, Dynamo and Kinesis.
 */
export interface StreamEventSourceProps {
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * @default 100
   */
  readonly batchSize?: number;

  /**
   * Where to begin consuming the stream.
   */
  readonly startingPosition: lambda.StartingPosition;

  /**
   * The maximum amount of time to gather records before invoking the function.
   * Maximum of Duration.minutes(5)
   *
   * @default Duration.seconds(0)
   */
  readonly maxBatchingWindow?: Duration;
}

/**
 * Use an stream as an event source for AWS Lambda.
 */
export abstract class StreamEventSource implements lambda.IEventSource {
  protected constructor(protected readonly props: StreamEventSourceProps) {
  }

  public abstract bind(_target: lambda.IFunction): void;

  protected enrichMappingOptions(options: lambda.EventSourceMappingOptions): lambda.EventSourceMappingOptions {
    return {
      ...options,
      batchSize: this.props.batchSize || 100,
      startingPosition: this.props.startingPosition,
      maxBatchingWindow: this.props.maxBatchingWindow,
    };
  }
}
