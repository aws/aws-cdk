import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { Duration, Names, Token } from '@aws-cdk/core';

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
   *
   * import * as sources from '@aws-cdk/aws-lambda-event-sources';
   * declare const fooQueue: sqs.IQueue
   * new sources.SqsEventSource(fooQueue, {
   *   filterPatterns: [
   *     { body: { balance: [ { numeric: [ '>', 500 ] } ] } }
   *   ]
   * });
   */
  readonly filterPatterns?: lambda.FilterPattern[];
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
    if ((this.props.filterPatterns?.length ?? 0) > 5) {
      throw new Error(`Maximum number of filter criteria for a single event source is five (given ${this.props.filterPatterns?.length}).`);
    }
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`SqsEventSource:${Names.nodeUniqueId(this.queue.node)}`, {
      batchSize: this.props.batchSize,
      maxBatchingWindow: this.props.maxBatchingWindow,
      reportBatchItemFailures: this.props.reportBatchItemFailures,
      enabled: this.props.enabled,
      eventSourceArn: this.queue.queueArn,
      filterPatterns: this.props.filterPatterns,
    });
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    this.queue.grantConsumeMessages(target);
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
