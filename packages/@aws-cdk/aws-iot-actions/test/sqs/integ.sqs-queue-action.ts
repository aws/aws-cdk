import * as iot from '@aws-cdk/aws-iot';
import * as sqs from '@aws-cdk/aws-sqs';
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

    const queue = new sqs.Queue(this, 'MyQueue', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    topicRule.addAction(new actions.SqsQueueAction(queue));
  }
}

new TestStack(app, 'test-stack');
app.synth();
