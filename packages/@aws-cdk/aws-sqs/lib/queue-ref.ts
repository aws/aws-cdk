import { Construct, Output, PolicyStatement, Token } from '@aws-cdk/cdk';
import { QueuePolicy } from './policy';
import { QueueArn } from './sqs.generated';

/**
 * Reference to a new or existing Amazon SQS queue
 */
export abstract class QueueRef extends Construct {
    /**
     * Import an existing queue
     */
    public static import(parent: Construct, name: string, props: QueueRefProps) {
        new ImportedQueue(parent, name, props);
    }

    /**
     * The ARN of this queue
     */
    public abstract readonly queueArn: QueueArn;

    /**
     * The URL of this queue
     */
    public abstract readonly queueUrl: QueueUrl;

    /**
     * Controls automatic creation of policy objects.
     *
     * Set by subclasses.
     */
    protected abstract readonly autoCreatePolicy: boolean;

    private policy?: QueuePolicy;

    /**
     * Export a queue
     */
    public export(): QueueRefProps {
        return {
            queueArn: new Output(this, 'QueueArn', { value: this.queueArn }).makeImportValue(),
            queueUrl: new Output(this, 'QueueUrl', { value: this.queueUrl }).makeImportValue(),
        };
    }

    /**
     * Adds a statement to the IAM resource policy associated with this queue.
     *
     * If this queue was created in this stack (`new Queue`), a queue policy
     * will be automatically created upon the first call to `addToPolicy`. If
     * the queue is improted (`Queue.import`), then this is a no-op.
     */
    public addToResourcePolicy(statement: PolicyStatement) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new QueuePolicy(this, 'Policy', { queues: [ this ] });
        }

        if (this.policy) {
            this.policy.document.addStatement(statement);
        }
    }

}

/**
 * Reference to a queue
 */
export interface QueueRefProps {
    queueArn: QueueArn;
    queueUrl: QueueUrl;
}

/**
 * A queue that has been imported
 */
class ImportedQueue extends QueueRef {
    public readonly queueArn: QueueArn;
    public readonly queueUrl: QueueUrl;

    protected readonly autoCreatePolicy = false;

    constructor(parent: Construct, name: string, props: QueueRefProps) {
        super(parent, name);
        this.queueArn = props.queueArn;
        this.queueUrl = props.queueUrl;
    }
}

/**
 * URL of a queue
 */
export class QueueUrl extends Token {
}
