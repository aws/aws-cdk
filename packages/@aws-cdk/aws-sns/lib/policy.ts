import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct, Resource } from '@aws-cdk/core';
import { CfnTopicPolicy } from './sns.generated';
import { ITopic } from './topic-base';

export interface TopicPolicyProps {
  /**
   * The set of topics this policy applies to.
   */
  readonly topics: ITopic[];
}

/**
 * Applies a policy to SNS topics.
 */
export class TopicPolicy extends Resource {
  /**
   * The IAM policy document for this policy.
   */
  public readonly document = new PolicyDocument({
    // statements must be unique, so we use the statement index.
    // potantially SIDs can change as a result of order change, but this should
    // not have an impact on the policy evaluation.
    // https://docs.aws.amazon.com/sns/latest/dg/AccessPolicyLanguage_SpecialInfo.html
    assignSids: true
  });

  constructor(scope: Construct, id: string, props: TopicPolicyProps) {
    super(scope, id);

    new CfnTopicPolicy(this, 'Resource', {
      policyDocument: this.document,
      topics: props.topics.map(t => t.topicArn)
    });
  }
}
