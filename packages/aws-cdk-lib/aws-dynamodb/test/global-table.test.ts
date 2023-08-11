import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { User } from '../../aws-iam';
import { Stream } from '../../aws-kinesis';
import { Key } from '../../aws-kms';
import { CfnDeletionPolicy, Lazy, RemovalPolicy, Stack, StackProps, App } from '../../core';
import {
  AttributeType, Billing, Capacity, GlobalSecondaryIndexPropsV2, GlobalTable,
  ITable, LocalSecondaryIndexProps, ProjectionType, TableClass, TableEncryptionV2,
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

  test('with kinesis stream', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const kinesisStream = new Stream(stack, 'Stream');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      kinesisStream,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          KinesisStreamSpecification: {
            StreamArn: {
              'Fn::GetAtt': [
                'Stream790BDEE4',
                'Arn',
              ],
            },
          },
        },
      ],
    });
  });

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
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
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

  test('can add global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.BINARY },
    });

    const globalSecondaryIndex: GlobalSecondaryIndexPropsV2 = {
      indexName: 'gsi',
      partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
    };

    // WHEN
    globalTable.addGlobalSecondaryIndex(globalSecondaryIndex);

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

  test('can add local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.BINARY },
    });
    const localSecondaryIndex: LocalSecondaryIndexProps = {
      indexName: 'lsi',
      sortKey: { name: 'lsi-sk', type: AttributeType.NUMBER },
    };

    // WHEN
    globalTable.addLocalSecondaryIndex(localSecondaryIndex);

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

describe('replica tables', () => {
  test('with fixed read capacity', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(5),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
      replicas: [
        { region: 'us-east-1', readCapacity: Capacity.fixed(10) },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
        },
        {
          Region: 'us-west-2',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 5,
          },
        },
      ],
    });
  });

  test('with autoscaled read capacity', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(5),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
      replicas: [
        {
          region: 'us-east-1',
          readCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
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
        {
          Region: 'us-west-2',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 5,
          },
        },
      ],
    });
  });

  test('with per-replica kinesis stream', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const kinesisStream1 = new Stream(stack, 'Stream1');
    const kinesisStream2 = new Stream(stack, 'Stream2');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      kinesisStream: kinesisStream1,
      replicas: [
        {
          region: 'us-east-1',
          kinesisStream: kinesisStream2,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          KinesisStreamSpecification: {
            StreamArn: {
              'Fn::GetAtt': [
                'Stream29F70ED08',
                'Arn',
              ],
            },
          },
        },
        {
          Region: 'us-west-2',
          KinesisStreamSpecification: {
            StreamArn: {
              'Fn::GetAtt': [
                'Stream16C8F97AF',
                'Arn',
              ],
            },
          },
        },
      ],
    });
  });

  test('with per-replica contributor insights on global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      contributorInsights: true,
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
        },
      ],
      replicas: [
        {
          region: 'us-east-2',
          globalSecondaryIndexOptions: {
            gsi2: {
              contributorInsights: false,
            },
          },
        },
        {
          region: 'us-east-1',
          globalSecondaryIndexOptions: {
            gsi1: {
              contributorInsights: false,
            },
          },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-2',
          ContributorInsightsSpecification: {
            Enabled: true,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ContributorInsightsSpecification: {
                Enabled: true,
              },
            },
            {
              IndexName: 'gsi2',
              ContributorInsightsSpecification: {
                Enabled: false,
              },
            },
          ],
        },
        {
          Region: 'us-east-1',
          ContributorInsightsSpecification: {
            Enabled: true,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ContributorInsightsSpecification: {
                Enabled: false,
              },
            },
            {
              IndexName: 'gsi2',
              ContributorInsightsSpecification: {
                Enabled: true,
              },
            },
          ],
        },
        {
          Region: 'us-west-2',
          ContributorInsightsSpecification: {
            Enabled: true,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ContributorInsightsSpecification: {
                Enabled: true,
              },
            },
            {
              IndexName: 'gsi2',
              ContributorInsightsSpecification: {
                Enabled: true,
              },
            },
          ],
        },
      ],
    });
  });

  test('with per-replica read capacity on global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(10),
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(10),
        },
      ],
      replicas: [
        {
          region: 'us-east-2',
          globalSecondaryIndexOptions: {
            gsi2: {
              readCapacity: Capacity.fixed(15),
            },
          },
        },
        {
          region: 'us-east-1',
          globalSecondaryIndexOptions: {
            gsi1: {
              readCapacity: Capacity.autoscaled({ minCapacity: 5, maxCapacity: 15 }),
            },
          },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-2',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
            {
              IndexName: 'gsi2',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 15,
              },
            },
          ],
        },
        {
          Region: 'us-east-1',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ReadProvisionedThroughputSettings: {
                ReadCapacityAutoScalingSettings: {
                  MinCapacity: 5,
                  MaxCapacity: 15,
                  TargetTrackingScalingPolicyConfiguration: {
                    TargetValue: 70,
                  },
                },
              },
            },
            {
              IndexName: 'gsi2',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
          ],
        },
        {
          Region: 'us-west-2',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
            {
              IndexName: 'gsi2',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
          ],
        },
      ],
    });
  });

  test('throws if replica table region is a token', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      globalTable.addReplica({ region: Lazy.string({ produce: () => 'us-east-1' }) });
    }).toThrow('Replica Table region must not be a token');
  });

  test('throws if adding replica table in deployment region', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      globalTable.addReplica({ region: 'us-west-2' });
    }).toThrow('A Replica Table in Global Table deployment region is configured by default and cannot be added explicitly');
  });

  test('throws if adding duplicate replica table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{ region: 'us-east-1' }],
    });

    // WHEN / THEN
    expect(() => {
      globalTable.addReplica({ region: 'us-east-1' });
    }).toThrow('Duplicate Relica Table region, us-east-1, is not allowed');
  });

  test('throws if read capacity is configured on replica table when billing mode is PAY_PER_REQUEST', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [
          {
            region: 'us-east-1',
            readCapacity: Capacity.fixed(10),
          },
        ],
      });
    }).toThrow("You cannot provide 'readCapacity' on a Replica Table when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if configuring options for non-existent global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
        },
      ],
      replicas: [
        {
          region: 'us-east-1',
          globalSecondaryIndexOptions: {
            global: {
              readCapacity: Capacity.fixed(10),
            },
          },
        },
      ],
    });

    // WHEN / THEN
    expect(() => {
      Template.fromStack(stack);
    }).toThrow('Cannot configure replica global secondary index, global, because it is not defined on the global table');
  });

  test('throws if read capacity is configured as global secondary index options when billing mode is PAY_PER_REQUEST', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
        },
      ],
      replicas: [
        {
          region: 'us-east-1',
          globalSecondaryIndexOptions: {
            gsi: {
              readCapacity: Capacity.fixed(10),
            },
          },
        },
      ],
    });

    // WHEN / THEN
    expect(() => {
      Template.fromStack(stack);
    }).toThrow("Cannot configure 'readCapacity' for replica global secondary index, gsi, because billing mode is PAY_PER_REQUEST");
  });
});

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

describe('grants', () => {
  test('grant with arbitrary actions on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grant(user, 'dynamodb:action1', 'dynamodb:action2');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:action1',
              'dynamodb:action2',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grantWriteData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantWriteData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadWriteData on global table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grantReadWriteData on global table with customer managed keys', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.grantReadWriteData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'Resource',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-2:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('grants for individual replica only has replica arn and replica key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const user = new User(stack, 'User');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };
    const tableKey = new Key(stack, 'Key');
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2' },
      ],
    });

    // WHEN
    globalTable.replica('us-east-1').grantReadData(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Effect: 'Allow',
            Resource: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':table/',
                    {
                      Ref: 'Resource',
                    },
                  ],
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });

  test('can grant to replica in different stack', () => {
    class FooStack extends Stack {
      public readonly globalTable: GlobalTable;

      public constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.globalTable = new GlobalTable(this, 'GlobalTable', {
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          replicas: [
            { region: 'us-east-1' },
            { region: 'us-east-2' },
          ],
        });
      }
    }

    interface BarStackProps extends StackProps {
      readonly replicaTable: ITable;
    }

    class BarStack extends Stack {
      public constructor(scope: Construct, id: string, props: BarStackProps) {
        super(scope, id, props);

        const user = new User(this, 'User');

        props.replicaTable.grantReadData(user);
      }
    }

    const app = new App();

    const fooStack = new FooStack(app, 'FooStack', { env: { region: 'us-west-2', account: '123456789012' } });
    const barStack = new BarStack(app, 'BarStack', {
      replicaTable: fooStack.globalTable.replica('us-east-1'),
    });

    Template.fromStack(barStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':dynamodb:us-east-1:123456789012:table/foostackstackglobaltableb6dd9d1a6f2b84889e59',
                  ],
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'UserDefaultPolicy1F97781E',
      Users: [
        {
          Ref: 'User00B015A1',
        },
      ],
    });
  });
});
