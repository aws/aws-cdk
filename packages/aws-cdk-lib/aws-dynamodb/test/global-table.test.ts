import { BillingMode } from '@aws-sdk/client-dynamodb';
import { Match, Template } from '../../assertions';
import { Stream } from '../../aws-kinesis';
import { Key } from '../../aws-kms';
import { CfnDeletionPolicy, Lazy, RemovalPolicy, Stack } from '../../core';
import {
  AttributeType, Billing, Capacity, GlobalSecondaryIndexPropsV2, GlobalTable,
  LocalSecondaryIndexProps, ProjectionType, TableClass, TableEncryptionV2,
} from '../lib';

describe('global table configuration', () => {
  test('with default properties', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
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

    // WHEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'N' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
    });
  });

  test('with contributor insights enabled', () => {
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

  test('with deletion protection enabled', () => {
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

  test('with point-in-time recovery enabled', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      pointInTimeRecovery: true,
    });

    // WHEN
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

  test('with encryption using a dynamodb owned key', () => {
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
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          SSESpecification: Match.absent(),
        },
      ],
    });
  });

  test('with encryption using an aws managed key', () => {
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
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          SSESpecification: Match.absent(),
        },
      ],
    });
  });

  test('with encryption using customer managed keys', () => {
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
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          SSESpecification: {
            KMSMasterKeyId: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
        },
      ],
    });
  });

  test('with replica table not in deployment region', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{ region: 'us-east-1' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      StreamSpecification: {
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
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
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gsiPk',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            {
              AttributeName: 'gsiPk',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsiSk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'lsiSk',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            {
              AttributeName: 'pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'lsiSk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('with all properties configured', () => {});

  test('throws if write capacity is configured using fixed capacity mode', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        billing: Billing.provisioned({
          readCapacity: Capacity.fixed(10),
          writeCapacity: Capacity.fixed(10),
        }),
      });
    }).toThrow("You cannot configure 'writeCapacity' with FIXED capacity mode");
  });
});

describe('replicas', () => {
  test('can configure readCapacity on a per-replica basis', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
      }),
      replicas: [
        {
          region: 'us-east-1',
          readCapacity: Capacity.autoscaled({ minCapacity: 20, maxCapacity: 50 }),
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
              MinCapacity: 20,
              MaxCapacity: 50,
              TargetTrackingScalingPolicyConfiguration: {
                TargetValue: 70,
              },
            },
          },
        },
        {
          Region: 'us-west-2',
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
        },
      ],
    });
  });

  test('can configure contributor insights on a per-replica basis', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      contributorInsights: true,
      replicas: [
        {
          region: 'us-east-1',
          contributorInsights: false,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          ContributorInsightsSpecification: {
            Enabled: false,
          },
        },
        {
          Region: 'us-west-2',
          ContributorInsightsSpecification: {
            Enabled: true,
          },
        },
      ],
    });
  });

  test('can configure deletion protection on a per-replica basis', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      deletionProtection: true,
      replicas: [
        {
          region: 'us-east-1',
          deletionProtection: false,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          DeletionProtectionEnabled: false,
        },
        {
          Region: 'us-west-2',
          DeletionProtectionEnabled: true,
        },
      ],
    });
  });

  test('can configure point-in-time recovery on a per-replica basis', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      pointInTimeRecovery: true,
      replicas: [
        {
          region: 'us-east-1',
          pointInTimeRecovery: false,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: false,
          },
        },
        {
          Region: 'us-west-2',
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
        },
      ],
    });
  });

  test('can configure table class on a per-replica basis', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      replicas: [
        {
          region: 'us-east-1',
          tableClass: TableClass.STANDARD,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          TableClass: 'STANDARD',
        },
        {
          Region: 'us-west-2',
          TableClass: 'STANDARD_INFREQUENT_ACCESS',
        },
      ],
    });
  });

  test('can add replica table using replica method', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    const globalTable = new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
    globalTable.addReplica({ region: 'us-east-1' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        { Region: 'us-east-1' },
        { Region: 'us-west-2' },
      ],
    });
  });

  test('throws if replica provided in region agnositc stack', () => {
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

  test('throws if replica region is a token', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [{ region: Lazy.string({ produce: () => 'us-east-1' }) }],
      });
    }).toThrow('Replica Table region must not be token');
  });

  test('throws if adding replica in deployment region', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [{ region: 'us-west-2' }],
      });
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

  test('throws if configuring read capacity when billing mode is on-demand', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [{ region: 'us-east-1', readCapacity: Capacity.fixed(10) }],
      });
    }).toThrow("You cannot provide 'readCapacity' on a Replica Table when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if replica key arn is missing for encryption with customer managed key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const tableKey = new Key(stack, 'Key');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/95fedf1f-12g1-4652-9ea1-84023c1q9a0l',
    };
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      replicas: [{ region: 'us-east-1' }, { region: 'us-east-2' }],
    });

    // WHEN / THEN
    expect(() => {
      Template.fromStack(stack);
    }).toThrow("KMS key for us-east-2 was not found in 'replicaKeyArns'");
  });
});

describe('secondary indexes', () => {
  test('global secondary index with sort key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          sortKey: { name: 'gsiSk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsiPk', AttributeType: 'S' },
        { AttributeName: 'gsiSk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
            { AttributeName: 'gsiSk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    });
  });

  test('global secondary index with provisioned billing and fixed read capacity', () => {
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
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(15),
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsiPk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
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

  test('global secondary index with provisioned billing and autoscaled read capacity', () => {
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
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          readCapacity: Capacity.autoscaled({ minCapacity: 5, maxCapacity: 10 }),
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsiPk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
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
                ReadCapacityAutoScalingSettings: {
                  MinCapacity: 5,
                  MaxCapacity: 10,
                  TargetTrackingScalingPolicyConfiguration: {
                    TargetValue: 70,
                  },
                },
              },
            },
          ],
        },
      ],
    });
  });

  test('global secondary index with configured write capacity', () => {
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
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(10),
          writeCapacity: Capacity.autoscaled({ minCapacity: 10, maxCapacity: 20 }),
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsiPk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          WriteProvisionedThroughputSettings: {
            WriteCapacityAutoScalingSettings: {
              MinCapacity: 10,
              MaxCapacity: 20,
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
                ReadCapacityUnits: 10,
              },
            },
          ],
        },
      ],
    });
  });

  test('global secondary index with projection type as INCLUDE', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          projectionType: ProjectionType.INCLUDE,
          nonKeyAttributes: ['nonKey1', 'nonKey2'],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsiPk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'INCLUDE',
            NonKeyAttributes: ['nonKey1', 'nonKey2'],
          },
        },
      ],
    });
  });

  test('global secondary index with project type as KEYS_ONLY', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          projectionType: ProjectionType.KEYS_ONLY,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'gsiPk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
        },
      ],
    });
  });

  test('local secondary index with projection type as INCLUDES', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsiSk', type: AttributeType.STRING },
          projectionType: ProjectionType.INCLUDE,
          nonKeyAttributes: ['nonKey1', 'nonKey2'],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'lsiSk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsiSk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'INCLUDE',
            NonKeyAttributes: ['nonKey1', 'nonKey2'],
          },
        },
      ],
    });
  });

  test('local secondary index with projection type as KEYS_ONLY', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsiSk', type: AttributeType.STRING },
          projectionType: ProjectionType.KEYS_ONLY,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'lsiSk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsiSk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
        },
      ],
    });
  });

  test('global secondary index and local secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new GlobalTable(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsiPk', type: AttributeType.NUMBER },
        },
      ],
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'lsiSk', type: AttributeType.STRING },
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'N' },
        { AttributeName: 'gsiPk', AttributeType: 'N' },
        { AttributeName: 'lsiSk', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi',
          KeySchema: [
            { AttributeName: 'gsiPk', KeyType: 'HASH' },
          ],
        },
      ],
      LocalSecondaryIndexes: [
        {
          IndexName: 'lsi',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'lsiSk', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
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
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          },
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          },
        ],
      });
    }).toThrow('Duplicate secondary index name, gsi, is not allowed');
  });

  test('throws if attribute definition is redefined', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi1',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          },
          {
            indexName: 'gsi2',
            partitionKey: { name: 'gsiPk', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('Unable to specify gsiPk as N because it was already defined as S');
  });

  test('throws for secondary index with INCLUDE projection type without non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
            projectionType: ProjectionType.INCLUDE,
          },
        ],
      });
    }).toThrow('Non-key attributes should be specified when using INCLUDE projection type');
  });

  test('throws for secondary index with ALL projection type with non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
            nonKeyAttributes: ['nonKey1', 'nonKey2'],
          },
        ],
      });
    }).toThrow('Non-key attributes should not be specified when not using INCLUDE projection type');
  });

  test('throws for secondary index with KEYS_ONLY projection type with non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
            projectionType: ProjectionType.KEYS_ONLY,
            nonKeyAttributes: ['nonKey1', 'nonKey2'],
          },
        ],
      });
    }).toThrow('Non-key attributes should not be specified when not using INCLUDE projection type');
  });

  test('throws if read capacity is not configured when billing mode is provisioned', () => {
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
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
          },
        ],
      });
    }).toThrow(`You must specify 'readCapacity' on a global secondary index when the billing mode is ${BillingMode.PROVISIONED}`);
  });

  test('throws if read capacity is configured and global table billing mode is on-demand', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
            readCapacity: Capacity.fixed(10),
          },
        ],
      });
    }).toThrow("You cannot configure 'readCapacity' or 'writeCapacity' on a global secondary index when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if write capacity is configured and global table billing mode is on-demand', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new GlobalTable(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes: [
          {
            indexName: 'gsi',
            partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
            writeCapacity: Capacity.autoscaled({ minCapacity: 1, maxCapacity: 10 }),
          },
        ],
      });
    }).toThrow("You cannot configure 'readCapacity' or 'writeCapacity' on a global secondary index when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if number of global secondary indexes is greater than 20', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    const globalSecondaryIndexes: GlobalSecondaryIndexPropsV2[] = [];
    for (let count = 0; count <= 20; count++) {
      globalSecondaryIndexes.push({
        indexName: `gsi${count}`,
        partitionKey: { name: 'gsiPk', type: AttributeType.STRING },
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

  test('throws if number of local secondary indexes is greater than 5', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    const localSecondaryIndexes: LocalSecondaryIndexProps[] = [];
    for (let count = 0; count <= 5; count++) {
      localSecondaryIndexes.push({
        indexName: `lsi${count}`,
        sortKey: { name: 'lsiPk', type: AttributeType.STRING },
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
});
