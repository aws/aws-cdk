import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

/**
 * Since we can't take a dependency on @aws-cdk/sns, this is a simple wrapper
 * for AWS::SNS::Topic which implements IBucketNotificationDestination.
 */
export class Topic extends cdk.Construct implements s3.IBucketNotificationDestination {
  public readonly topicArn: string;
  private readonly policy = new iam.PolicyDocument();
  private readonly notifyingBucketPaths = new Set<string>();

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const resource = new cdk.CfnResource(this, 'Resource', { type: 'AWS::SNS::Topic' });
    const topicArn = resource.ref;

    new cdk.CfnResource(this, 'Policy', {
      type: 'AWS::SNS::TopicPolicy',
      properties: {
        Topics: [ topicArn ],
        PolicyDocument: this.policy
      }
    });

    this.topicArn = topicArn;
  }

  public bind(bucket: s3.IBucket): s3.BucketNotificationDestinationProps {

    // add permission to each source bucket
    if (!this.notifyingBucketPaths.has(bucket.bucketId)) {
      this.policy.addStatement(new iam.PolicyStatement()
        .describe(`sid${this.policy.statementCount}`)
        .addServicePrincipal('s3.amazonaws.com')
        .addAction('sns:Publish')
        .addResource(this.topicArn)
        .addCondition('ArnLike', { "aws:SourceArn": bucket.bucketArn }));
      this.notifyingBucketPaths.add(bucket.bucketId);
    }

    return {
      arn: this.topicArn,
      type: s3.BucketNotificationDestinationType.Topic
    };
  }
}
