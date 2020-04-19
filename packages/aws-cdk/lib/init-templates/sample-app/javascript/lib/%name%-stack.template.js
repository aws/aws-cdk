import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

class %name.PascalCased%Stack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, '%name.PascalCased%Queue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, '%name.PascalCased%Topic');

    topic.addSubscription(new subs.SqsSubscription(queue));
  }
}

module.exports = { %name.PascalCased%Stack }
