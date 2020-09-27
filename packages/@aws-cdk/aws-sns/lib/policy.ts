import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct, Resource } from '@aws-cdk/core';
import { CfnTopicPolicy } from './sns.generated';
import { ITopic } from './topic-base';

/**
 * Properties to associate SNS topics with a policy
 */
export interface TopicPolicyProps {
  /**
   * The set of topics this policy applies to.
   */
  readonly topics: ITopic[];
  /**
   * IAM policy document to apply to topic(s).
   */
  readonly policyDocument: PolicyDocument;

}

/**
 * Applies a policy to SNS topics.
 */
export class TopicPolicy extends Resource {
  /**
   * The IAM policy document for this policy.
   */
  public readonly document: PolicyDocument;

  constructor(scope: Construct, id: string, props: TopicPolicyProps) {
    super(scope, id);

    this.document = props.policyDocument;

    new CfnTopicPolicy(this, 'Resource', {
      policyDocument: props.policyDocument,
      topics: props.topics.map(t => t.topicArn),
    });
  }
}
