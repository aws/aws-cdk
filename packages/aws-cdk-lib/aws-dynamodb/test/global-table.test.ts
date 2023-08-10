import { Template } from '../../assertions';
import { Key } from '../../aws-kms';
import { CfnDeletionPolicy, RemovalPolicy, Stack } from '../../core';
import {
  AttributeType, Billing, Capacity, GlobalSecondaryIndexPropsV2, GlobalTable,
  LocalSecondaryIndexProps, ProjectionType, TableClass, TableEncryptionV2,
} from '../lib';

/* eslint-disable no-console */
describe('global table', () => {
  test('with default properties', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
        },
      ],
    });
    Template.fromStack(stack).hasResource('AWS::DynamoDB::GlobalTable', { DeletionPolicy: CfnDeletionPolicy.RETAIN });
  });

  test('with sort key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'N' },
      ],
    });
  });

  test('with contributor insights', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      contributorInsights: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          ContributorInsightsSpecification: {
            Enabled: true,
          },
        },
      ],
    });
  });

  test('with deletion protection', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      deletionProtection: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          DeletionProtectionEnabled: true,
        },
      ],
    });
  });

  test('with point-in-time recovery', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      pointInTimeRecovery: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
        },
      ],
    });
  });

  test('with STANDARD table class', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableClass: TableClass.STANDARD,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          TableClass: 'STANDARD',
        },
      ],
    });
  });

  test('with STANDARD_INFREQUENT_ACCESS table class', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          TableClass: 'STANDARD_INFREQUENT_ACCESS',
        },
      ],
    });
  });

  test('with kinesis stream', () => {});

  test('with table name', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableName: 'my-global-table',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableName: 'my-global-table',
    });
  });

  test('with TTL attribute', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      timeToLiveAttribute: 'attribute',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TimeToLiveSpecification: {
        AttributeName: 'attribute',
        Enabled: true,
      },
    });
  });

  test('with removal policy as DESTROY', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::DynamoDB::GlobalTable', { DeletionPolicy: CfnDeletionPolicy.DELETE });
  });

  test('with on-demand billing', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.onDemand(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      BillingMode: 'PAY_PER_REQUEST',
    });
  });

  test('with provisioned billing and fixed read capacity', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      BillingMode: 'PROVISIONED',
      WriteProvisionedThroughputSettings: {
        WriteCapacityAutoScalingSettings: {
          MinCapacity: 1,
          MaxCapacity: 10,
          TargetTrackingScalingPolicyConfiguration: {
            TargetValue: 70,
          },
        },
      },
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
        },
      ],
    });
  });

  test('with provisioned billing and autoscaled read capacity', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      tableName: 'global-table',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      BillingMode: 'PROVISIONED',
      WriteProvisionedThroughputSettings: {
        WriteCapacityAutoScalingSettings: {
          MinCapacity: 1,
          MaxCapacity: 10,
          TargetTrackingScalingPolicyConfiguration: {
            TargetValue: 70,
          },
        },
      },
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          ReadProvisionedThroughputSettings: {
            ReadCapacityAutoScalingSettings: {
              MinCapacity: 1,
              MaxCapacity: 10,
              TargetTrackingScalingPolicyConfiguration: {
                TargetValue: 70,
              },
            },
          },
        },
      ],
    });
  });

  test('with non-default replica table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{ region: 'us-east-1' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        { Region: 'us-east-1' },
        { Region: 'us-west-2' },
      ],
    });
  });

  test('with global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.BINARY },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'B' },
        { AttributeName: 'gsi-pk', AttributeType: 'N' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi',
            },
          ],
        },
      ],
    });
  });

  test('with local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.BINARY },
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsi-sk', type: AttributeType.NUMBER },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'B' },
        { AttributeName: 'lsi-sk', AttributeType: 'N' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('with encryption via dynamodb owned key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.dynamoOwnedKey(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      SSESpecification: {
        SSEEnabled: false,
      },
    });
  });

  test('with encryption via aws managed key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.awsManagedKey(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      SSESpecification: {
        SSEEnabled: true,
        SSEType: 'KMS',
      },
    });
  });

  test('with encryption via customer managed key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const tableKey = new Key(stack, 'Key');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      SSESpecification: {
        SSEEnabled: true,
        SSEType: 'KMS',
      },
    });
  });

  test('throws if defining non-default replica table in region agnostic stack', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [{ region: 'us-east-1' }],
      });
    }).toThrow('Replica Tables are not supported in a region agnostic stack');
  });

  test('throws if getting replica table from global table in region agnostic stack', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      globalTable.replica('us-west-2');
    }).toThrow('Replica Tables are not supported in a region agnostic stack');
  });
});

describe('replica tables', () => {});

describe('secondary indexes', () => {
  test('with multiple global secondary indexes with different partition keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'gsi-pk-1', type: AttributeType.NUMBER },
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'gsi-pk-2', type: AttributeType.NUMBER },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk-1', AttributeType: 'N' },
        { AttributeName: 'gsi-pk-2', AttributeType: 'N' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            { AttributeName: 'gsi-pk-1', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            { AttributeName: 'gsi-pk-2', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
            },
            {
              IndexName: 'gsi2',
            },
          ],
        },
      ],
    });
  });

  test('with multiple global secondary indexes with the same partition keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk', AttributeType: 'N' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
            },
            {
              IndexName: 'gsi2',
            },
          ],
        },
      ],
    });
  });

  test('with multiple global secondary indexes with different sort keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
          sortKey: { name: 'gsi-sk-1', type: AttributeType.STRING },
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
          sortKey: { name: 'gsi-sk-2', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk', AttributeType: 'N' },
        { AttributeName: 'gsi-sk-1', AttributeType: 'S' },
        { AttributeName: 'gsi-sk-2', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
            { AttributeName: 'gsi-sk-1', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
            { AttributeName: 'gsi-sk-2', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
            },
            {
              IndexName: 'gsi2',
            },
          ],
        },
      ],
    });
  });

  test('with multiple global secondary indexes with the same sort keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
          sortKey: { name: 'gsi-sk', type: AttributeType.STRING },
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
          sortKey: { name: 'gsi-sk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk', AttributeType: 'N' },
        { AttributeName: 'gsi-sk', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
            { AttributeName: 'gsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
            { AttributeName: 'gsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
            },
            {
              IndexName: 'gsi2',
            },
          ],
        },
      ],
    });
  });

  test('with multiple local secondary indexes with different sort keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi1',
          sortKey: { name: 'lsi-sk-1', type: AttributeType.STRING },
        },
        {
          indexName: 'lsi2',
          sortKey: { name: 'lsi-sk-2', type: AttributeType.NUMBER },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'lsi-sk-1', AttributeType: 'S' },
        { AttributeName: 'lsi-sk-2', AttributeType: 'N' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi1',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk-1', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'lsi2',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk-2', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('with multiple local secondary indexes with the same sort keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi1',
          sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
        },
        {
          indexName: 'lsi2',
          sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'lsi-sk', AttributeType: 'S' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi1',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'lsi2',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('with global secondary index and local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
        },
      ],
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk', AttributeType: 'S' },
        { AttributeName: 'lsi-sk', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi',
            },
          ],
        },
      ],
    });
  });

  test('with global secondary index read capacity', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(15),
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      WriteProvisionedThroughputSettings: {
        WriteCapacityAutoScalingSettings: {
          MinCapacity: 1,
          MaxCapacity: 10,
          TargetTrackingScalingPolicyConfiguration: {
            TargetValue: 70,
          },
        },
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          WriteProvisionedThroughputSettings: {
            WriteCapacityAutoScalingSettings: {
              MinCapacity: 1,
              MaxCapacity: 10,
              TargetTrackingScalingPolicyConfiguration: {
                TargetValue: 70,
              },
            },
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 15,
              },
            },
          ],
        },
      ],
    });
  });

  test('with global secondary index and KEYS_ONLY projection type', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
          projectionType: ProjectionType.KEYS_ONLY,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi',
            },
          ],
        },
      ],
    });
  });

  test('with global secondary index and INCLUDE projection type', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
          projectionType: ProjectionType.INCLUDE,
          nonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsi-pk', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsi-pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'INCLUDE',
            NonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
          },
        },
      ],
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi',
            },
          ],
        },
      ],
    });
  });

  test('with local secondary index and KEYS_ONLY projection type', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
          projectionType: ProjectionType.KEYS_ONLY,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'lsi-sk', AttributeType: 'S' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
        },
      ],
    });
  });

  test('with local secondary index and INCLUDE projection type', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
          projectionType: ProjectionType.INCLUDE,
          nonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'lsi-sk', AttributeType: 'S' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsi-sk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'INCLUDE',
            NonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
          },
        },
      ],
    });
  });

  test('throws for duplicate global secondary index names', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsi-pk-1', type: AttributeType.STRING },
          },
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsi-pk-2', type: AttributeType.STRING },
          },
        ],
      });
    }).toThrow('Duplicate secondary index name, gsi, is not allowed');
  });

  test('throws for duplicate local secondary index names', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'lsi-sk-1', type: AttributeType.STRING },
          },
          {
            indexName: 'lsi',
            sortKey: { name: 'lsi-sk-2', type: AttributeType.STRING },
          },
        ],
      });
    }).toThrow('Duplicate secondary index name, lsi, is not allowed');
  });

  test('throws for duplicate index name in global secondary index and local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'secondary-index',
            partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
          },
        ],
        localSecondaryIndexes: [
          {
            indexName: 'secondary-index',
            sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
          },
        ],
      });
    }).toThrow('Duplicate secondary index name, secondary-index, is not allowed');
  });

  test('throws if attribute definition is re-defined in global secondary indexes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi1',
            partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
          },
          {
            indexName: 'gsi2',
            partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('Unable to specify gsi-pk as N because it was already defined as S');
  });

  test('throws if attribute definition is re-defined in local secondary indexes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi1',
            sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
          },
          {
            indexName: 'lsi2',
            sortKey: { name: 'lsi-sk', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('Unable to specify lsi-sk as N because it was already defined as S');
  });

  test('throws if attribute definition is re-defined across global secondary index and local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'key', type: AttributeType.STRING },
          },
        ],
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'key', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('Unable to specify key as N because it was already defined as S');
  });

  test('throws if attribute definition is re-defined across global secondary index and global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'pk', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('Unable to specify pk as N because it was already defined as S');
  });

  test('throws if attribute definition is re-defined across local secondary index and global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'key', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'key', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('Unable to specify key as N because it was already defined as S');
  });

  test('throws if global secondary index has read capacity when billing mode is PAY_PER_REQUEST', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'pk', type: AttributeType.STRING },
            readCapacity: Capacity.fixed(10),
          },
        ],
      });
    }).toThrow("You cannot configure 'readCapacity' or 'writeCapacity' on a global secondary index when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if global secondary index has write capacity when billing mode is PAY_PER_REQUEST', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'pk', type: AttributeType.STRING },
            writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
          },
        ],
      });
    }).toThrow("You cannot configure 'readCapacity' or 'writeCapacity' on a global secondary index when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if global secondary index count is greater than 20', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    const globalSecondaryIndexes: GlobalSecondaryIndexPropsV2[] = [];
    for (let count = 0; count <= 20; count++) {
      globalSecondaryIndexes.push({
        indexName: `gsi${count}`,
        partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
      });
    }

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes,
      });
    }).toThrow('You may not provide more than 20 global secondary indexes to a Global Table');
  });

  test('throws if local secondary index count is greater than 5', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    const localSecondaryIndexes: LocalSecondaryIndexProps[] = [];
    for (let count = 0; count <= 5; count++) {
      localSecondaryIndexes.push({
        indexName: `lsi${count}`,
        sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
      });
    }

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes,
      });
    }).toThrow('You may not provide more than 5 local secondary indexes to a Global Table');
  });

  test('throws if read capacity is not defined on global secondary index when billing mode is PROVISIONED', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        billing: Billing.provisioned({
          readCapacity: Capacity.fixed(10),
          writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
        }),
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
          },
        ],
      });
    }).toThrow("You must specify 'readCapacity' on a global secondary index when the billing mode is PROVISIONED");
  });

  test('throws if global secondary index has INCLUDE projection type and no non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
            projectionType: ProjectionType.INCLUDE,
          },
        ],
      });
    }).toThrow('Non-key attributes should be specified when using INCLUDE projection type');
  });

  test('throws if global secondary index has ALL projection type and non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
            nonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
          },
        ],
      });
    }).toThrow('Non-key attributes should not be specified when not using INCLUDE projection type');
  });

  test('throws if global secondary index has KEYS_ONLY projection type and non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
            projectionType: ProjectionType.KEYS_ONLY,
            nonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
          },
        ],
      });
    }).toThrow('Non-key attributes should not be specified when not using INCLUDE projection type');
  });

  test('throws if local secondary index has INCLUDE projection type and no non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
            projectionType: ProjectionType.INCLUDE,
          },
        ],
      });
    }).toThrow('Non-key attributes should be specified when using INCLUDE projection type');
  });

  test('throws if local secondary index has ALL projection type and non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
            projectionType: ProjectionType.ALL,
            nonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
          },
        ],
      });
    }).toThrow('Non-key attributes should not be specified when not using INCLUDE projection type');
  });

  test('throws if local secondary index has KEYS_ONLY projection type and non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'lsi-sk', type: AttributeType.STRING },
            projectionType: ProjectionType.KEYS_ONLY,
            nonKeyAttributes: ['nonKeyAttr1', 'nonKeyAttr2'],
          },
        ],
      });
    }).toThrow('Non-key attributes should not be specified when not using INCLUDE projection type');
  });
});
