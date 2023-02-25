import * as dynamodb from '../../../aws-dynamodb';
import * as iot from '../../../aws-iot';
import * as cdk from '../../../core';
import * as integ from '../../../integ-tests';
import * as actions from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'test-dynamodbv2-put-item-action-stack');

const topicRule = new iot.TopicRule(stack, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT * FROM 'device/+/data'",
  ),
});

const tablePartitionKey: dynamodb.Attribute = {
  name: 'hashKey',
  type: dynamodb.AttributeType.STRING,
};

const tableSortKey: dynamodb.Attribute = {
  name: 'sortKey',
  type: dynamodb.AttributeType.NUMBER,
};

const table = new dynamodb.Table(stack, 'MyTable', {
  tableName: 'MyTable',
  readCapacity: 1,
  writeCapacity: 1,
  partitionKey: tablePartitionKey,
  sortKey: tableSortKey,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

topicRule.addAction(new actions.DynamoDBv2PutItemAction(table));

new integ.IntegTest(app, 'dynamodbv2-integtest', {
  testCases: [stack],
});

app.synth();
