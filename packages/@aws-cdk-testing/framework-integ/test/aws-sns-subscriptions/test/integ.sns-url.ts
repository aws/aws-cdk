import * as sns from 'aws-cdk-lib/aws-sns';
import * as cdk from 'aws-cdk-lib';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as integ from '@aws-cdk/integ-tests-alpha';

class SnsToUrlStack extends cdk.Stack {
  topic: sns.Topic;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.topic = new sns.Topic(this, 'MyTopic');

    this.topic.addSubscription(
      new subs.UrlSubscription(
        'https://foobar.com/',
        {
          deliveryPolicy: {
            healthyRetryPolicy: {
              minDelayTarget: cdk.Duration.seconds(20),
              maxDelayTarget: cdk.Duration.seconds(21),
              numRetries: 10,
            },
            throttlePolicy: {
              maxReceivesPerSecond: 10,
            },
            requestPolicy: {
              headerContentType: 'application/json',
            },
          },
        },
      ),
    );
  }
}

const app = new cdk.App();
const stack = new SnsToUrlStack(app, 'SnsToUrlStack');

new integ.IntegTest(app, 'cdk-integ', {
  testCases: [stack],
});
