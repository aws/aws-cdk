import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');

/**
 * Use an Amazon SNS topic as an event source for AWS Lambda.
 */
export class SnsEventSource implements lambda.IEventSource {
  constructor(readonly topic: sns.TopicRef) {
  }

  public bind(target: lambda.FunctionRef) {
    this.topic.subscribeLambda(target);
  }
}