import * as ddb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

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
        .toString(),
    ).toEqual('Messages[1][10].Tags.Items[0]');
  });

  test('should throw if expression starts with atIndex', () => {
    expect(() => new tasks.DynamoProjectionExpression().atIndex(1).withAttribute('Messages').toString()).toThrow(
      /Expression must start with an attribute/,
    );
  });
});

describe('DynamoAttributeValue', () => {
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

  test('throws when multiple attribute values are supplied', () => {
    // WHEN
    const task = new tasks.DynamoPutItem(stack, 'PutItem', {
      item: { SOME_KEY: { s: '1234', b: 'YmxhaA==' } },
      table,
    });

    // THEN
    expect(() => {
      stack.resolve(task.toStateJson());
    }).toThrow(/exactly 1 attribute value must be supplied. received 2 attributes/);
  });

  test('throws when no attribute values are supplied', () => {
    // WHEN
    const task = new tasks.DynamoPutItem(stack, 'PutItem', {
      item: { SOME_KEY: {} },
      table,
    });

    // THEN
    expect(() => {
      stack.resolve(task.toStateJson());
    }).toThrow(/exactly 1 attribute value must be supplied. received 0 attributes/);
  });
});
