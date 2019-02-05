import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/cdk';
import { IQueue } from './queue-ref';
import { CfnQueuePolicy } from './sqs.generated';

export interface QueuePolicyProps {
  /**
   * The set of queues this policy applies to.
   */
  queues: IQueue[];
}

/**
 * Applies a policy to SQS queues.
 */
export class QueuePolicy extends Construct {
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
