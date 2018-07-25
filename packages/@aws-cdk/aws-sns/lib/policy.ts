import { Construct, PolicyDocument } from '@aws-cdk/cdk';
import { cloudformation } from './sns.generated';
import { TopicRef } from './topic-ref';

export interface TopicPolicyProps {
    /**
     * The set of topics this policy applies to.
     */
    topics: TopicRef[];
}

/**
 * Applies a policy to SNS topics.
 */
export class TopicPolicy extends Construct {
    /**
     * The IAM policy document for this policy.
     */
    public readonly document = new PolicyDocument();

    constructor(parent: Construct, name: string, props: TopicPolicyProps) {
        super(parent, name);

        new cloudformation.TopicPolicyResource(this, 'Resource', {
            policyDocument: this.document,
            topics: props.topics.map(t => t.topicArn)
        });
    }
}
