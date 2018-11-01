import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');

/**
 * An SNS topic as an event source for AWS Lambda function.
 *
 * To use:
 *
 *    lambda.addEventSource(new SnsEventSource(topic));
 *
 */
export class SnsEventSource implements lambda.IEventSource {
  constructor(readonly topic: sns.TopicRef) {
  }

  public bind(target: lambda.FunctionRef) {
    this.topic.subscribeLambda(target);
  }
}