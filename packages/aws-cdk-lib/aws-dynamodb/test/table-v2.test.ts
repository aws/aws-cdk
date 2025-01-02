import { Match, Template } from '../../assertions';
import { ArnPrincipal, PolicyDocument, PolicyStatement } from '../../aws-iam';
import { Stream } from '../../aws-kinesis';
import { Key } from '../../aws-kms';
import { CfnDeletionPolicy, Lazy, RemovalPolicy, Stack, Tags } from '../../core';
import {
  AttributeType, Billing, Capacity, GlobalSecondaryIndexPropsV2, TableV2,
  LocalSecondaryIndexProps, ProjectionType, StreamViewType, TableClass, TableEncryptionV2,
} from '../lib';

describe('table', () => {
  test('with default properties', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
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
      StreamSpecification: Match.absent(),
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

  test('with dynamo stream', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      dynamoStream: StreamViewType.NEW_IMAGE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      StreamSpecification: {
        StreamViewType: 'NEW_IMAGE',
      },
    });
  });

  test('with sort key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableName: 'my-table',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableName: 'my-table',
    });
  });

  test('with TTL attribute', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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

  test('with tags', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{ region: 'us-west-1' }],
      tags: [{ key: 'tagKey', value: 'tagValue' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-west-1',
        },
        {
          Region: 'us-east-1',
          Tags: [{ Key: 'tagKey', Value: 'tagValue' }],
        },
      ],
    });
  });

  test('with all properties configured', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const stream = new Stream(stack, 'Stream');

    const tableKey = new Key(stack, 'Key');
    const replicaKeyArns = {
      'us-east-1': 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
      'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
    };

    // WHEN
    new TableV2(stack, 'Table', {
      tableName: 'my-table',
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.NUMBER },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 20 }),
      }),
      encryption: TableEncryptionV2.customerManagedKey(tableKey, replicaKeyArns),
      contributorInsights: true,
      deletionProtection: true,
      pointInTimeRecovery: true,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      kinesisStream: stream,
      timeToLiveAttribute: 'attribute',
      removalPolicy: RemovalPolicy.DESTROY,
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          readCapacity: Capacity.fixed(10),
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
        },
      ],
      localSecondaryIndexes: [
        {
          indexName: 'lsi',
          sortKey: { name: 'sk', type: AttributeType.NUMBER },
        },
      ],
      replicas: [
        {
          region: 'us-east-1',
          deletionProtection: false,
          readCapacity: Capacity.autoscaled({
            minCapacity: 5,
            maxCapacity: 25,
          }),
          globalSecondaryIndexOptions: {
            gsi2: {
              contributorInsights: false,
            },
          },
          tags: [{ key: 'USE1Key', value: 'USE1Value' }],
        },
        {
          region: 'us-east-2',
          tableClass: TableClass.STANDARD,
          contributorInsights: false,
          globalSecondaryIndexOptions: {
            gsi1: {
              readCapacity: Capacity.fixed(15),
            },
          },
          tags: [{ key: 'USE2Key', value: 'USE2Value' }],
        },
      ],
      tags: [{ key: 'USW2Key', value: 'USW2Value' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sk',
          AttributeType: 'N',
        },
      ],
      BillingMode: 'PROVISIONED',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            {
              AttributeName: 'pk',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          WriteProvisionedThroughputSettings: {
            WriteCapacityAutoScalingSettings: {
              MaxCapacity: 20,
              MinCapacity: 1,
              TargetTrackingScalingPolicyConfiguration: {
                TargetValue: 70,
              },
            },
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            {
              AttributeName: 'pk',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          WriteProvisionedThroughputSettings: {
            WriteCapacityAutoScalingSettings: {
              MaxCapacity: 20,
              MinCapacity: 1,
              TargetTrackingScalingPolicyConfiguration: {
                TargetValue: 70,
              },
            },
          },
        },
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'sk',
          KeyType: 'RANGE',
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
              AttributeName: 'sk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      Replicas: [
        {
          ContributorInsightsSpecification: {
            Enabled: true,
          },
          DeletionProtectionEnabled: false,
          GlobalSecondaryIndexes: [
            {
              ContributorInsightsSpecification: {
                Enabled: true,
              },
              IndexName: 'gsi1',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
            {
              ContributorInsightsSpecification: {
                Enabled: false,
              },
              IndexName: 'gsi2',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
          ],
          KinesisStreamSpecification: Match.absent(),
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
          ReadProvisionedThroughputSettings: {
            ReadCapacityAutoScalingSettings: {
              MaxCapacity: 25,
              MinCapacity: 5,
              TargetTrackingScalingPolicyConfiguration: {
                TargetValue: 70,
              },
            },
          },
          Region: 'us-east-1',
          SSESpecification: {
            KMSMasterKeyId: 'arn:aws:kms:us-east-1:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          TableClass: 'STANDARD_INFREQUENT_ACCESS',
          Tags: [{ Key: 'USE1Key', Value: 'USE1Value' }],
        },
        {
          ContributorInsightsSpecification: {
            Enabled: false,
          },
          DeletionProtectionEnabled: true,
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 15,
              },
            },
            {
              ContributorInsightsSpecification: {
                Enabled: true,
              },
              IndexName: 'gsi2',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
          ],
          KinesisStreamSpecification: Match.absent(),
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
          Region: 'us-east-2',
          SSESpecification: {
            KMSMasterKeyId: 'arn:aws:kms:us-east-2:123456789012:key/g24efbna-az9b-42ro-m3bp-cq249l94fca6',
          },
          TableClass: 'STANDARD',
          Tags: [{ Key: 'USE2Key', Value: 'USE2Value' }],
        },
        {
          ContributorInsightsSpecification: {
            Enabled: true,
          },
          DeletionProtectionEnabled: true,
          GlobalSecondaryIndexes: [
            {
              ContributorInsightsSpecification: {
                Enabled: true,
              },
              IndexName: 'gsi1',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
            {
              ContributorInsightsSpecification: {
                Enabled: true,
              },
              IndexName: 'gsi2',
              ReadProvisionedThroughputSettings: {
                ReadCapacityUnits: 10,
              },
            },
          ],
          KinesisStreamSpecification: {
            StreamArn: {
              'Fn::GetAtt': [
                'Stream790BDEE4',
                'Arn',
              ],
            },
          },
          PointInTimeRecoverySpecification: {
            PointInTimeRecoveryEnabled: true,
          },
          ReadProvisionedThroughputSettings: {
            ReadCapacityUnits: 10,
          },
          Region: 'us-west-2',
          SSESpecification: {
            KMSMasterKeyId: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          TableClass: 'STANDARD_INFREQUENT_ACCESS',
          Tags: [{ Key: 'USW2Key', Value: 'USW2Value' }],
        },
      ],
      SSESpecification: {
        SSEEnabled: true,
        SSEType: 'KMS',
      },
      StreamSpecification: {
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
      TableName: 'my-table',
      TimeToLiveSpecification: {
        AttributeName: 'attribute',
        Enabled: true,
      },
      WriteProvisionedThroughputSettings: {
        WriteCapacityAutoScalingSettings: {
          MaxCapacity: 20,
          MinCapacity: 1,
          TargetTrackingScalingPolicyConfiguration: {
            TargetValue: 70,
          },
        },
      },
    });
  });

  test('can add global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.BINARY },
    });

    const globalSecondaryIndex: GlobalSecondaryIndexPropsV2 = {
      indexName: 'gsi',
      partitionKey: { name: 'gsi-pk', type: AttributeType.NUMBER },
    };

    // WHEN
    table.addGlobalSecondaryIndex(globalSecondaryIndex);

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
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.BINARY },
    });
    const localSecondaryIndex: LocalSecondaryIndexProps = {
      indexName: 'lsi',
      sortKey: { name: 'lsi-sk', type: AttributeType.NUMBER },
    };

    // WHEN
    table.addLocalSecondaryIndex(localSecondaryIndex);

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

  test('multiple tables', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table1', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
    new TableV2(stack, 'Table2', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });
    new TableV2(stack, 'Table3', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::DynamoDB::GlobalTable', 3);
  });

  test('throws if defining non-default replica table in region agnostic stack', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [{ region: 'us-east-1' }],
      });
    }).toThrow('Replica tables are not supported in a region agnostic stack');
  });

  test('throws if getting replica table in region agnostic stack', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      table.replica('us-west-2');
    }).toThrow('Replica tables are not supported in a region agnostic stack');
  });

  test('with on-demand maximum throughput', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.onDemand({
        maxReadRequestUnits: 10,
        maxWriteRequestUnits: 10,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
      ],
      WriteOnDemandThroughputSettings: {
        MaxWriteRequestUnits: 10,
      },
      BillingMode: 'PAY_PER_REQUEST',
      StreamSpecification: Match.absent(),
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          ReadOnDemandThroughputSettings: {
            MaxReadRequestUnits: 10,
          },
        },
      ],
    });
    Template.fromStack(stack).hasResource('AWS::DynamoDB::GlobalTable', { DeletionPolicy: CfnDeletionPolicy.RETAIN });
  });

  test('with on-demand maximum throughput - read only', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.onDemand({
        maxReadRequestUnits: 10,
      }),
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
      StreamSpecification: Match.absent(),
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          ReadOnDemandThroughputSettings: {
            MaxReadRequestUnits: 10,
          },
        },
      ],
    });
    Template.fromStack(stack).hasResource('AWS::DynamoDB::GlobalTable', { DeletionPolicy: CfnDeletionPolicy.RETAIN });
  });

  test('with on-demand maximum throughput - index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi1',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          maxReadRequestUnits: 100,
        },
        {
          indexName: 'gsi2',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          maxReadRequestUnits: 1,
          maxWriteRequestUnits: 1,
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
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          WriteOnDemandThroughputSettings: {
            MaxWriteRequestUnits: 1,
          },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      StreamSpecification: Match.absent(),
      Replicas: [
        {
          Region: {
            Ref: 'AWS::Region',
          },
          GlobalSecondaryIndexes: [{
            IndexName: 'gsi1',
            ReadOnDemandThroughputSettings: {
              MaxReadRequestUnits: 100,
            },
          },
          {
            IndexName: 'gsi2',
            ReadOnDemandThroughputSettings: {
              MaxReadRequestUnits: 1,
            },
          }],
        },
      ],
    });
    Template.fromStack(stack).hasResource('AWS::DynamoDB::GlobalTable', { DeletionPolicy: CfnDeletionPolicy.RETAIN });
  });

});

describe('replica tables', () => {
  test('with fixed read capacity', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'GlobalTable', {
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
    new TableV2(stack, 'GlobalTable', {
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

  test('with tags', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{
        region: 'us-west-1',
        tags: [{ key: 'tagKey', value: 'tagValue' }],
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-west-1',
          Tags: [{ Key: 'tagKey', Value: 'tagValue' }],
        },
        {
          Region: 'us-east-1',
        },
      ],
    });
  });

  test('with TagAspect', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });

    // WHEN
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{
        region: 'us-west-1',
      }],
    });

    Tags.of(table).add('tagKey', 'tagValue');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-west-1',
          Tags: [{ Key: 'tagKey', Value: 'tagValue' }],
        },
        {
          Region: 'us-east-1',
          Tags: [{ Key: 'tagKey', Value: 'tagValue' }],
        },
      ],
    });
  });

  test('with TagAspect on parent scope', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{
        region: 'us-west-1',
      }],
    });

    Tags.of(stack).add('stage', 'Prod');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-west-1',
          Tags: [{ Key: 'stage', Value: 'Prod' }],
        },
        {
          Region: 'us-east-1',
          Tags: [{ Key: 'stage', Value: 'Prod' }],
        },
      ],
    });
  });

  test('replica tags override tag aspect tags', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });

    // WHEN
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{
        region: 'us-west-1',
        tags: [{ key: 'tableTagProperty', value: 'replicaW1TagPropertyValue' }],
      }, {
        region: 'us-west-2',
      }],
      tags: [{ key: 'tableTagProperty', value: 'defaultReplicaTagPropertyValue' }],
    });

    Tags.of(table).add('tableTagProperty', 'tagAspectValue');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-west-1',
          Tags: [
            { Key: 'tableTagProperty', Value: 'replicaW1TagPropertyValue' },
          ],
        },
        {
          Region: 'us-west-2',
          Tags: [
            { Key: 'tableTagProperty', Value: 'tagAspectValue' },
          ],
        },
        {
          Region: 'us-east-1',
          Tags: [
            { Key: 'tableTagProperty', Value: 'defaultReplicaTagPropertyValue' },
          ],
        },
      ],
    });
  });

  test('with per-replica kinesis stream', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const kinesisStream1 = new Stream(stack, 'Stream1');
    const kinesisStream2 = Stream.fromStreamArn(stack, 'Stream2', 'arn:aws:kinesis:us-east-1:123456789012:stream/my-stream');

    // WHEN
    new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      kinesisStream: kinesisStream1,
      replicas: [
        {
          region: 'us-east-1',
          kinesisStream: kinesisStream2,
        },
        {
          region: 'us-east-2',
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: [
        {
          Region: 'us-east-1',
          KinesisStreamSpecification: {
            StreamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/my-stream',
          },
        },
        {
          Region: 'us-east-2',
          KinesisStreamSpecification: Match.absent(),
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
    new TableV2(stack, 'GlobalTable', {
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
    new TableV2(stack, 'GlobalTable', {
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
    const table = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      table.addReplica({ region: Lazy.string({ produce: () => 'us-east-1' }) });
    }).toThrow('Replica table region must not be a token');
  });

  test('throws if adding replica table in deployment region', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const table = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN / THEN
    expect(() => {
      table.addReplica({ region: 'us-west-2' });
    }).toThrow('You cannot add a replica table in the same region as the primary table - the primary table region is us-west-2');
  });

  test('throws if adding duplicate replica table', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const table = new TableV2(stack, 'GlobalTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [{ region: 'us-east-1' }],
    });

    // WHEN / THEN
    expect(() => {
      table.addReplica({ region: 'us-east-1' });
    }).toThrow('Duplicate replica table region, us-east-1, is not allowed');
  });

  test('throws if read capacity is configured on replica table when billing mode is PAY_PER_REQUEST', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'GlobalTable', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        replicas: [
          {
            region: 'us-east-1',
            readCapacity: Capacity.fixed(10),
          },
        ],
      });
    }).toThrow("You cannot provide 'readCapacity' on a replica table when the billing mode is PAY_PER_REQUEST");
  });

  test('throws if configuring options for non-existent global secondary index', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    new TableV2(stack, 'GlobalTable', {
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
    }).toThrow('Cannot configure replica global secondary index, global, because it is not defined on the primary table');
  });

  test('throws if read capacity is configured as global secondary index options when billing mode is PAY_PER_REQUEST', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    new TableV2(stack, 'GlobalTable', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
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
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
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
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
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
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
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
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
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
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
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
    new TableV2(stack, 'Table', {
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

  test('with global secondary index wihtout read capacity inherits from table when billing mode is provisioned', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(10),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 10 }),
      }),
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'gsi-pk', type: AttributeType.STRING },
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
                ReadCapacityUnits: 10,
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
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
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
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
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
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
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
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
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'key', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        globalSecondaryIndexes,
      });
    }).toThrow('You may not provide more than 20 global secondary indexes');
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
        localSecondaryIndexes,
      });
    }).toThrow('You may not provide more than 5 local secondary indexes');
  });

  test('throws if global secondary index has INCLUDE projection type and no non-key attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
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

  test('throws if local secondary index is specified without sort key', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack');

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        localSecondaryIndexes: [
          {
            indexName: 'lsi',
            sortKey: { name: 'sk', type: AttributeType.NUMBER },
          },
        ],
      });
    }).toThrow('The table must have a sort key in order to add a local secondary index');
  });
});

describe('imports', () => {
  test('can import a table by name', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2', account: '123456789012' } });

    // WHEN
    const table = TableV2.fromTableName(stack, 'Table', 'my-table');

    // THEN
    expect(table.tableName).toEqual('my-table');
    expect(stack.resolve(table.tableArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':dynamodb:us-west-2:123456789012:table/my-table',
        ],
      ],
    });
  });

  test('can import a table by arn', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2', account: '123456789012' } });

    // WHEN
    const table = TableV2.fromTableArn(stack, 'Table', 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table');

    // THEN
    expect(table.tableArn).toEqual('arn:aws:dynamodb:us-east-2:123456789012:table/my-table');
    expect(table.tableName).toEqual('my-table');
  });

  test('can import a table with attributes', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2', account: '123456789012' } });
    const tableKey = new Key(stack, 'Key');

    // WHEN
    const table = TableV2.fromTableAttributes(stack, 'Table', {
      tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
      tableStreamArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table/stream/*',
      tableId: 'a123b456-01ab-23cd-123a-111222aaabbb',
      encryptionKey: tableKey,
    });

    // THEN
    expect(table.tableStreamArn).toEqual('arn:aws:dynamodb:us-east-2:123456789012:table/my-table/stream/*');
    expect(table.encryptionKey?.keyArn).toEqual(tableKey.keyArn);
    expect(table.tableId).toEqual('a123b456-01ab-23cd-123a-111222aaabbb');
  });

  test('throws if name or arn are not provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN / THEN
    expect(() => {
      TableV2.fromTableAttributes(stack, 'Table', {
        tableStreamArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table/stream/*',
      });
    }).toThrow('At least one of `tableArn` or `tableName` must be provided');
  });

  test('throws if name and arn are both provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN / THEN
    expect(() => {
      TableV2.fromTableAttributes(stack, 'Table', {
        tableName: 'my-table',
        tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/my-table',
      });
    }).toThrow('Only one of `tableArn` or `tableName` can be provided, but not both');
  });

  test('throws for invalid arn format', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN / THEN
    expect(() => {
      TableV2.fromTableAttributes(stack, 'Table', {
        tableArn: 'arn:aws:dynamodb:us-east-2:123456789012:table/',
      });
    }).toThrow('Table ARN must be of the form: arn:<partition>:dynamodb:<region>:<account>:table/<table-name>');
  });
});

test('Resource policy test', () => {
  // GIVEN
  const stack = new Stack(undefined, 'Stack');

  const doc = new PolicyDocument({
    statements: [
      new PolicyStatement({
        actions: ['dynamodb:GetItem'],
        principals: [new ArnPrincipal('arn:aws:iam::111122223333:user/foobar')],
        resources: ['*'],
      }),
    ],
  });

  // WHEN
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'metric', type: AttributeType.STRING },
    resourcePolicy: doc,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    Replicas: [
      {
        Region: {
          Ref: 'AWS::Region',
        },
        ResourcePolicy: {
          PolicyDocument: {
            Statement: [
              {
                Action: 'dynamodb:GetItem',
                Effect: 'Allow',
                Principal: {
                  AWS: 'arn:aws:iam::111122223333:user/foobar',
                },
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
        },
      },
    ],
  });
});

test('Warm Throughput test on-demand', () => {
  // GIVEN
  const stack = new Stack(undefined, 'Stack', { env: { region: 'eu-west-1' } });

  // WHEN
  const table = new TableV2(stack, 'Table', {
    partitionKey: { name: 'id', type: AttributeType.STRING },
    warmThroughput: {
      readUnitsPerSecond: 13000,
      writeUnitsPerSecond: 5000,
    },
    replicas: [{
      region: 'us-west-2',
    }],
    globalSecondaryIndexes: [{
      indexName: 'my-index-1',
      partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
      warmThroughput: {
        readUnitsPerSecond: 15000,
        writeUnitsPerSecond: 6000,
      },
    },
    {
      indexName: 'my-index-2',
      partitionKey: { name: 'gsi2pk', type: AttributeType.STRING },
    }],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'gsi1pk', AttributeType: 'S' },
      { AttributeName: 'gsi2pk', AttributeType: 'S' },
    ],
    WarmThroughput: {
      ReadUnitsPerSecond: 13000,
      WriteUnitsPerSecond: 5000,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: 'my-index-1',
        KeySchema: [
          { AttributeName: 'gsi1pk', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
        WarmThroughput: {
          ReadUnitsPerSecond: 15000,
          WriteUnitsPerSecond: 6000,
        },
      },
      {
        IndexName: 'my-index-2',
        KeySchema: [
          { AttributeName: 'gsi2pk', KeyType: 'HASH' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  });

});
