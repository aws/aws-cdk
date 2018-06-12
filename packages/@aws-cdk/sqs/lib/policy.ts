import { Construct, PolicyDocument } from '@aws-cdk/core';
import { sqs } from '@aws-cdk/resources';
import { QueueRef } from './queue-ref';

export interface QueuePolicyProps {
    /**
     * The set of queues this policy applies to.
     */
    queues: QueueRef[];
}

/**
 * Applies a policy to SQS queues.
 */
export class QueuePolicy extends Construct {
    /**
     * The IAM policy document for this policy.
     */
    public readonly document = new PolicyDocument();

    constructor(parent: Construct, name: string, props: QueuePolicyProps) {
        super(parent, name);

        new sqs.QueuePolicyResource(this, 'Resource', {
            policyDocument: this.document,
            queues: props.queues.map(q => q.queueUrl)
        });
    }
}
