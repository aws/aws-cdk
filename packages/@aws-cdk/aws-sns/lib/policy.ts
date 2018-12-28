import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct, IDependable } from '@aws-cdk/cdk';
import { CfnTopicPolicy } from './sns.generated';
import { ITopic } from './topic-ref';

export interface TopicPolicyProps {
  /**
   * The set of topics this policy applies to.
   */
  topics: ITopic[];
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

  constructor(parent: Construct, id: string, props: TopicPolicyProps) {
    super(parent, id);

    const resource = new CfnTopicPolicy(this, 'Resource', {
      policyDocument: this.document,
      topics: props.topics.map(t => t.topicArn)
    });

    this.dependencyElements.push(resource);
  }
}
