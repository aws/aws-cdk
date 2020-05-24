import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';

/**
 * Use an Amazon SNS topic as an event source for AWS Lambda.
 */
export class SnsEventSource implements lambda.IEventSource {
  constructor(readonly topic: sns.ITopic) {
  }

  public bind(target: lambda.IFunction) {
    this.topic.addSubscription(new subs.LambdaSubscription(target));
  }
}
