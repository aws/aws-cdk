import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from 'constructs';

/**
 * Use an SNS topic as a bucket notification destination
 */
export class SnsDestination implements s3.IBucketNotificationDestination {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, bucket: s3.IBucket): s3.BucketNotificationDestinationConfig {
    this.topic.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
      actions: ['sns:Publish'],
      resources: [this.topic.topicArn],
      conditions: {
        ArnLike: { 'aws:SourceArn': bucket.bucketArn },
      },
    }));

    return {
      arn: this.topic.topicArn,
      type: s3.BucketNotificationDestinationType.TOPIC,
      dependencies: [this.topic], // make sure the topic policy resource is created before the notification config
    };
  }
}
