import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

let stack: cdk.Stack;
let table: ddb.Table;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  table = new ddb.Table(stack, 'my-table', {
    tableName: 'my-table',
    partitionKey: {
      name: 'name',
      type: ddb.AttributeType.STRING,
    },
  });
});

test('GetItem task', () => {
  // WHEN
  const task = new tasks.DynamoGetItem(stack, 'GetItem', {
    partitionKey: {
      name: 'SOME_KEY',
      value: { s: '1234' },
    },
    sortKey: {
      name: 'OTHER_KEY',
      value: { n: '4321' },
    },
    table,
    consistentRead: true,
    expressionAttributeNames: { OTHER_KEY: '#OK' },
    projectionExpression: [
      new tasks.DynamoProjectionExpression().withAttribute('Messages').atIndex(1).withAttribute('Tags'),
      new tasks.DynamoProjectionExpression().withAttribute('ID'),
    ],
    returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::dynamodb:getItem',
        ],
      ],
    },
    End: true,
    Parameters: {
      Key: { SOME_KEY: { S: '1234' }, OTHER_KEY: { N: '4321' } },
      TableName: {
        Ref: 'mytable0324D45C',
      },
      ConsistentRead: true,
      ExpressionAttributeNames: { OTHER_KEY: '#OK' },
      ProjectionExpression: 'Messages[1].Tags,ID',
      ReturnConsumedCapacity: 'TOTAL',
    },
  });
});

test('supports tokens', () => {
  // WHEN
  const task = new tasks.DynamoGetItem(stack, 'GetItem', {
    partitionKey: {
      name: 'SOME_KEY',
      value: { s: sfn.Data.stringAt('$.partitionKey') },
    },
    sortKey: {
      name: 'OTHER_KEY',
      value: { n: sfn.Data.stringAt('$.sortKey') },
    },
    table,
    consistentRead: true,
    expressionAttributeNames: { OTHER_KEY: sfn.Data.stringAt('$.otherKey') },
    projectionExpression: [
      new tasks.DynamoProjectionExpression().withAttribute('Messages').atIndex(1).withAttribute('Tags'),
      new tasks.DynamoProjectionExpression().withAttribute('ID'),
    ],
    returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::dynamodb:getItem',
        ],
      ],
    },
    End: true,
    Parameters: {
      // tslint:disable:object-literal-key-quotes
      Key: {
        SOME_KEY: { 'S.$': '$.partitionKey' },
        OTHER_KEY: { 'N.$': '$.sortKey' },
      },
      TableName: {
        Ref: 'mytable0324D45C',
      },
      ConsistentRead: true,
      ExpressionAttributeNames: { 'OTHER_KEY.$': '$.otherKey' },
      ProjectionExpression: 'Messages[1].Tags,ID',
      ReturnConsumedCapacity: 'TOTAL',
    },
  });
});
