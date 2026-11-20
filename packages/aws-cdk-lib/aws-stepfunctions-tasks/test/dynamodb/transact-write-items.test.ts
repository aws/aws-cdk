import { Match, Template } from '../../../assertions';
import * as ddb from '../../../aws-dynamodb';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as tasks from '../../lib';

let stack: cdk.Stack;
let orders: ddb.Table;
let inventory: ddb.Table;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  orders = new ddb.Table(stack, 'orders', {
    tableName: 'orders',
    partitionKey: { name: 'pk', type: ddb.AttributeType.STRING },
  });
  inventory = new ddb.Table(stack, 'inventory', {
    tableName: 'inventory',
    partitionKey: { name: 'pk', type: ddb.AttributeType.STRING },
  });
});

function allItemTypes(): tasks.DynamoTransactWriteItem[] {
  return [
    tasks.DynamoTransactWriteItem.put({
      table: orders,
      item: { pk: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.orderId')) },
      conditionExpression: 'attribute_not_exists(pk)',
    }),
    tasks.DynamoTransactWriteItem.update({
      table: inventory,
      key: { pk: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.sku')) },
      updateExpression: 'SET stock = stock - :one',
      conditionExpression: 'stock >= :one',
      expressionAttributeValues: { ':one': tasks.DynamoAttributeValue.fromNumber(1) },
      returnValuesOnConditionCheckFailure: tasks.DynamoReturnValuesOnConditionCheckFailure.ALL_OLD,
    }),
    tasks.DynamoTransactWriteItem.delete({
      table: orders,
      key: { pk: tasks.DynamoAttributeValue.fromString('stale-order') },
    }),
    tasks.DynamoTransactWriteItem.conditionCheck({
      table: inventory,
      key: { pk: tasks.DynamoAttributeValue.fromString('catalog') },
      conditionExpression: '#open = :true',
      expressionAttributeNames: { '#open': 'open' },
      expressionAttributeValues: { ':true': tasks.DynamoAttributeValue.fromBoolean(true) },
    }),
  ];
}

test('TransactWriteItems task renders every item type with the AWS SDK integration', () => {
  // WHEN
  const task = tasks.DynamoTransactWriteItems.jsonPath(stack, 'Transact', {
    transactItems: allItemTypes(),
    clientRequestToken: sfn.JsonPath.stringAt('$.requestId'),
    returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
    returnItemCollectionMetrics: tasks.DynamoItemCollectionMetrics.SIZE,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':states:::aws-sdk:dynamodb:transactWriteItems']],
    },
    End: true,
    Parameters: {
      'TransactItems': [
        {
          Put: {
            TableName: stack.resolve(orders.tableName),
            Item: { pk: { 'S.$': '$.orderId' } },
            ConditionExpression: 'attribute_not_exists(pk)',
          },
        },
        {
          Update: {
            TableName: stack.resolve(inventory.tableName),
            Key: { pk: { 'S.$': '$.sku' } },
            UpdateExpression: 'SET stock = stock - :one',
            ConditionExpression: 'stock >= :one',
            ExpressionAttributeValues: { ':one': { N: '1' } },
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          },
        },
        {
          Delete: {
            TableName: stack.resolve(orders.tableName),
            Key: { pk: { S: 'stale-order' } },
          },
        },
        {
          ConditionCheck: {
            TableName: stack.resolve(inventory.tableName),
            Key: { pk: { S: 'catalog' } },
            ConditionExpression: '#open = :true',
            ExpressionAttributeNames: { '#open': 'open' },
            ExpressionAttributeValues: { ':true': { BOOL: true } },
          },
        },
      ],
      'ClientRequestToken.$': '$.requestId',
      'ReturnConsumedCapacity': 'TOTAL',
      'ReturnItemCollectionMetrics': 'SIZE',
    },
  });
});

test('TransactWriteItems task with JSONata renders Arguments', () => {
  // WHEN
  const task = tasks.DynamoTransactWriteItems.jsonata(stack, 'Transact', {
    transactItems: [
      tasks.DynamoTransactWriteItem.delete({
        table: orders,
        key: { pk: tasks.DynamoAttributeValue.fromString('{% $states.input.orderId %}') },
      }),
    ],
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    QueryLanguage: 'JSONata',
    Resource: {
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':states:::aws-sdk:dynamodb:transactWriteItems']],
    },
    End: true,
    Arguments: {
      TransactItems: [
        {
          Delete: {
            TableName: stack.resolve(orders.tableName),
            Key: { pk: { S: '{% $states.input.orderId %}' } },
          },
        },
      ],
    },
  });
});

test('TransactWriteItems task grants each table only the per-item actions used on it', () => {
  // WHEN
  new sfn.StateMachine(stack, 'StateMachine', {
    definitionBody: sfn.DefinitionBody.fromChainable(tasks.DynamoTransactWriteItems.jsonPath(stack, 'Transact', {
      transactItems: allItemTypes(),
    })),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['dynamodb:DeleteItem', 'dynamodb:PutItem'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', Match.arrayWith([':table/', stack.resolve(orders.tableName)])],
          },
        },
        {
          Action: ['dynamodb:ConditionCheckItem', 'dynamodb:UpdateItem'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', Match.arrayWith([':table/', stack.resolve(inventory.tableName)])],
          },
        },
      ],
    },
  });
});

test.each([0, 101])('fails when transactItems contains %d items', (count) => {
  const item = tasks.DynamoTransactWriteItem.delete({
    table: orders,
    key: { pk: tasks.DynamoAttributeValue.fromString('order') },
  });

  expect(() => tasks.DynamoTransactWriteItems.jsonPath(stack, 'Transact', {
    transactItems: Array(count).fill(item),
  })).toThrow(`transactItems must contain between 1 and 100 items, got ${count}`);
});

test('fails with an integration pattern other than request response', () => {
  expect(() => new tasks.DynamoTransactWriteItems(stack, 'Transact', {
    transactItems: [tasks.DynamoTransactWriteItem.delete({
      table: orders,
      key: { pk: tasks.DynamoAttributeValue.fromString('order') },
    })],
    integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  })).toThrow(/Unsupported service integration pattern/);
});
