import sns = require('@aws-cdk/aws-sns');
import subs = require('@aws-cdk/aws-sns-subscribers');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

export interface %name.PascalCased%Props {
  /**
   * The visibility timeout to be configured on the SQS Queue, in seconds.
   *
   * @default 300
   */
  visibilityTimeout?: number;
}

export class %name.PascalCased% extends cdk.Construct {
  /** @returns the ARN of the SQS queue */
  public readonly queueArn: string;

  constructor(scope: cdk.Construct, id: string, props: %name.PascalCased%Props = {}) {
    super(scope, id);

    const queue = new sqs.Queue(this, '%name.PascalCased%Queue', {
      visibilityTimeoutSec: props.visibilityTimeout || 300
    });

    const topic = new sns.Topic(this, '%name.PascalCased%Topic');

    topic.subscribe(new subs.SqsSubscriber(queue));

    this.queueArn = queue.queueArn;
  }
}
