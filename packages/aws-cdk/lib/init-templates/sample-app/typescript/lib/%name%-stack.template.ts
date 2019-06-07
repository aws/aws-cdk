import sns = require('@aws-cdk/aws-sns');
const subs = require('@aws-cdk/aws-sns-subscribers');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

export class %name.PascalCased%Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, '%name.PascalCased%Queue', {
      visibilityTimeoutSec: 300
    });

    const topic = new sns.Topic(this, '%name.PascalCased%Topic');

    topic.subscribe(new subs.SqsSubscriber(queue));
  }
}
