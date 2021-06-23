import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
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
   * @default empty policy document
   */
  readonly policyDocument?: PolicyDocument;

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
    assignSids: true,
  });

  constructor(scope: Construct, id: string, props: TopicPolicyProps) {
    super(scope, id);

    this.document = props.policyDocument ?? this.document;

    new CfnTopicPolicy(this, 'Resource', {
      policyDocument: this.document,
      topics: props.topics.map(t => t.topicArn),
    });
  }
}
