import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IQueue } from './queue-base';
import { CfnQueuePolicy } from './sqs.generated';

/**
 * Properties to associate SQS queues with a policy
 */
export interface QueuePolicyProps {
  /**
   * The set of queues this policy applies to.
   */
  readonly queues: IQueue[];
}

/**
 * Applies a policy to SQS queues.
 */
export class QueuePolicy extends Resource {
  /**
   * The IAM policy document for this policy.
   */
  public readonly document = new PolicyDocument();

  /**
   * Not currently supported by AWS CloudFormation.
   * @attribute
   */
  public readonly queuePolicyId: string;

  constructor(scope: Construct, id: string, props: QueuePolicyProps) {
    super(scope, id);

    const resource = new CfnQueuePolicy(this, 'Resource', {
      policyDocument: this.document,
      queues: props.queues.map(q => q.queueUrl),
    });

    this.queuePolicyId = resource.attrId;
  }
}
