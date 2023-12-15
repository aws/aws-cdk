import { Construct } from 'constructs';
import * as lambda from '../../aws-lambda';
import * as sqs from '../../aws-sqs';

/**
 * Use a SQS queue as a Lambda destination
 */
export class SqsDestination implements lambda.IDestination {
  private readonly _queue: sqs.IQueue;
  constructor(queue: sqs.ICfnQueue) {
    this._queue = sqs.Queue.fromCfnQueue(queue);
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction, _options?: lambda.DestinationOptions): lambda.DestinationConfig {
    // deduplicated automatically
    this._queue.grantSendMessages(fn);

    return {
      destination: this._queue.attrArn,
    };
  }
}
