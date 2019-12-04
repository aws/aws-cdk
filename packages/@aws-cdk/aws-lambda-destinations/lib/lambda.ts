import lambda = require('@aws-cdk/aws-lambda');

/**
 * Use a Lambda function as a Lambda destination
 */
export class LambdaFunction implements lambda.IDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  /**
   * Returns a destination configuration
   */
  public bind(fn: lambda.IFunction): lambda.DestinationConfig {
    // deduplicated automatically
    this.fn.grantInvoke(fn);

    return {
      destination: this.fn.functionArn
    };
  }
}
