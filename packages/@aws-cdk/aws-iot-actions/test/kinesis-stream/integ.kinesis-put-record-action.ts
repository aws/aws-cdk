import * as iot from '@aws-cdk/aws-iot';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT * FROM 'device/+/data'",
      ),
    });

    const stream = new kinesis.Stream(this, 'MyStream', {
      shardCount: 3,
    });
    topicRule.addAction(new actions.KinesisPutRecordAction(stream, {
      partitionKey: '${timestamp()}',
    }));
  }
}

const app = new cdk.App();
new TestStack(app, 'test-kinesis-stream-action-stack');
app.synth();
