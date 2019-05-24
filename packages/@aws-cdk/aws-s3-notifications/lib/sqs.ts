import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import sqs = require('@aws-cdk/aws-sqs');

/**
 * Use an SQS queue as a bucket notification destination
 */
export class SqsDestination implements s3.IBucketNotificationDestination {
  constructor(private readonly queue: sqs.IQueue) {
  }

  /**
   * Allows using SQS queues as destinations for bucket notifications.
   * Use `bucket.onEvent(event, queue)` to subscribe.
   */
  public bind(bucket: s3.IBucket): s3.BucketNotificationDestinationProps {
    this.queue.addToResourcePolicy(new iam.PolicyStatement()
      .addServicePrincipal('s3.amazonaws.com')
      .addAction('sqs:SendMessage')
      .addResource(this.queue.queueArn)
      .addCondition('ArnLike', { 'aws:SourceArn': bucket.bucketArn }));

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

    return {
      arn: this.queue.queueArn,
      type: s3.BucketNotificationDestinationType.Queue,
      dependencies: [ this.queue ]
    };
  }

}
