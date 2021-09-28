/// !cdk-integ pragma:ignore-assets
import * as logs from '@aws-cdk/aws-logs';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as iot from '../../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      topicRulePayload: {
        sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
        errorAction: new iot.CloudwatchLogsAction(new logs.LogGroup(this, 'logs')),
      },
    });

    const topic = new sns.Topic(this, 'MyTopic');
    topicRule.addAction(new iot.SnsAction(topic));
  }
}

new TestStack(app, 'test-stack');
app.synth();
