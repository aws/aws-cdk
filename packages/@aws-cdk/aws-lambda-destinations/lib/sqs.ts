import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from 'constructs';

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
