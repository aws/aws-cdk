import kms = require('@aws-cdk/aws-kms');
import s3n = require('@aws-cdk/aws-s3-notifications');
import cdk = require('@aws-cdk/cdk');
import { QueuePolicy } from './policy';

/**
 * Reference to a new or existing Amazon SQS queue
 */
export abstract class QueueRef extends cdk.Construct implements s3n.IBucketNotificationDestination {
  /**
   * Import an existing queue
   */
  public static import(parent: cdk.Construct, name: string, props: QueueRefProps) {
    new ImportedQueue(parent, name, props);
  }

  /**
   * The ARN of this queue
   */
  public abstract readonly queueArn: string;

  /**
   * The URL of this queue
   */
  public abstract readonly queueUrl: string;

  /**
   * If this queue is server-side encrypted, this is the KMS encryption key.
   */
  public abstract readonly encryptionMasterKey?: kms.EncryptionKeyRef;

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
  public export(): QueueRefProps {
    return {
      queueArn: new cdk.Output(this, 'QueueArn', { value: this.queueArn }).makeImportValue().toString(),
      queueUrl: new cdk.Output(this, 'QueueUrl', { value: this.queueUrl }).makeImportValue().toString(),
      keyArn: this.encryptionMasterKey
        ? new cdk.Output(this, 'KeyArn', { value: this.encryptionMasterKey.keyArn }).makeImportValue().toString()
        : undefined
    };
  }

  /**
   * Adds a statement to the IAM resource policy associated with this queue.
   *
   * If this queue was created in this stack (`new Queue`), a queue policy
   * will be automatically created upon the first call to `addToPolicy`. If
   * the queue is improted (`Queue.import`), then this is a no-op.
   */
  public addToResourcePolicy(statement: cdk.PolicyStatement) {
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
      this.addToResourcePolicy(new cdk.PolicyStatement()
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
        this.encryptionMasterKey.addToResourcePolicy(new cdk.PolicyStatement()
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
}

/**
 * Reference to a queue
 */
export interface QueueRefProps {
  /**
   * The ARN of the queue.
   */
  queueArn: string;

  /**
   * The URL of the queue.
   */
  queueUrl: string;

  /**
   * KMS encryption key, if this queue is server-side encrypted by a KMS key.
   */
  keyArn?: string;
}

/**
 * A queue that has been imported
 */
class ImportedQueue extends QueueRef {
  public readonly queueArn: string;
  public readonly queueUrl: string;
  public readonly encryptionMasterKey?: kms.EncryptionKeyRef;

  protected readonly autoCreatePolicy = false;

  constructor(parent: cdk.Construct, name: string, props: QueueRefProps) {
    super(parent, name);
    this.queueArn = props.queueArn;
    this.queueUrl = props.queueUrl;

    if (props.keyArn) {
      this.encryptionMasterKey = kms.EncryptionKey.import(this, 'Key', {
        keyArn: props.keyArn
      });
    }
  }
}
