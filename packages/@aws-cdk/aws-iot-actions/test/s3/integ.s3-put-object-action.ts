import * as iot from '@aws-cdk/aws-iot';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
      ),
    });

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    topicRule.addAction(
      new actions.S3PutObjectAction(bucket, {
        key: '${year}/${month}/${day}/${topic(2)}',
        accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      }),
    );
  }
}

new TestStack(app, 'test-stack');
app.synth();
