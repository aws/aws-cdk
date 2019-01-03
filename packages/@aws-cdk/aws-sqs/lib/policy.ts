import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct, IDependable } from '@aws-cdk/cdk';
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
export class QueuePolicy extends Construct implements IDependable {
  /**
   * The IAM policy document for this policy.
   */
  public readonly document = new PolicyDocument();

  /**
   * Allows adding QueuePolicy as a dependency.
   */
  public readonly dependencyElements = new Array<IDependable>();

  constructor(scope: Construct, id: string, props: QueuePolicyProps) {
    super(scope, id);

    const resource = new CfnQueuePolicy(this, 'Resource', {
      policyDocument: this.document,
      queues: props.queues.map(q => q.queueUrl)
    });

    this.dependencyElements.push(resource);
  }
}
