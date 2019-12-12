import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/core';

/**
 * Use a SNS topic as a Lambda destination
 */
export class SnsDestination implements lambda.IDestination {
  constructor(private readonly topic: sns.ITopic) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction): lambda.DestinationConfig {
    // deduplicated automatically
    this.topic.grantPublish(fn);

    return {
      destination: this.topic.topicArn
    };
  }
}
