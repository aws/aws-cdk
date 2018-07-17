import { Construct } from '@aws-cdk/cdk';
import { sqs } from '@aws-cdk/resources';
import { Topic } from '@aws-cdk/sns';
import { Queue } from '@aws-cdk/sqs';

export interface %name.PascalCased%Props {
    /**
     * The visibility timeout to be configured on the SQS Queue, in seconds.
     *
     * @default 300
     */
    visibilityTimeout?: number;
}

export class %name.PascalCased% extends Construct {
    /** @returns the ARN of the SQS queue */
    public readonly queueArn: sqs.QueueArn;

    constructor(parent: Construct, name: string, props: %name.PascalCased%Props = {}) {
        super(parent, name);

        const queue = new Queue(this, '%name.PascalCased%Queue', {
            visibilityTimeoutSec: props.visibilityTimeout || 300
        });

        const topic = new Topic(this, '%name.PascalCased%Topic');

        topic.subscribeQueue(queue);

        this.queueArn = queue.queueArn;
    }
}
