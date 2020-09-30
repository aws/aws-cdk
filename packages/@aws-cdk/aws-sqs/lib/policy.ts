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

  constructor(scope: Construct, id: string, props: QueuePolicyProps) {
    super(scope, id);

    new CfnQueuePolicy(this, 'Resource', {
      policyDocument: this.document,
      queues: props.queues.map(q => q.queueUrl),
    });
  }
}
