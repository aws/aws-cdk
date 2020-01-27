import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, IResolvable } from '@aws-cdk/core';

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
   * Valid Range:
   * * Minimum value of 1
   * * Maximum value of:
   *   * 1000 for {@link DynamoEventSource}
   *   * 10000 for {@link KinesisEventSource}
   *
   * @default 100
   */
  readonly batchSize?: number;

  /**
   * If the function returns an error, split the batch in two and retry.
   *
   * @default false
   */
  readonly bisectBatchOnFunctionError?: boolean;

  /**
   * An Amazon SQS queue or Amazon SNS topic destination for discarded records.
   *
   * @default discarded records are ignored
   */
  readonly destinationConfig?: lambda.CfnEventSourceMapping.DestinationConfigProperty | IResolvable | undefined;

  /**
   * The maximum age of a record that Lambda sends to a function for processing.
   * Valid Range:
   * * Minimum value of 60
   * * Maximum value of 604800
   *
   * @default 604800
   */
  readonly maximumRecordAge?: Duration;

  /**
   * Maximum number of retry attempts
   * Valid Range:
   * * Minimum value of 0
   * * Maximum value of 10000
   *
   * @default 10000
   */
  readonly maximumRetryAttempts?: number;

  /**
   * The number of batches to process from each shard concurrently.
   * Valid Range:
   * * Minimum value of 1
   * * Maximum value of 10
   *
   * @default 1
   */
  readonly parallelizationFactor?: number;

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
      bisectBatchOnFunctionError: this.props.bisectBatchOnFunctionError,
      startingPosition: this.props.startingPosition,
      maxBatchingWindow: this.props.maxBatchingWindow,
      maximumRecordAge: this.props.maximumRecordAge,
      maximumRetryAttempts: this.props.maximumRetryAttempts,
      parallelizationFactor: this.props.parallelizationFactor,
      destinationConfig: this.props.destinationConfig
    };
  }
}
