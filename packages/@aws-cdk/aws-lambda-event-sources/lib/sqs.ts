import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';

export interface SqsEventSourceProps {
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range: Minimum value of 1. Maximum value of 10.
   *
   * @default 10
   */
  readonly batchSize?: number;
}

/**
 * Use an Amazon SQS queue as an event source for AWS Lambda.
 */
export class SqsEventSource implements lambda.IEventSource {
  private _eventSourceMappingId: string | undefined = undefined;

  constructor(readonly queue: sqs.IQueue, private readonly props: SqsEventSourceProps = { }) {
    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 10)) {
      throw new Error(`Maximum batch size must be between 1 and 10 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.IFunction) {
    const eventSourceMapping = target.addEventSourceMapping(`SqsEventSource:${this.queue.node.uniqueId}`, {
      batchSize: this.props.batchSize,
      eventSourceArn: this.queue.queueArn,
    });
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    this.queue.grantConsumeMessages(target);
  }

  /**
   * The Ref of the EventSourceMapping
   */
  public get eventSourceMappingId(): string | undefined {
    return this._eventSourceMappingId;
  }
}
