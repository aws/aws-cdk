/// !cdk-integ *

import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { AssertionsProvider, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Match } from 'aws-cdk-lib/assertions';

class TestStack extends Stack {
  public table?: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.RETAIN,
      replicationRegions: ['eu-west-2'],
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-dynamodb-skip-replica-deletion');

const integTest = new IntegTest(
  app,
  'cdk-dynamodb-skip-replica-deletion-test',
  {
    testCases: [stack],
  },
);

// Describe the table first to ensure it exists
const describeTable = integTest.assertions.awsApiCall(
  'DynamoDB',
  'describeTable',
  {
    TableName: stack.table?.tableName,
  },
);

// Assert that the table contains a `Replicas` field with the expected region
describeTable.expect(
  ExpectedResult.objectLike({
    Table: {
      Replicas: Match.arrayWith([
        Match.objectLike({ RegionName: 'eu-west-2' }),
      ]),
    },
  }),
);

// Delete the Replica in eu-west-2
const operation = integTest.assertions.awsApiCall('DynamoDB', 'updateTable', {
  TableName: stack.table?.tableName,
  ReplicaUpdates: [
    {
      Delete: {
        RegionName: 'eu-west-2',
      },
    },
  ],
}).expect(ExpectedResult.objectLike({ TableDescription: Match.anyValue() }));

// Add permission to delete table replica
const assertionProvider = operation.node.tryFindChild('SdkProvider') as AssertionsProvider;
assertionProvider.addPolicyStatementFromSdkCall('DynamoDB', 'DeleteTableReplica');

// Cleanup step to delete the table using AWS SDK in test
const deleteTable = integTest.assertions.awsApiCall('DynamoDB', 'deleteTable', {
  TableName: stack.table?.tableName,
}).expect(ExpectedResult.objectLike({ TableDescription: Match.anyValue() }));

const provider = deleteTable.node.tryFindChild('SdkProvider') as AssertionsProvider;
provider.addPolicyStatementFromSdkCall('DynamoDB', 'DeleteTableReplica');
