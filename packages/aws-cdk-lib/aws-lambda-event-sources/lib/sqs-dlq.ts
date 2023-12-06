import { DlqDestinationConfig, IEventSourceDlq, IEventSourceMapping, IFunction } from '../../aws-lambda';
import * as sqs from '../../aws-sqs';

/**
 * An SQS dead letter queue destination configuration for a Lambda event source
 */
export class SqsDlq implements IEventSourceDlq {
  private readonly _queue: sqs.IQueue;
  constructor(queue: sqs.ICfnQueue) {
    this._queue = sqs.Queue.fromCfnQueue(queue);
  }

  /**
   * Returns a destination configuration for the DLQ
   */
  public bind(_target: IEventSourceMapping, targetHandler: IFunction): DlqDestinationConfig {
    this._queue.grantSendMessages(targetHandler);

    return {
      destination: this._queue.attrArn,
    };
  }
}
