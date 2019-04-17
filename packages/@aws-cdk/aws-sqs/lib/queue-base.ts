import autoscaling_api = require('@aws-cdk/aws-autoscaling-api');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3n = require('@aws-cdk/aws-s3-notifications');
import { IResource, Resource } from '@aws-cdk/cdk';
import { QueuePolicy } from './policy';

export interface IQueue extends IResource, s3n.IBucketNotificationDestination, autoscaling_api.ILifecycleHookTarget {
  /**
   * The ARN of this queue
   */
  readonly queueArn: string;

  /**
   * The URL of this queue
   */
  readonly queueUrl: string;

  /**
   * The name of this queue
   */
  readonly queueName: string;

  /**
   * If this queue is server-side encrypted, this is the KMS encryption key.
   */
  readonly encryptionMasterKey?: kms.IEncryptionKey;

  /**
   * Export a queue
   */
  export(): QueueImportProps;

  /**
   * Adds a statement to the IAM resource policy associated with this queue.
   *
   * If this queue was created in this stack (`new Queue`), a queue policy
   * will be automatically created upon the first call to `addToPolicy`. If
   * the queue is improted (`Queue.import`), then this is a no-op.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): void;

  /**
   * Grant permissions to consume messages from a queue
   *
   * This will grant the following permissions:
   *
   *   - sqs:ChangeMessageVisibility
   *   - sqs:ChangeMessageVisibilityBatch
   *   - sqs:DeleteMessage
   *   - sqs:ReceiveMessage
   *   - sqs:DeleteMessageBatch
   *   - sqs:GetQueueAttributes
   *   - sqs:GetQueueUrl
   *
   * @param grantee Principal to grant consume rights to
   */
  grantConsumeMessages(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant access to send messages to a queue to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - sqs:SendMessage
   *  - sqs:SendMessageBatch
   *  - sqs:GetQueueAttributes
   *  - sqs:GetQueueUrl
   *
   * @param grantee Principal to grant send rights to
   */
  grantSendMessages(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant an IAM principal permissions to purge all messages from the queue.
   *
   * This will grant the following permissions:
   *
   *  - sqs:PurgeQueue
   *  - sqs:GetQueueAttributes
   *  - sqs:GetQueueUrl
   *
   * @param grantee Principal to grant send rights to
   */
  grantPurge(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the actions defined in queueActions to the identity Principal given
   * on this SQS queue resource.
   *
   * @param grantee Principal to grant right to
   * @param queueActions The actions to grant
   */
  grant(grantee: iam.IGrantable, ...queueActions: string[]): iam.Grant;
}

/**
 * Reference to a new or existing Amazon SQS queue
 */
export abstract class QueueBase extends Resource implements IQueue {

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
  public abstract readonly encryptionMasterKey?: kms.IEncryptionKey;

  /**
   * Controls automatic creation of policy objects.
   *
   * Set by subclasses.
   */
  protected abstract readonly autoCreatePolicy: boolean;

  private policy?: QueuePolicy;

  /**
   * The set of S3 bucket IDs that are allowed to send notifications to this queue.
   */
  private readonly notifyingBuckets = new Set<string>();

  /**
   * Export a queue
   */
  public abstract export(): QueueImportProps;

  /**
   * Adds a statement to the IAM resource policy associated with this queue.
   *
   * If this queue was created in this stack (`new Queue`), a queue policy
   * will be automatically created upon the first call to `addToPolicy`. If
   * the queue is improted (`Queue.import`), then this is a no-op.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement) {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new QueuePolicy(this, 'Policy', { queues: [ this ] });
    }

    if (this.policy) {
      this.policy.document.addStatement(statement);
    }
  }

  /**
   * Allows using SQS queues as destinations for bucket notifications.
   * Use `bucket.onEvent(event, queue)` to subscribe.
   * @param bucketArn The ARN of the notifying bucket.
   * @param bucketId A unique ID for the notifying bucket.
   */
  public asBucketNotificationDestination(bucketArn: string, bucketId: string): s3n.BucketNotificationDestinationProps {
    if (!this.notifyingBuckets.has(bucketId)) {
      this.addToResourcePolicy(new iam.PolicyStatement()
        .addServicePrincipal('s3.amazonaws.com')
        .addAction('sqs:SendMessage')
        .addResource(this.queueArn)
        .addCondition('ArnLike', { 'aws:SourceArn': bucketArn }));

      // if this queue is encrypted, we need to allow S3 to read messages since that's how
      // it verifies that the notification destination configuration is valid.
      // by setting allowNoOp to false, we ensure that only custom keys that we can actually
      // control access to can be used here as described in:
      // https://docs.aws.amazon.com/AmazonS3/latest/dev/ways-to-add-notification-config-to-bucket.html
      if (this.encryptionMasterKey) {
        this.encryptionMasterKey.addToResourcePolicy(new iam.PolicyStatement()
          .addServicePrincipal('s3.amazonaws.com')
          .addAction('kms:GenerateDataKey')
          .addAction('kms:Decrypt')
          .addAllResources(), /* allowNoOp */ false);
      }

      this.notifyingBuckets.add(bucketId);
    }

    return {
      arn: this.queueArn,
      type: s3n.BucketNotificationDestinationType.Queue,
      dependencies: [ this.policy! ]
    };
  }

  /**
   * Allow using SQS queues as lifecycle hook targets
   */
  public asLifecycleHookTarget(lifecycleHook: autoscaling_api.ILifecycleHook): autoscaling_api.LifecycleHookTargetProps {
    this.grantSendMessages(lifecycleHook.role);
    return { notificationTargetArn: this.queueArn };
  }

  /**
   * Grant permissions to consume messages from a queue
   *
   * This will grant the following permissions:
   *
   *   - sqs:ChangeMessageVisibility
   *   - sqs:ChangeMessageVisibilityBatch
   *   - sqs:DeleteMessage
   *   - sqs:ReceiveMessage
   *   - sqs:DeleteMessageBatch
   *   - sqs:GetQueueAttributes
   *   - sqs:GetQueueUrl
   *
   * @param grantee Principal to grant consume rights to
   */
  public grantConsumeMessages(grantee: iam.IGrantable) {
    return this.grant(grantee,
      'sqs:ReceiveMessage',
      'sqs:ChangeMessageVisibility',
      'sqs:ChangeMessageVisibilityBatch',
      'sqs:GetQueueUrl',
      'sqs:DeleteMessage',
      'sqs:DeleteMessageBatch',
      'sqs:GetQueueAttributes');
  }

  /**
   * Grant access to send messages to a queue to the given identity.
   *
   * This will grant the following permissions:
   *
   *  - sqs:SendMessage
   *  - sqs:SendMessageBatch
   *  - sqs:GetQueueAttributes
   *  - sqs:GetQueueUrl
   *
   * @param grantee Principal to grant send rights to
   */
  public grantSendMessages(grantee: iam.IGrantable) {
    return this.grant(grantee,
      'sqs:SendMessage',
      'sqs:SendMessageBatch',
      'sqs:GetQueueAttributes',
      'sqs:GetQueueUrl');
  }

  /**
   * Grant an IAM principal permissions to purge all messages from the queue.
   *
   * This will grant the following permissions:
   *
   *  - sqs:PurgeQueue
   *  - sqs:GetQueueAttributes
   *  - sqs:GetQueueUrl
   *
   * @param grantee Principal to grant send rights to
   */
  public grantPurge(grantee: iam.IGrantable) {
    return this.grant(grantee,
      'sqs:PurgeQueue',
      'sqs:GetQueueAttributes',
      'sqs:GetQueueUrl');
  }

  /**
   * Grant the actions defined in queueActions to the identity Principal given
   * on this SQS queue resource.
   *
   * @param grantee Principal to grant right to
   * @param actions The actions to grant
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions,
      resourceArns: [this.queueArn],
      resource: this,
    });
  }
}

/**
 * Reference to a queue
 */
export interface QueueImportProps {
  /**
   * The ARN of the queue.
   */
  readonly queueArn: string;

  /**
   * The URL of the queue.
   */
  readonly queueUrl: string;

  /**
   * The name of the queue.
   * @default if queue name is not specified, the name will be derived from the queue ARN
   */
  readonly queueName?: string;

  /**
   * KMS encryption key, if this queue is server-side encrypted by a KMS key.
   */
  readonly keyArn?: string;
}
