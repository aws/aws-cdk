import { Construct, IDependable, PolicyDocument } from '@aws-cdk/cdk';
import { QueueRef } from './queue-ref';
import { cloudformation } from './sqs.generated';

export interface QueuePolicyProps {
  /**
   * The set of queues this policy applies to.
   */
  queues: QueueRef[];
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

  constructor(parent: Construct, name: string, props: QueuePolicyProps) {
    super(parent, name);

    const resource = new cloudformation.QueuePolicyResource(this, 'Resource', {
      policyDocument: this.document,
      queues: props.queues.map(q => q.queueUrl)
    });

    this.dependencyElements.push(resource);
  }
}
