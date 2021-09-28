/// !cdk-integ pragma:ignore-assets
import * as logs from '@aws-cdk/aws-logs';
import * as sqs from '@aws-cdk/aws-sqs';
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

    const queue = new sqs.Queue(this, 'MyQueue', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    topicRule.addAction(new iot.SqsAction(queue));
  }
}

new TestStack(app, 'test-stack');
app.synth();
