import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { Duration, Names, Token, Annotations } from '@aws-cdk/core';

export interface SqsEventSourceProps {
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range: Minimum value of 1. Maximum value of 10.
   * If `maxBatchingWindow` is configured, this value can go up to 10,000.
   *
   * @default 10
   */
  readonly batchSize?: number;

  /**
   * The maximum amount of time to gather records before invoking the function.
   *
   * Valid Range: Minimum value of 0 minutes. Maximum value of 5 minutes.
   *
   * @default - no batching window. The lambda function will be invoked immediately with the records that are available.
   */
  readonly maxBatchingWindow?: Duration;

  /**
   * Allow functions to return partially successful responses for a batch of records.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#services-sqs-batchfailurereporting
   *
   * @default false
   */
  readonly reportBatchItemFailures?: boolean;

  /**
   * If the SQS event source mapping should be enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Add filter criteria option
   *
   * @default - None
   */
  readonly filters?: Array<{[key: string]: any}>;

  /**
   * The maximum concurrency setting limits the number of concurrent instances of the function that an Amazon SQS event source can invoke.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-max-concurrency
   *
   * Valid Range: Minimum value of 2. Maximum value of 1000.
   *
   * @default - No specific limit.
   */
  readonly maxConcurrency?: number;
}

/**
 * Use an Amazon SQS queue as an event source for AWS Lambda.
 */
export class SqsEventSource implements lambda.IEventSource {
  private _eventSourceMappingId?: string = undefined;

  constructor(readonly queue: sqs.IQueue, private readonly props: SqsEventSourceProps = { }) {
    if (this.props.maxBatchingWindow !== undefined) {
      if (queue.fifo) {
        throw new Error('Batching window is not supported for FIFO queues');
      }
      if (!this.props.maxBatchingWindow.isUnresolved() && this.props.maxBatchingWindow.toSeconds() > 300) {
        throw new Error(`Maximum batching window must be 300 seconds or less (given ${this.props.maxBatchingWindow.toHumanString()})`);
      }
    }
    if (this.props.batchSize !== undefined && !Token.isUnresolved(this.props.batchSize)) {
      if (this.props.maxBatchingWindow !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 10000)) {
        throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize}) when batching window is specified.`);
      }
      if (this.props.maxBatchingWindow === undefined && (this.props.batchSize < 1 || this.props.batchSize > 10)) {
        throw new Error(`Maximum batch size must be between 1 and 10 inclusive (given ${this.props.batchSize}) when batching window is not specified.`);
      }
    }
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`SqsEventSource:${Names.nodeUniqueId(this.queue.node)}`, {
      batchSize: this.props.batchSize,
      maxBatchingWindow: this.props.maxBatchingWindow,
      maxConcurrency: this.props.maxConcurrency,
      reportBatchItemFailures: this.props.reportBatchItemFailures,
      enabled: this.props.enabled,
      eventSourceArn: this.queue.queueArn,
      filters: this.props.filters,
    });
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    // only grant access if the lambda function has an IAM role
    // otherwise the IAM module will throw an error
    if (target.role) {
      this.queue.grantConsumeMessages(target);
    } else {
      Annotations.of(target).addWarning(`Function '${target.node.path}' was imported without an IAM role `+
        `so it was not granted access to consume messages from '${this.queue.node.path}'`);
    }
  }

  /**
   * The identifier for this EventSourceMapping
   */
  public get eventSourceMappingId(): string {
    if (!this._eventSourceMappingId) {
      throw new Error('SqsEventSource is not yet bound to an event source mapping');
    }
    return this._eventSourceMappingId;
  }
}
