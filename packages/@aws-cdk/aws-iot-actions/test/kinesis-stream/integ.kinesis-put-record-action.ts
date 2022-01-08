import * as iot from '@aws-cdk/aws-iot';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';


const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323(
        "SELECT * FROM 'device/+/data'",
      ),
      errorAction: new actions.CloudWatchLogsAction(
        new logs.LogGroup(this, 'Logs', { removalPolicy: cdk.RemovalPolicy.DESTROY }),
      ),
    });

    const stream = new kinesis.Stream(this, 'MyStream', {
      shardCount: 3,
    });
    topicRule.addAction(
      new actions.KinesisPutRecordAction(stream, {
        partitionKey: '${timestamp()}',
      }),
    );
  }
}

new TestStack(app, 'test-stack');
app.synth();
