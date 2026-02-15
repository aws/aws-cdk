import type { IConstruct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import type { IMixin } from '../../core';
import { Token } from 'aws-cdk-lib/core';
import { UnscopedValidationError } from 'aws-cdk-lib/core/lib/errors';
import type { IQueueRef } from 'aws-cdk-lib/aws-sqs/lib/sqs.generated';

/**
 * Dead letter queue settings
 */
export interface DeadLetterQueue {
  readonly queue: IQueueRef;
  readonly maxReceiveCount: number;
}

/**
 * Queue-specific mixin for redrive policy
 * @mixin true
 */
export class RedrivePolicyMixin implements IMixin {
  constructor(private readonly deadLetterQueue: DeadLetterQueue) {}

  public supports(construct: IConstruct): construct is sqs.CfnQueue {
    return sqs.CfnQueue.isCfnQueue(construct);
  }

  public applyTo(construct: IConstruct): void {
    const queue = construct as sqs.CfnQueue;
    queue.redrivePolicy = {
      deadLetterTargetArn: this.deadLetterQueue.queue.queueRef.queueArn,
      maxReceiveCount: this.deadLetterQueue.maxReceiveCount,
    };
  }
}

/**
 * Permission settings for the dead letter source queue
 */
export interface RedriveAllowPolicy {
  readonly redrivePermission?: sqs.RedrivePermission;
  readonly sourceQueues?: IQueueRef[];
}

/**
 * Queue-specific mixin for redrive permissions
 * @mixin true
 */
export class RedriveAllowPolicyMixin implements IMixin {
  private readonly redriveAllowPolicy: RedriveAllowPolicy;

  constructor(redriveAllowPolicy: RedriveAllowPolicy) {
    this.redriveAllowPolicy = redriveAllowPolicy;
    this.validateRedriveAllowPolicy();
  }

  public supports(construct: IConstruct): construct is sqs.CfnQueue {
    return sqs.CfnQueue.isCfnQueue(construct);
  }

  public applyTo(construct: IConstruct): void {
    const queue = construct as sqs.CfnQueue;
    const redrivePermission = this.redriveAllowPolicy.redrivePermission
      ?? (this.redriveAllowPolicy.sourceQueues ? sqs.RedrivePermission.BY_QUEUE : sqs.RedrivePermission.ALLOW_ALL);

    queue.redriveAllowPolicy = {
      redrivePermission,
      sourceQueueArns: this.redriveAllowPolicy.sourceQueues?.map(q => q.queueRef.queueArn),
    };
  }

  private validateRedriveAllowPolicy(): void {
    const errors: string[] = [];
    const { redrivePermission, sourceQueues } = this.redriveAllowPolicy;

    // Rule 1: BY_QUEUE requires at least one source queue
    if (redrivePermission === sqs.RedrivePermission.BY_QUEUE && (!sourceQueues || sourceQueues.length === 0)) {
      errors.push("At least one source queue must be specified when redrivePermission is 'byQueue'");
    }

    // Rule 2: BY_QUEUE allows max 10 source queues
    if (redrivePermission === sqs.RedrivePermission.BY_QUEUE && sourceQueues && sourceQueues.length > 10) {
      errors.push("Up to 10 sourceQueues can be specified. Set redrivePermission to 'allowAll' to specify more");
    }

    // Rule 3: ALLOW_ALL and DENY_ALL cannot have sourceQueues
    if ((redrivePermission === sqs.RedrivePermission.ALLOW_ALL || redrivePermission === sqs.RedrivePermission.DENY_ALL) && sourceQueues) {
      errors.push("sourceQueues cannot be configured when redrivePermission is 'allowAll' or 'denyAll'");
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(`RedriveAllowPolicyMixin initialization failed due to following validation error(s):\n${errors.map(error => `- ${error}`).join('\n')}`);
    }
  }
}

/**
 * Queue-specific mixin for FIFO queue configuration.
 * @mixin true
 */
export class FifoMixin implements IMixin {
  private readonly fifoProps: sqs.QueueProps;
  private readonly isFifo: boolean;

  constructor(props: sqs.QueueProps) {
    this.fifoProps = props;
    this.isFifo = this.determineFifoQueue();
    this.validateProps();
  }

  private determineFifoQueue(): boolean {
    let isFifoQueue = this.fifoProps.fifo;
    const queueName = this.fifoProps.queueName;

    if (isFifoQueue === undefined && queueName && !Token.isUnresolved(queueName) && queueName.endsWith('.fifo')) {
      isFifoQueue = true;
    }
    if (isFifoQueue === undefined && this.fifoProps.contentBasedDeduplication) {
      isFifoQueue = true;
    }
    if (isFifoQueue === undefined && this.fifoProps.deduplicationScope) {
      isFifoQueue = true;
    }
    if (isFifoQueue === undefined && this.fifoProps.fifoThroughputLimit) {
      isFifoQueue = true;
    }
    return isFifoQueue ?? false;
  }

  /**
   * Validate mixin props at construction time
   */
  private validateProps(): void {
    const queueName = this.fifoProps.queueName;

    if (typeof queueName === 'string' && !Token.isUnresolved(queueName)) {
      if (this.isFifo && !queueName.endsWith('.fifo')) {
        throw new UnscopedValidationError("FIFO queue names must end in '.fifo'");
      }
      if (!this.isFifo && queueName.endsWith('.fifo')) {
        throw new UnscopedValidationError("Non-FIFO queue name may not end in '.fifo'");
      }
    }

    if (this.fifoProps.contentBasedDeduplication && !this.isFifo) {
      throw new UnscopedValidationError('Content-based deduplication can only be defined for FIFO queues');
    }

    if (this.fifoProps.deduplicationScope && !this.isFifo) {
      throw new UnscopedValidationError('Deduplication scope can only be defined for FIFO queues');
    }

    if (this.fifoProps.fifoThroughputLimit && !this.isFifo) {
      throw new UnscopedValidationError('FIFO throughput limit can only be defined for FIFO queues');
    }
  }

  /**
   * TODO : Need to check if returns are allowed or else will remove this mixin
   * Returns whether this is a FIFO queue (for L2 to expose)
   */
  // public get fifo(): boolean {
  //   return this.isFifo;
  // }

  public supports(construct: IConstruct): construct is sqs.CfnQueue {
    return sqs.CfnQueue.isCfnQueue(construct);
  }

  public applyTo(construct: IConstruct): void {
    const queue = construct as sqs.CfnQueue;

    // CFN  `AWS::SQS::Queue` does not accept `FifoQueue: false`. It must either be `true` or absent
    queue.fifoQueue = this.isFifo ? true : undefined;
    queue.contentBasedDeduplication = this.fifoProps.contentBasedDeduplication;
    queue.deduplicationScope = this.fifoProps.deduplicationScope;
    queue.fifoThroughputLimit = this.fifoProps.fifoThroughputLimit;
  }
}
