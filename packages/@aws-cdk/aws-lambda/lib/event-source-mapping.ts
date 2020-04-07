import * as cdk from '@aws-cdk/core';
import { IEventSourceDlq } from './dlq';
import { IFunction } from './function-base';
import { CfnEventSourceMapping } from './lambda.generated';

export interface EventSourceMappingOptions {
  /**
   * The Amazon Resource Name (ARN) of the event source. Any record added to
   * this stream can invoke the Lambda function.
   */
  readonly eventSourceArn: string;

  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range: Minimum value of 1. Maximum value of 10000.
   *
   * @default - Amazon Kinesis and Amazon DynamoDB is 100 records.
   * Both the default and maximum for Amazon SQS are 10 messages.
   */
  readonly batchSize?: number;

  /**
   * If the function returns an error, split the batch in two and retry.
   *
   * @default false
   */
  readonly bisectBatchOnError?: boolean;

  /**
   * An Amazon SQS queue or Amazon SNS topic destination for discarded records.
   *
   * @default discarded records are ignored
   */
  readonly onFailure?: IEventSourceDlq;

  /**
   * Set to false to disable the event source upon creation.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The position in the DynamoDB or Kinesis stream where AWS Lambda should
   * start reading.
   *
   * @see https://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html#Kinesis-GetShardIterator-request-ShardIteratorType
   *
   * @default - Required for Amazon Kinesis and Amazon DynamoDB Streams sources.
   */
  readonly startingPosition?: StartingPosition;

  /**
   * The maximum amount of time to gather records before invoking the function.
   * Maximum of Duration.minutes(5)
   *
   * @default Duration.seconds(0)
   */
  readonly maxBatchingWindow?: cdk.Duration;

  /**
   * The maximum age of a record that Lambda sends to a function for processing.
   * Valid Range:
   * * Minimum value of 60 seconds
   * * Maximum value of 7 days
   *
   * @default Duration.days(7)
   */
  readonly maxRecordAge?: cdk.Duration;

  /**
   * The maximum number of times to retry when the function returns an error.
   *
   * Valid Range:
   * * Minimum value of 0
   * * Maximum value of 10000
   *
   * @default 10000
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
}

/**
 * Properties for declaring a new event source mapping.
 */
export interface EventSourceMappingProps extends EventSourceMappingOptions {
  /**
   * The target AWS Lambda function.
   */
  readonly target: IFunction;
}

/**
 * Represents an event source mapping for a lambda function.
 * @see https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html
 */
export interface IEventSourceMapping extends cdk.IResource {
  /**
   * The identifier for this EventSourceMapping
   * @attribute
   */
  readonly eventSourceMappingId: string;
}

/**
 * Defines a Lambda EventSourceMapping resource.
 *
 * Usually, you won't need to define the mapping yourself. This will usually be done by
 * event sources. For example, to add an SQS event source to a function:
 *
 *    import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
 *    lambda.addEventSource(new SqsEventSource(sqs));
 *
 * The `SqsEventSource` class will automatically create the mapping, and will also
 * modify the Lambda's execution role so it can consume messages from the queue.
 */
export class EventSourceMapping extends cdk.Resource implements IEventSourceMapping {

  /**
   * Import an event source into this stack from its event source id.
   */
  public static fromEventSourceMappingId(scope: cdk.Construct, id: string, eventSourceMappingId: string): IEventSourceMapping {
    class Import extends cdk.Resource implements IEventSourceMapping {
      public readonly eventSourceMappingId = eventSourceMappingId;
    }
    return new Import(scope, id);
  }

  public readonly eventSourceMappingId: string;

  constructor(scope: cdk.Construct, id: string, props: EventSourceMappingProps) {
    super(scope, id);

    if (props.maxBatchingWindow && props.maxBatchingWindow.toSeconds() > 300) {
      throw new Error(`maxBatchingWindow cannot be over 300 seconds, got ${props.maxBatchingWindow.toSeconds()}`);
    }

    if (props.maxRecordAge && (props.maxRecordAge.toSeconds() < 60 || props.maxRecordAge.toDays({integral: false}) > 7)) {
      throw new Error('maxRecordAge must be between 60 seconds and 7 days inclusive');
    }

    if (props.retryAttempts && (props.retryAttempts < 0 || props.retryAttempts > 10000)) {
      throw new Error(`retryAttempts must be between 0 and 10000 inclusive, got ${props.retryAttempts}`);
    }

    if ((props.parallelizationFactor || props.parallelizationFactor === 0) && (props.parallelizationFactor < 1 || props.parallelizationFactor > 10)) {
      throw new Error(`parallelizationFactor must be between 1 and 10 inclusive, got ${props.parallelizationFactor}`);
    }

    let destinationConfig;

    if (props.onFailure) {
      destinationConfig = {
        onFailure: props.onFailure.bind(this, props.target)
      };
    }

    const cfnEventSourceMapping = new CfnEventSourceMapping(this, 'Resource', {
      batchSize: props.batchSize,
      bisectBatchOnFunctionError: props.bisectBatchOnError,
      destinationConfig,
      enabled: props.enabled,
      eventSourceArn: props.eventSourceArn,
      functionName: props.target.functionName,
      startingPosition: props.startingPosition,
      maximumBatchingWindowInSeconds: props.maxBatchingWindow?.toSeconds(),
      maximumRecordAgeInSeconds: props.maxRecordAge?.toSeconds(),
      maximumRetryAttempts: props.retryAttempts,
      parallelizationFactor: props.parallelizationFactor
    });
    this.eventSourceMappingId = cfnEventSourceMapping.ref;
  }
}

/**
 * The position in the DynamoDB or Kinesis stream where AWS Lambda should start
 * reading.
 */
export enum StartingPosition {
  /**
   * Start reading at the last untrimmed record in the shard in the system,
   * which is the oldest data record in the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',

  /**
   * Start reading just after the most recent record in the shard, so that you
   * always read the most recent data in the shard
   */
  LATEST = 'LATEST',
}
