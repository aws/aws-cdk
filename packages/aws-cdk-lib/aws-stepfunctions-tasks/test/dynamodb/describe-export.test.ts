import * as ddb from '../../../aws-dynamodb';
import * as cdk from '../../../core';
import * as tasks from '../../lib';

let stack: cdk.Stack;
let table: ddb.Table;

beforeEach(() => {
  stack = new cdk.Stack();
  table = new ddb.Table(stack, 'MyTable', {
    tableName: 'MyTable',
    partitionKey: {
      name: 'id',
      type: ddb.AttributeType.STRING,
    },
  });
});

test('DescribeExport task', () => {
  const task = new tasks.DynamoDescribeExport(stack, 'DescribeExport', {
    table,
    exportArn: 'arn:aws:dynamodb:eu-south-1:123456789012:table/MyTable/export/1234567890123-abcdef',
  });

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
          ':states:::dynamodb:describeExport',
        ],
      ],
    },
    End: true,
    Parameters: {
      ExportArn: 'arn:aws:dynamodb:eu-south-1:123456789012:table/MyTable/export/1234567890123-abcdef',
    },
  });
});
