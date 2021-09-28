/// !cdk-integ pragma:ignore-assets
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import * as iot from '../../../lib';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicRule = new iot.TopicRule(this, 'TopicRule', {
      topicRulePayload: {
        sql: "SELECT topic(2) as device_id FROM 'device/+/data'",
      },
    });

    const table = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { type: dynamodb.AttributeType.STRING, name: 'device_id' },
      sortKey: { type: dynamodb.AttributeType.NUMBER, name: 'timestamp' },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    topicRule.addAction(new iot.DynamoDBAction({
      table,
      partitionKeyValue: '${topic(2)}',
      sortKeyValue: '${timestamp()}',
      payloadField: 'custom-payload-field',
    }));
  }
}

new TestStack(app, 'test-stack');
app.synth();
