import cdk = require('@aws-cdk/cdk');
import { Resource } from '@aws-cdk/cdk';
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
   * @default The default for Amazon Kinesis and Amazon DynamoDB is 100 records.
   * Both the default and maximum for Amazon SQS are 10 messages.
   */
  readonly batchSize?: number;

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
   */
  readonly startingPosition?: StartingPosition
}

export interface EventSourceMappingProps extends EventSourceMappingOptions {
  /**
   * The target AWS Lambda function.
   */
  readonly target: IFunction;
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
export class EventSourceMapping extends Resource {
  constructor(scope: cdk.Construct, id: string, props: EventSourceMappingProps) {
    super(scope, id);

    new CfnEventSourceMapping(this, 'Resource', {
      batchSize: props.batchSize,
      enabled: props.enabled,
      eventSourceArn: props.eventSourceArn,
      functionName: props.target.functionName,
      startingPosition: props.startingPosition,
    });
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
  TrimHorizon = 'TRIM_HORIZON',

  /**
   * Start reading just after the most recent record in the shard, so that you
   * always read the most recent data in the shard
   */
  Latest = 'LATEST',
}
