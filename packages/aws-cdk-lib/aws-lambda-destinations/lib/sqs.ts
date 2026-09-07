import type { Construct } from 'constructs';
import type * as lambda from '../../aws-lambda';
import type * as sqs from '../../aws-sqs';

/**
 * Use a SQS queue as a Lambda destination
 */
export class SqsDestination implements lambda.IDestination {
  constructor(private readonly queue: sqs.IQueue) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction, _options?: lambda.DestinationOptions): lambda.DestinationConfig {
    // deduplicated automatically
    this.queue.grantSendMessages(fn);

    return {
      destination: this.queue.queueArn,
    };
  }
}
