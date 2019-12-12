import lambda = require('@aws-cdk/aws-lambda');
import { Construct } from '@aws-cdk/core';

/**
 * Use a Lambda function as a Lambda destination
 */
export class LambdaDestination implements lambda.IDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction): lambda.DestinationConfig {
    // deduplicated automatically
    this.fn.grantInvoke(fn);

    return {
      destination: this.fn.functionArn
    };
  }
}
