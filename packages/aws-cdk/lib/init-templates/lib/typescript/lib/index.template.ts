import sns = require('@aws-cdk/aws-sns');
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
  public readonly queueArn: sqs.QueueArn;

  constructor(parent: cdk.Construct, name: string, props: %name.PascalCased%Props = {}) {
    super(parent, name);

    const queue = new sqs.Queue(this, '%name.PascalCased%Queue', {
      visibilityTimeoutSec: props.visibilityTimeout || 300
    });

    const topic = new sns.Topic(this, '%name.PascalCased%Topic');

    topic.subscribeQueue(queue);

    this.queueArn = queue.queueArn;
  }
}
