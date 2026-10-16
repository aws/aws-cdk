import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Seeds an inventory item, then runs a single DynamoDB transaction that uses every
 * transact item type. The assertions check the execution succeeded and that the
 * transaction's writes landed in both tables, which only works if the task granted
 * the per-item actions DynamoDB authorizes transactions against.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-dynamodb-transact-write-items');

const orders = new ddb.Table(stack, 'Orders', {
  partitionKey: { name: 'OrderId', type: ddb.AttributeType.STRING },
  billingMode: ddb.BillingMode.PAY_PER_REQUEST,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const inventory = new ddb.Table(stack, 'Inventory', {
  partitionKey: { name: 'Sku', type: ddb.AttributeType.STRING },
  billingMode: ddb.BillingMode.PAY_PER_REQUEST,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const seedInventory = new tasks.DynamoPutItem(stack, 'SeedInventory', {
  table: inventory,
  item: {
    Sku: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.sku')),
    Stock: tasks.DynamoAttributeValue.fromNumber(5),
  },
  resultPath: sfn.JsonPath.DISCARD,
});

const placeOrder = tasks.DynamoTransactWriteItems.jsonPath(stack, 'PlaceOrder', {
  transactItems: [
    tasks.DynamoTransactWriteItem.put({
      table: orders,
      item: {
        OrderId: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.orderId')),
        Status: tasks.DynamoAttributeValue.fromString('PLACED'),
      },
      conditionExpression: 'attribute_not_exists(OrderId)',
    }),
    tasks.DynamoTransactWriteItem.update({
      table: inventory,
      key: { Sku: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.sku')) },
      updateExpression: 'SET Stock = Stock - :one',
      conditionExpression: 'Stock >= :one',
      expressionAttributeValues: { ':one': tasks.DynamoAttributeValue.fromNumber(1) },
    }),
    tasks.DynamoTransactWriteItem.delete({
      table: orders,
      key: { OrderId: tasks.DynamoAttributeValue.fromString('stale-order') },
    }),
    tasks.DynamoTransactWriteItem.conditionCheck({
      table: inventory,
      key: { Sku: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.sku')) },
      conditionExpression: 'attribute_exists(Sku)',
    }),
  ],
  resultPath: sfn.JsonPath.DISCARD,
});

const stateMachine = new sfn.StateMachine(stack, 'StateMachine', {
  definitionBody: sfn.DefinitionBody.fromChainable(seedInventory.next(placeOrder)),
});

const integ = new IntegTest(app, 'DynamoTransactWriteItems', {
  testCases: [stack],
});

const execution = integ.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
  input: JSON.stringify({ orderId: 'order-1', sku: 'sku-1' }),
});

const succeeded = integ.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: execution.getAttString('executionArn'),
}).expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(5),
});

const orderWritten = integ.assertions.awsApiCall('DynamoDB', 'getItem', {
  TableName: orders.tableName,
  Key: { OrderId: { S: 'order-1' } },
}).expect(ExpectedResult.objectLike({
  Item: { OrderId: { S: 'order-1' }, Status: { S: 'PLACED' } },
}));

const stockDecremented = integ.assertions.awsApiCall('DynamoDB', 'getItem', {
  TableName: inventory.tableName,
  Key: { Sku: { S: 'sku-1' } },
}).expect(ExpectedResult.objectLike({
  Item: { Sku: { S: 'sku-1' }, Stock: { N: '4' } },
}));

succeeded.next(orderWritten).next(stockDecremented);
