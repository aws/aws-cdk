import * as lambda from '@aws-cdk/aws-lambda';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';

/**
 * Properties forwarded to the Lambda Subscription.
 */
export interface SnsEventSourceProps extends subs.LambdaSubscriptionProps {
}

/**
 * Use an Amazon SNS topic as an event source for AWS Lambda.
 */
export class SnsEventSource implements lambda.IEventSource {
  private readonly props?: SnsEventSourceProps;

  constructor(readonly topic: sns.ITopic, props?: SnsEventSourceProps) {
    this.props = props;
  }

  public bind(target: lambda.IFunction) {
    this.topic.addSubscription(new subs.LambdaSubscription(target, this.props));
  }
}
