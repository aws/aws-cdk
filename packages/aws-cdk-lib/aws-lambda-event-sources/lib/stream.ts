import { S3OnFailureDestination } from './s3-onfailuire-destination';
import { IKey } from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import { Duration } from '../../core';

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

  /**
   * Configuration for provisioned pollers that read from the event source.
   * When specified, allows control over the minimum and maximum number of pollers
   * that can be provisioned to process events from the source.
   * @default - no provisioned pollers
   */
  readonly provisionedPollerConfig?: ProvisionedPollerConfig;
}

/**
 * (Amazon MSK and self-managed Apache Kafka only) The provisioned mode configuration for the event source.
 */
export interface ProvisionedPollerConfig {
  /**
   * The minimum number of pollers that should be provisioned.
   *
   * @default 1
   */
  readonly minimumPollers: number;
  /**
   * The maximum number of pollers that can be provisioned.
   *
   * @default 200
   */
  readonly maximumPollers: number;
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
   * The default value is -1, which sets the maximum age to infinite.
   * When the value is set to infinite, Lambda never discards old records.
   * Record are valid until it expires in the event source.
   *
   * @default -1
   */
  readonly maxRecordAge?: Duration;

  /**
   * Maximum number of retry attempts
   * Valid Range:
   * * Minimum value of 0
   * * Maximum value of 10000
   *
   * The default value is -1, which sets the maximum number of retries to infinite.
   * When MaximumRetryAttempts is infinite, Lambda retries failed records until
   * the record expires in the event source.
   *
   * @default -1
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

  /**
   * Add Customer managed KMS key to encrypt Filter Criteria.
   * @see https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html
   * By default, Lambda will encrypt Filter Criteria using AWS managed keys
   * @see https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-managed-cmk
   *
   * @default - none
   */
  readonly filterEncryption?: IKey;

  /**
   * Configuration for enhanced monitoring metrics collection
   * When specified, enables collection of additional metrics for the stream event source
   *
   * @default - Enhanced monitoring is disabled
   */
  readonly metricsConfig?: lambda.MetricsConfig;
}

/**
 * Use an stream as an event source for AWS Lambda.
 */
export abstract class StreamEventSource implements lambda.IEventSource {
  protected constructor(protected readonly props: StreamEventSourceProps) {
    if (props.provisionedPollerConfig) {
      const { minimumPollers, maximumPollers } = props.provisionedPollerConfig;
      if (minimumPollers != undefined) {
        if (minimumPollers < 1 || minimumPollers > 200) {
          throw new Error('Minimum provisioned pollers must be between 1 and 200 inclusive');
        }
      }
      if (maximumPollers != undefined) {
        if (maximumPollers < 1 || maximumPollers > 2000) {
          throw new Error('Maximum provisioned pollers must be between 1 and 2000 inclusive');
        }
      }
      if (minimumPollers != undefined && maximumPollers != undefined) {
        if (minimumPollers > maximumPollers) {
          throw new Error('Minimum provisioned pollers must be less than or equal to maximum provisioned pollers');
        }
      }
    }
  }

  public abstract bind(_target: lambda.IFunction): void;

  protected enrichMappingOptions(options: lambda.EventSourceMappingOptions): lambda.EventSourceMappingOptions {
    // check if this event source support S3 as OnFailure, currently only kakfa source are supported
    if (this.props.onFailure instanceof S3OnFailureDestination && !options.supportS3OnFailureDestination) {
      throw new Error('S3 onFailure Destination is not supported for this event source');
    }
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
      filterEncryption: this.props.filterEncryption,
    };
  }
}
