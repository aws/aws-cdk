import type { Construct } from 'constructs';
import type * as lambda from '../../aws-lambda';
import type * as sns from '../../aws-sns';

/**
 * Use a SNS topic as a Lambda destination
 */
export class SnsDestination implements lambda.IDestination {
  constructor(private readonly topic: sns.ITopic) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction, _options?: lambda.DestinationOptions): lambda.DestinationConfig {
    // deduplicated automatically
    this.topic.grantPublish(fn);

    return {
      destination: this.topic.topicArn,
    };
  }
}
