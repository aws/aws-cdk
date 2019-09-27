import lambda = require('@aws-cdk/aws-lambda');
import {Duration} from "@aws-cdk/core";

export interface StreamingEventSourceProps {
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range: Minimum value of 1. Maximum value of 10000.
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
  protected constructor(protected readonly props: StreamingEventSourceProps, protected readonly maxBatchSize: number) {
    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > maxBatchSize)) {
      throw new Error(`Maximum batch size must be between 1 and ${maxBatchSize} inclusive (given ${this.props.batchSize})`);
    }
  }

  protected getEventSourceMappingOptions (eventSourceArn: string): lambda.EventSourceMappingOptions {
    return {
      eventSourceArn,
      batchSize: this.props.batchSize || 100,
      startingPosition: this.props.startingPosition,
      maxBatchingWindow: this.props.maxBatchingWindow,
    };
  }

  public bind(_target: lambda.IFunction): void {
    throw new Error('Cannot bind StreamEventSource, use DynamoEventSource or KinesisEventSource');
  }
}
