import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

let stack: cdk.Stack;
const TABLE_NAME = 'SOME_TABLE';

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('GetItem task', () => {
  // WHEN
  const task = new sfn.Task(stack, 'GetItem', {
    task: tasks.CallDynamoDB.getItem({
      partitionKey: {
        name: 'SOME_KEY',
        value: new tasks.DynamoAttributeValue().withS('1234')
      },
      sortKey: {
        name: 'OTHER_KEY',
        value: new tasks.DynamoAttributeValue().withN('4321')
      },
      tableName: TABLE_NAME,
      consistentRead: true,
      expressionAttributeNames: { OTHER_KEY: '#OK' },
      projectionExpression: [
        new tasks.DynamoProjectionExpression()
          .withAttribute('Messages')
          .atIndex(1)
          .withAttribute('Tags'),
        new tasks.DynamoProjectionExpression().withAttribute('ID')
      ],
      returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL
    })
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
            Ref: 'AWS::Partition'
          },
          ':states:::dynamodb:getItem'
        ]
      ]
    },
    End: true,
    Parameters: {
      Key: { SOME_KEY: { S: '1234' }, OTHER_KEY: { N: '4321' } },
      TableName: TABLE_NAME,
      ConsistentRead: true,
      ExpressionAttributeNames: { OTHER_KEY: '#OK' },
      ProjectionExpression: 'Messages[1].Tags,ID',
      ReturnConsumedCapacity: 'TOTAL'
    }
  });
});

test('PutItem task', () => {
  // WHEN
  const task = new sfn.Task(stack, 'PutItem', {
    task: tasks.CallDynamoDB.putItem({
      item: { SOME_KEY: new tasks.DynamoAttributeValue().withS('1234') },
      tableName: TABLE_NAME,
      conditionExpression: 'ForumName <> :f and Subject <> :s',
      expressionAttributeNames: { OTHER_KEY: '#OK' },
      expressionAttributeValues: {
        ':val': new tasks.DynamoAttributeValue().withN(
          sfn.Data.stringAt('$.Item.TotalCount.N')
        )
      },
      returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
      returnItemCollectionMetrics: tasks.DynamoItemCollectionMetrics.SIZE,
      returnValues: tasks.DynamoReturnValues.ALL_NEW
    })
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
            Ref: 'AWS::Partition'
          },
          ':states:::dynamodb:putItem'
        ]
      ]
    },
    End: true,
    Parameters: {
      Item: { SOME_KEY: { S: '1234' } },
      TableName: TABLE_NAME,
      ConditionExpression: 'ForumName <> :f and Subject <> :s',
      ExpressionAttributeNames: { OTHER_KEY: '#OK' },
      ExpressionAttributeValues: { ':val': { 'N.$': '$.Item.TotalCount.N' } },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_NEW'
    }
  });
});

test('DeleteItem task', () => {
  // WHEN
  const task = new sfn.Task(stack, 'DeleteItem', {
    task: tasks.CallDynamoDB.deleteItem({
      partitionKey: {
        name: 'SOME_KEY',
        value: new tasks.DynamoAttributeValue().withS('1234')
      },
      tableName: TABLE_NAME,
      conditionExpression: 'ForumName <> :f and Subject <> :s',
      expressionAttributeNames: { OTHER_KEY: '#OK' },
      expressionAttributeValues: {
        ':val': new tasks.DynamoAttributeValue().withN(
          sfn.Data.stringAt('$.Item.TotalCount.N')
        )
      },
      returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
      returnItemCollectionMetrics: tasks.DynamoItemCollectionMetrics.SIZE,
      returnValues: tasks.DynamoReturnValues.ALL_NEW
    })
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
            Ref: 'AWS::Partition'
          },
          ':states:::dynamodb:deleteItem'
        ]
      ]
    },
    End: true,
    Parameters: {
      Key: { SOME_KEY: { S: '1234' } },
      TableName: TABLE_NAME,
      ConditionExpression: 'ForumName <> :f and Subject <> :s',
      ExpressionAttributeNames: { OTHER_KEY: '#OK' },
      ExpressionAttributeValues: { ':val': { 'N.$': '$.Item.TotalCount.N' } },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_NEW'
    }
  });
});

test('UpdateItem task', () => {
  // WHEN
  const task = new sfn.Task(stack, 'UpdateItem', {
    task: tasks.CallDynamoDB.updateItem({
      partitionKey: {
        name: 'SOME_KEY',
        value: new tasks.DynamoAttributeValue().withS('1234')
      },
      tableName: TABLE_NAME,
      conditionExpression: 'ForumName <> :f and Subject <> :s',
      expressionAttributeNames: { OTHER_KEY: '#OK' },
      expressionAttributeValues: {
        ':val': new tasks.DynamoAttributeValue().withN(
          sfn.Data.stringAt('$.Item.TotalCount.N')
        )
      },
      returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL,
      returnItemCollectionMetrics: tasks.DynamoItemCollectionMetrics.SIZE,
      returnValues: tasks.DynamoReturnValues.ALL_NEW,
      updateExpression: 'SET TotalCount = TotalCount + :val'
    })
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
            Ref: 'AWS::Partition'
          },
          ':states:::dynamodb:updateItem'
        ]
      ]
    },
    End: true,
    Parameters: {
      Key: { SOME_KEY: { S: '1234' } },
      TableName: TABLE_NAME,
      ConditionExpression: 'ForumName <> :f and Subject <> :s',
      ExpressionAttributeNames: { OTHER_KEY: '#OK' },
      ExpressionAttributeValues: { ':val': { 'N.$': '$.Item.TotalCount.N' } },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'SET TotalCount = TotalCount + :val'
    }
  });
});

test('supports tokens', () => {
  // WHEN
  const task = new sfn.Task(stack, 'GetItem', {
    task: tasks.CallDynamoDB.getItem({
      partitionKey: {
        name: 'SOME_KEY',
        value: new tasks.DynamoAttributeValue().withS(
          sfn.Data.stringAt('$.partitionKey')
        )
      },
      sortKey: {
        name: 'OTHER_KEY',
        value: new tasks.DynamoAttributeValue().withN(
          sfn.Data.stringAt('$.sortKey')
        )
      },
      tableName: sfn.Data.stringAt('$.tableName'),
      consistentRead: true,
      expressionAttributeNames: { OTHER_KEY: sfn.Data.stringAt('$.otherKey') },
      projectionExpression: [
        new tasks.DynamoProjectionExpression()
          .withAttribute('Messages')
          .atIndex(1)
          .withAttribute('Tags'),
        new tasks.DynamoProjectionExpression().withAttribute('ID')
      ],
      returnConsumedCapacity: tasks.DynamoConsumedCapacity.TOTAL
    })
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
            Ref: 'AWS::Partition'
          },
          ':states:::dynamodb:getItem'
        ]
      ]
    },
    End: true,
    Parameters: {
      // tslint:disable:object-literal-key-quotes
      Key: {
        SOME_KEY: { 'S.$': '$.partitionKey' },
        OTHER_KEY: { 'N.$': '$.sortKey' }
      },
      'TableName.$': '$.tableName',
      ConsistentRead: true,
      ExpressionAttributeNames: { 'OTHER_KEY.$': '$.otherKey' },
      ProjectionExpression: 'Messages[1].Tags,ID',
      ReturnConsumedCapacity: 'TOTAL'
    }
  });
});

test('Invalid value of TableName should throw', () => {
  expect(() => {
    new sfn.Task(stack, 'GetItem', {
      task: tasks.CallDynamoDB.getItem({
        partitionKey: {
          name: 'SOME_KEY',
          value: new tasks.DynamoAttributeValue().withS('1234')
        },
        tableName: 'ab'
      })
    });
  }).toThrow(
    /TableName should not contain alphanumeric characters and should be between 3-255 characters long. Received: ab/
  );

  expect(() => {
    new sfn.Task(stack, 'GetItem', {
      task: tasks.CallDynamoDB.getItem({
        partitionKey: {
          name: 'SOME_KEY',
          value: new tasks.DynamoAttributeValue().withS('1234')
        },
        tableName:
          'abU93s5MTZDv6TYLk3Q3BE3Hj3AMca3NOb5ypSNZv1JZIONg7p8L8LNxuAStavPxYZKcoG36KwXktkuFHf0jJvt7SKofEqwYHmmK0tNJSkGoPe3MofnB7IWu3V48HbrqNGZqW005CMmDHESQWf40JK8qK0CSQtM8Z64zqysB7SZZazDRm7kKr062RXQKL82nvTxnKxTPfCHiG2YJEhuFdUywHCTN2Rjinl3P7TpwyIuPWyYHm6nZodRKLMmWpgUftZ'
      })
    });
  }).toThrow(
    /TableName should not contain alphanumeric characters and should be between 3-255 characters long. Received: abU93s5MTZDv6TYLk3Q3BE3Hj3AMca3NOb5ypSNZv1JZIONg7p8L8LNxuAStavPxYZKcoG36KwXktkuFHf0jJvt7SKofEqwYHmmK0tNJSkGoPe3MofnB7IWu3V48HbrqNGZqW005CMmDHESQWf40JK8qK0CSQtM8Z64zqysB7SZZazDRm7kKr062RXQKL82nvTxnKxTPfCHiG2YJEhuFdUywHCTN2Rjinl3P7TpwyIuPWyYHm6nZodRKLMmWpgUftZ/
  );

  expect(() => {
    new sfn.Task(stack, 'GetItem', {
      task: tasks.CallDynamoDB.getItem({
        partitionKey: {
          name: 'SOME_KEY',
          value: new tasks.DynamoAttributeValue().withS('1234')
        },
        tableName: 'abcd@'
      })
    });
  }).toThrow(
    /TableName should not contain alphanumeric characters and should be between 3-255 characters long. Received: abcd@/
  );
});

describe('DynamoProjectionExpression', () => {
  test('should correctly configure projectionExpression', () => {
    expect(
      new tasks.DynamoProjectionExpression()
        .withAttribute('Messages')
        .atIndex(1)
        .atIndex(10)
        .withAttribute('Tags')
        .withAttribute('Items')
        .atIndex(0)
        .toString()
    ).toEqual('Messages[1][10].Tags.Items[0]');
  });

  test('should throw if expression starts with atIndex', () => {
    expect(() =>
      new tasks.DynamoProjectionExpression()
        .atIndex(1)
        .withAttribute('Messages')
        .toString()
    ).toThrow(/Expression must start with an attribute/);
  });
});
