import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iot from '@aws-cdk/aws-iot';
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

    const table_partition_key: dynamodb.Attribute = {
      name: 'hashKey',
      type: dynamodb.AttributeType.STRING,
    };

    const table_sort_key: dynamodb.Attribute = {
      name: 'sortKey',
      type: dynamodb.AttributeType.NUMBER,
    };

    const table = new dynamodb.Table(this, 'MyTable', {
      tableName: 'MyTable',
      readCapacity: 1,
      writeCapacity: 1,
      partitionKey: table_partition_key,
      sortKey: table_sort_key,
    });

    topicRule.addAction(new actions.DynamoDBv2PutItemAction(table));
  }
}

const app = new cdk.App();
new TestStack(app, 'test-kinesis-stream-action-stack');
app.synth();
