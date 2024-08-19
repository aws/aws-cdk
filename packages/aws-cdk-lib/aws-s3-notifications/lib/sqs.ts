import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as sqs from '../../aws-sqs';
import { Annotations } from '../../core';

/**
 * Use an SQS queue as a bucket notification destination
 */
export class SqsDestination implements s3.IBucketNotificationDestination {

  /**
   * Should we need to add Global permission to `s3.awsamazon.com` service for all Buckets
   * NOTE : we can't restrict it to specific bucket, as it will create Circular Dependency mentioned below issues,
   * - https://github.com/aws/aws-cdk/issues/3067
   * - https://github.com/aws/aws-cdk/issues/18988
   */
  private readonly shouldAddGlobalS3PermissionToKMSandSQS : boolean

  constructor(private readonly queue: sqs.IQueue, shouldAddGlobalS3PermissionToKMSandSQS: boolean = true) {
    this.shouldAddGlobalS3PermissionToKMSandSQS = shouldAddGlobalS3PermissionToKMSandSQS;
  }

  /**
   * Allows using SQS queues as destinations for bucket notifications.
   * Use `bucket.onEvent(event, queue)` to subscribe.
   */
  public bind(_scope: Construct, _bucket: s3.IBucket): s3.BucketNotificationDestinationConfig {
    if (this.shouldAddGlobalS3PermissionToKMSandSQS) {
      // If user is okay to add global permission, we will add and show security warning
      this.queue.grantSendMessages(new iam.ServicePrincipal('s3.amazonaws.com'));

      const warning = 'Consider passing \`shouldAddGlobalS3PermissionToKMSandSQS:false\` and add restricted permission with condition - \'aws:SourceArn\': bucket.bucketArn';
      Annotations.of(_scope).addWarningV2('@aws-cdk/aws-s3-notifications:securityWarning', warning);
    } else {
      // If user didn't want this to be Global, then we will show CRITICAL warning calling out to add
      // the required permission without using imported values.
      const warning = 'You have opted out to add global permission for KMS & SQS Key Policy. Consider manually adding kms.grantEncryptDecrypt(), queue.grantSendMessages()';
      Annotations.of(_scope).addWarningV2('@aws-cdk/aws-s3-notifications:sqsKMSPermissionsNotAdded', warning);
    }

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
        Annotations.of(this.queue.encryptionMasterKey).addWarningV2('@aws-cdk/aws-s3-notifications:sqsKMSPermissionsNotAdded', `Can not change key policy of imported kms key. Ensure that your key policy contains the following permissions: \n${JSON.stringify(statement.toJSON(), null, 2)}`);
      }
    }

    return {
      arn: this.queue.queueArn,
      type: s3.BucketNotificationDestinationType.QUEUE,
      dependencies: [this.queue],
    };
  }

}
