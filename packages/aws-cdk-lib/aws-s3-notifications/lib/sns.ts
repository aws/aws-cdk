import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as sns from '../../aws-sns';

/**
 * Use an SNS topic as a bucket notification destination
 */
export class SnsDestination implements s3.IBucketNotificationDestination {
  private readonly _topic: sns.ITopic;

  constructor(topic: sns.ICfnTopic) {
    this._topic = sns.Topic.fromCfnTopic(topic);
  }

  public bind(_scope: Construct, bucket: s3.ICfnBucket): s3.BucketNotificationDestinationConfig {
    this._topic.addToResourcePolicy(new iam.PolicyStatement({
      principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
      actions: ['sns:Publish'],
      resources: [this._topic.attrTopicArn],
      conditions: {
        ArnLike: { 'aws:SourceArn': bucket.attrArn },
      },
    }));

    return {
      arn: this._topic.attrTopicArn,
      type: s3.BucketNotificationDestinationType.TOPIC,
      dependencies: [this._topic], // make sure the topic policy resource is created before the notification config
    };
  }
}
