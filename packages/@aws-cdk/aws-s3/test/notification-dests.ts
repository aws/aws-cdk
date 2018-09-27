import s3notifications = require('@aws-cdk/aws-s3-notifications');
import cdk = require('@aws-cdk/cdk');

/**
 * Since we can't take a dependency on @aws-cdk/sns, this is a simple wrapper
 * for AWS::SNS::Topic which implements IBucketNotificationDestination.
 */
export class Topic extends cdk.Construct implements s3notifications.IBucketNotificationDestination {
  public readonly topicArn: string;
  private readonly policy = new cdk.PolicyDocument();
  private readonly notifyingBucketPaths = new Set<string>();

  constructor(parent: cdk.Construct, id: string) {
    super(parent, id);

    const resource = new cdk.Resource(this, 'Resource', { type: 'AWS::SNS::Topic' });
    const topicArn = resource.ref;

    new cdk.Resource(this, 'Policy', {
      type: 'AWS::SNS::TopicPolicy',
      properties: {
        Topics: [ topicArn ],
        PolicyDocument: this.policy
      }
    });

    this.topicArn = topicArn;
  }

  public asBucketNotificationDestination(bucketArn: string, bucketId: string): s3notifications.BucketNotificationDestinationProps {

    // add permission to each source bucket
    if (!this.notifyingBucketPaths.has(bucketId)) {
      this.policy.addStatement(new cdk.PolicyStatement()
        .describe(`sid${this.policy.statementCount}`)
        .addServicePrincipal('s3.amazonaws.com')
        .addAction('sns:Publish')
        .addResource(this.topicArn)
        .addCondition('ArnLike', { "aws:SourceArn": bucketArn }));
      this.notifyingBucketPaths.add(bucketId);
    }

    return {
      arn: this.topicArn,
      type: s3notifications.BucketNotificationDestinationType.Topic
    };
  }
}
