import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as sns from '../../aws-sns';
import { Annotations, FeatureFlags } from '../../core';
import * as cxapi from '../../cx-api';

/**
 * Use an SNS topic as a bucket notification destination
 */
export class SnsDestination implements s3.IBucketNotificationDestination {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(scope: Construct, bucket: s3.IBucketRef): s3.BucketNotificationDestinationConfig {
    this.topic.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
      actions: ['sns:Publish'],
      resources: [this.topic.topicArn],
      conditions: {
        ArnLike: { 'aws:SourceArn': bucket.bucketRef.bucketArn },
      },
    }));

    const addKeyPolicy = FeatureFlags.of(scope).isEnabled(cxapi.S3_TRUST_KEY_POLICY_FOR_SNS_SUBSCRIPTIONS);
    if (addKeyPolicy && this.topic.masterKey) {
      const statement = new iam.PolicyStatement({
        principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
        actions: ['kms:GenerateDataKey', 'kms:Decrypt'],
        resources: ['*'],
      });
      const addResult = this.topic.masterKey.addToResourcePolicy(statement, true);
      if (!addResult.statementAdded) {
        Annotations.of(this.topic.masterKey).addWarningV2('@aws-cdk/aws-s3-notifications:snsKMSPermissionsNotAdded', `Can not change key policy of imported kms key. Ensure that your key policy contains the following permissions: \n${JSON.stringify(statement.toJSON(), null, 2)}`);
      }
    }

    return {
      arn: this.topic.topicArn,
      type: s3.BucketNotificationDestinationType.TOPIC,
      dependencies: [this.topic], // make sure the topic policy resource is created before the notification config
    };
  }
}
