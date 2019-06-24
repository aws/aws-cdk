import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct, Resource } from '@aws-cdk/core';
import { IQueue } from './queue-base';
import { CfnQueuePolicy } from './sqs.generated';

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

  constructor(scope: Construct, id: string, props: QueuePolicyProps) {
    super(scope, id);

    new CfnQueuePolicy(this, 'Resource', {
      policyDocument: this.document,
      queues: props.queues.map(q => q.queueUrl)
    });
  }
}
