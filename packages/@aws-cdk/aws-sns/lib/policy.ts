import { Construct, IDependable, PolicyDocument } from '@aws-cdk/cdk';
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
export class TopicPolicy extends Construct implements IDependable {
  /**
   * The IAM policy document for this policy.
   */
  public readonly document = new PolicyDocument();

  /**
   * Allows topic policy to be added as a dependency.
   */
  public readonly dependencyElements = new Array<IDependable>();

  constructor(parent: Construct, name: string, props: TopicPolicyProps) {
    super(parent, name);

    const resource = new cloudformation.TopicPolicyResource(this, 'Resource', {
      policyDocument: this.document,
      topics: props.topics.map(t => t.topicArn)
    });

    this.dependencyElements.push(resource);
  }
}
