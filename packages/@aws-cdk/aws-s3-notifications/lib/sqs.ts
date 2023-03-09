import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import { Annotations } from '@aws-cdk/core';
import { Construct } from 'constructs';

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
  public bind(_scope: Construct, bucket: s3.IBucket): s3.BucketNotificationDestinationConfig {
    this.queue.grantSendMessages(new iam.ServicePrincipal('s3.amazonaws.com', {
      conditions: {
        ArnLike: { 'aws:SourceArn': bucket.bucketArn },
      },
    }));

    // if this queue is encrypted, we need to allow S3 to read messages since that's how
    // it verifies that the notification destination configuration is valid.
    if (this.queue.encryptionMasterKey) {
      const statement = new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
        actions: ['kms:GenerateDataKey*', 'kms:Decrypt'],
        resources: ['*'],
      });
      const addResult = this.queue.encryptionMasterKey.addToResourcePolicy(statement, /* allowNoOp */ true);
      if (!addResult.statementAdded) {
        Annotations.of(this.queue.encryptionMasterKey).addWarning(`Can not change key policy of imported kms key. Ensure that your key policy contains the following permissions: \n${JSON.stringify(statement.toJSON(), null, 2)}`);
      }
    }

    return {
      arn: this.queue.queueArn,
      type: s3.BucketNotificationDestinationType.QUEUE,
      dependencies: [this.queue],
    };
  }

}
