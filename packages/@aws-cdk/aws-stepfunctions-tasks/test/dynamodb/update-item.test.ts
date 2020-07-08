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

test('UpdateItem task', () => {
  // WHEN
  const task = new tasks.DynamoUpdateItem(stack, 'UpdateItem', {
    key: { SOME_KEY: tasks.DynamoAttributeValue.fromString('1234') },
    table,
    conditionExpression: 'ForumName <> :f and Subject <> :s',
    expressionAttributeNames: { OTHER_KEY: '#OK' },
    expressionAttributeValues: {
      ':val': tasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt('$.Item.TotalCount.N')),
    },
    returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
    returnItemCollectionMetrics: tasks.DynamoItemCollectionMetrics.SIZE,
    returnValues: tasks.DynamoReturnValues.ALL_NEW,
    updateExpression: 'SET TotalCount = TotalCount + :val',
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
          ':states:::dynamodb:updateItem',
        ],
      ],
    },
    End: true,
    Parameters: {
      Key: { SOME_KEY: { S: '1234' } },
      TableName: {
        Ref: 'mytable0324D45C',
      },
      ConditionExpression: 'ForumName <> :f and Subject <> :s',
      ExpressionAttributeNames: { OTHER_KEY: '#OK' },
      ExpressionAttributeValues: { ':val': { 'N.$': '$.Item.TotalCount.N' } },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'SET TotalCount = TotalCount + :val',
    },
  });
});
