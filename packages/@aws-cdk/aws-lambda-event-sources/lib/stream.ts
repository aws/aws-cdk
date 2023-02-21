import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';

/**
 * The set of properties for streaming event sources shared by
 * Dynamo, Kinesis and Kafka.
 */
export interface BaseStreamEventSourceProps{
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range:
   * * Minimum value of 1
   * * Maximum value of:
   *   * 1000 for `DynamoEventSource`
   *   * 10000 for `KinesisEventSource`, `ManagedKafkaEventSource` and `SelfManagedKafkaEventSource`
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
   * Maximum of Duration.minutes(5).
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html#invocation-eventsourcemapping-batching
   *
   * @default - Duration.seconds(0) for Kinesis, DynamoDB, and SQS event sources, Duration.millis(500) for MSK, self-managed Kafka, and Amazon MQ.
   */
  readonly maxBatchingWindow?: Duration;

  /**
   * If the stream event source mapping should be enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;
}

/**
 * The set of properties for streaming event sources shared by
 * Dynamo and Kinesis.
 */
export interface StreamEventSourceProps extends BaseStreamEventSourceProps {
  /**
   * If the function returns an error, split the batch in two and retry.
   *
   * @default false
   */
  readonly bisectBatchOnError?: boolean;

  /**
   * The maximum age of a record that Lambda sends to a function for processing.
   * Valid Range:
   * * Minimum value of 60 seconds
   * * Maximum value of 7 days
   *
   * @default - the retention period configured on the stream
   */
  readonly maxRecordAge?: Duration;

  /**
   * Maximum number of retry attempts
   * Valid Range:
   * * Minimum value of 0
   * * Maximum value of 10000
   *
   * @default - retry until the record expires
   */
  readonly retryAttempts?: number;

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
   * Allow functions to return partially successful responses for a batch of records.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html#services-ddb-batchfailurereporting
   *
   * @default false
   */
  readonly reportBatchItemFailures?: boolean;

  /**
   * The size of the tumbling windows to group records sent to DynamoDB or Kinesis
   * Valid Range: 0 - 15 minutes
   *
   * @default - None
   */
  readonly tumblingWindow?: Duration;

  /**
   * An Amazon SQS queue or Amazon SNS topic destination for discarded records.
   *
   * @default - discarded records are ignored
   */
  readonly onFailure?: lambda.IEventSourceDlq;

  /**
   * Add filter criteria option
   *
   * @default - None
   */
  readonly filters?: Array<{[key: string]: any}>;
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
      bisectBatchOnError: this.props.bisectBatchOnError,
      startingPosition: this.props.startingPosition,
      reportBatchItemFailures: this.props.reportBatchItemFailures,
      maxBatchingWindow: this.props.maxBatchingWindow,
      maxRecordAge: this.props.maxRecordAge,
      retryAttempts: this.props.retryAttempts,
      parallelizationFactor: this.props.parallelizationFactor,
      onFailure: this.props.onFailure,
      tumblingWindow: this.props.tumblingWindow,
      enabled: this.props.enabled,
      filters: this.props.filters,
    };
  }
}
