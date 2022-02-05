/// !cdk-integ pragma:ignore-assets
import * as iot from '@aws-cdk/aws-iot';
import * as sns from '@aws-cdk/aws-sns';
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

    const snsTopic = new sns.Topic(this, 'MyTopic');
    topicRule.addAction(new actions.SnsTopicAction(snsTopic));
  }
}

new TestStack(app, 'test-stack');
app.synth();