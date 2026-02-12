import type * as sqs from 'aws-cdk-lib/aws-sqs';
import type { Construct } from 'constructs';
import type * as iam from 'aws-cdk-lib/aws-iam';
import type { IQueueRef, QueueReference } from 'aws-cdk-lib/aws-sqs/lib/sqs.generated';
import { CfnQueue } from 'aws-cdk-lib/aws-sqs/lib/sqs.generated';
import { QueueGrants } from 'aws-cdk-lib/aws-sqs/lib/sqs-grants.generated';
import type { IResource, ResourceProps } from 'aws-cdk-lib/core';
import { Resource } from 'aws-cdk-lib/core';
import type * as kms from 'aws-cdk-lib/aws-kms';
import { KeyGrants } from 'aws-cdk-lib/aws-kms/lib/key-grants';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { IMixin } from '../../core';
import { RedrivePolicyMixin, RedriveAllowPolicyMixin, FifoMixin } from './queue-mixins';
import { CfnQueuePropsMixin } from './cfn-props-mixins.generated';

export interface IQueue2 extends IResource, IQueueRef {
  /**
   * The ARN of this queue
   * @attribute
   */
  readonly queueArn: string;

  /**
   * The URL of this queue
   * @attribute
   */
  readonly queueUrl: string;

  /**
   * The name of this queue
   * @attribute
   */
  readonly queueName: string;

  /**
   * If this queue is server-side encrypted, this is the KMS encryption key.
   */
  readonly encryptionMasterKey?: kms.IKeyRef;

  /**
   * Whether this queue is an Amazon SQS FIFO queue. If false, this is a standard queue.
   */
  //   readonly fifo: boolean;

  /**
   * Collection of grant methods for this queue
   */
  readonly grants: QueueGrants;

}

/**
 * Reference to a new or existing Amazon SQS queue
 */
export abstract class QueueBase2 extends Resource implements IQueue2 {
  /**
   * The ARN of this queue
   */
  public abstract readonly queueArn: string;

  /**
   * The URL of this queue
   */
  public abstract readonly queueUrl: string;

  /**
   * The name of this queue
   */
  public abstract readonly queueName: string;

  /**
   * If this queue is server-side encrypted, this is the KMS encryption key.
   */
  public abstract readonly encryptionMasterKey?: kms.IKeyRef;

  /**
   * Whether this queue is an Amazon SQS FIFO queue. If false, this is a standard queue.
   */
  // public abstract readonly fifo: boolean;

  /**
   * Collection of grant methods for a Queue
   */
  public readonly grants: QueueGrants;

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
    this.grants = QueueGrants.fromQueue(this);
  }

  public get queueRef(): QueueReference {
    return {
      queueUrl: this.queueUrl,
      queueArn: this.queueArn,
    };
  }

  public grantOnKey(grantee: iam.IGrantable, ...actions: string[]): iam.GrantOnKeyResult {
    const grant = this.encryptionMasterKey
      ? KeyGrants.fromKey(this.encryptionMasterKey).actions(grantee, ...actions)
      : undefined;
    return { grant };
  }
}

export class Queue2 extends QueueBase2 {
// TO-DO
//  public static fromQueueAttributes(scope: Construct, id: string, attrs: sqs.QueueAttributes): IQueue {
// }

  @memoizedGetter
  public get queueArn(): string {
    return this.getResourceArnAttribute(this.cfnQueue.attrArn, {
      service: 'sqs',
      resource: this.physicalName,
    });
  }

  @memoizedGetter
  public get queueName(): string {
    return this.getResourceNameAttribute(this.cfnQueue.attrQueueName);
  }

  /**
   * The URL of this queue
   */
  public readonly queueUrl: string;

  /**
   * If this queue is encrypted, this is the KMS key.
   */
  public readonly encryptionMasterKey?: kms.IKeyRef;

  /**
   * Whether this queue is an Amazon SQS FIFO queue. If false, this is a standard queue.
   */
  // public readonly fifo: boolean;

  private readonly cfnQueue: CfnQueue;

  constructor(scope: Construct, id: string, props: sqs.QueueProps = {}) {
    super(scope, id, {
      physicalName: props.queueName,
    });

    const queue = new CfnQueue(this, 'Resource', {
      queueName: this.physicalName,
    });

    this.cfnQueue = queue;
    this.queueUrl = queue.ref;
    this.encryptionMasterKey = props.encryptionMasterKey; // check

    const mixins: IMixin[] = [
      new CfnQueuePropsMixin({
        messageRetentionPeriod: props.retentionPeriod?.toSeconds(),
        delaySeconds: props.deliveryDelay?.toSeconds(),
        maximumMessageSize: props.maxMessageSizeBytes,
        visibilityTimeout: props.visibilityTimeout?.toSeconds(),
        receiveMessageWaitTimeSeconds: props.receiveMessageWaitTime?.toSeconds(),
      }),
      new FifoMixin(props),
    ];

    if (props.deadLetterQueue) {
      mixins.push(new RedrivePolicyMixin(props.deadLetterQueue));
    }

    if (props.redriveAllowPolicy) {
      mixins.push(new RedriveAllowPolicyMixin(props.redriveAllowPolicy));
    }

    mixins.forEach(mixin => mixin.applyTo(this.cfnQueue));
  }
}
