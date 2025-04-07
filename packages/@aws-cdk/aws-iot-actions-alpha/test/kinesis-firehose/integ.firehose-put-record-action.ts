import * as iot from '@aws-cdk/aws-iot-alpha';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT * FROM 'device/+/data'",
      ),
    });

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const stream = new firehose.DeliveryStream(this, 'MyStream', {
      destination: new firehose.S3Bucket(bucket),
    });
    topicRule.addAction(
      new actions.FirehosePutRecordAction(stream, {
        batchMode: true,
        recordSeparator: actions.FirehoseRecordSeparator.NEWLINE,
      }),
    );
  }
}

new TestStack(app, 'test-stack');
app.synth();
