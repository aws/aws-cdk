import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');

/**
 * Use a SQS queue as a Lambda destination
 */
export class SqsQueue implements lambda.IDestination {
  constructor(private readonly queue: sqs.IQueue) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(fn: lambda.IFunction): lambda.DestinationConfig {
    // deduplicated automatically
    this.queue.grantSendMessages(fn);

    return {
      destination: this.queue.queueArn
    };
  }
}
