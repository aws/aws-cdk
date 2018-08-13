import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

/**
 * Since we can't take a dependency on @aws-cdk/sns, this is a simple wrapper
 * for AWS::SNS::Topic which implements IBucketNotificationTarget.
 */
export class Topic extends cdk.Construct implements s3.INotificationDestination {
    public readonly topicArn: cdk.Arn;
    private readonly policy = new cdk.PolicyDocument();
    private readonly notifyingBucketPaths = new Set<string>();

    constructor(parent: cdk.Construct, id: string) {
        super(parent, id);

        const resource = new cdk.Resource(this, 'Resource', { type: 'AWS::SNS::Topic' });

        new cdk.Resource(this, 'Policy', {
            type: 'AWS::SNS::TopicPolicy',
            properties: {
                Topics: [ resource.ref ],
                PolicyDocument: this.policy
            }
        });

        this.topicArn = resource.ref;
    }

    public bucketNotificationDestination(bucket: s3.Bucket): s3.NotificationDestinationProps {
        // add permission to each source bucket
        if (!this.notifyingBucketPaths.has(bucket.path)) {
            this.policy.addStatement(new cdk.PolicyStatement()
                .describe(`sid${this.policy.statementCount}`)
                .addServicePrincipal('s3.amazonaws.com')
                .addAction('sns:Publish')
                .addResource(this.topicArn)
                .addCondition('ArnLike', { "aws:SourceArn": bucket.bucketArn }));
            this.notifyingBucketPaths.add(bucket.path);
        }

        return {
            arn: this.topicArn,
            type: s3.NotificationDestinationType.Topic
        };
    }
}
