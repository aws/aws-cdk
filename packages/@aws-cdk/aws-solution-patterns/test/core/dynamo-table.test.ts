import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import dynamodb = require('@aws-cdk/aws-dynamodb');
import { Stack } from '@aws-cdk/core';
import { DefaultTableProps } from '../../lib/core/dynamodb-table-defaults';
import { overrideProps } from '../../lib/core/utils';

test('snapshot test TableProps default params', () => {
    const stack = new Stack();
    new dynamodb.Table(stack, 'test-dynamo-defaults', DefaultTableProps);
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('test TableProps change billing mode', () => {
    const stack = new Stack();

    const defaultProps: dynamodb.TableProps = DefaultTableProps;

    const inProps: dynamodb.TableProps = {
        billingMode: dynamodb.BillingMode.PROVISIONED,
        readCapacity: 3,
        writeCapacity: 3,
        partitionKey: {
            name: 'id',
            type: dynamodb.AttributeType.STRING
        }
    };

    const outProps = overrideProps(defaultProps, inProps);
    new dynamodb.Table(stack, 'test-dynamo-override', outProps);

    expect(stack).toHaveResource("AWS::DynamoDB::Table", {
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH"
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 3,
          WriteCapacityUnits: 3
        }
      });
});

test('test TableProps override add sort key', () => {
    const stack = new Stack();

    const defaultProps: dynamodb.TableProps = DefaultTableProps;

    const inProps: dynamodb.TableProps = {
        partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING
        },
        sortKey: {
            name: 'sort_key',
            type: dynamodb.AttributeType.STRING
        }
    };

    const outProps = overrideProps(defaultProps, inProps);
    new dynamodb.Table(stack, 'test-dynamo-override', outProps);

    expect(stack).toHaveResource("AWS::DynamoDB::Table", {
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH"
          },
          {
            AttributeName: "sort_key",
            KeyType: "RANGE"
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S"
          },
          {
            AttributeName: "sort_key",
            AttributeType: "S"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
    });
});