import { Annotations, Match, Template } from '../../assertions';
import { Key } from '../../aws-kms';
import { App, Stack } from '../../core';
import {
  AttributeType,
  Billing,
  Capacity,
  GlobalTableSettingsReplicationMode,
  MultiRegionConsistency,
  StreamViewType,
  TableEncryptionV2,
  TableType,
  TableV2,
  TableV2MultiAccountReplica,
} from '../lib';

const STREAM_WARNING_ACK = '@aws-cdk/aws-dynamodb:regionalTableTypeWithoutStream';
const PROTECTION_WARNING_ACK = '@aws-cdk/aws-dynamodb:disassociationProtectionWithRegionalTableType';

function ackWarning(id: string) {
  return Match.stringLikeRegexp(`.*\\[ack: ${id}\\]$`);
}

describe('table type', () => {
  test('renders TableType when tableType is GLOBAL_TABLE_REPLICA', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.GLOBAL_TABLE_REPLICA,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: 'GlobalTableReplica',
    });
  });

  test('renders TableType when tableType is REGIONAL', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.REGIONAL,
      dynamoStream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: 'Regional',
      StreamSpecification: { StreamViewType: 'NEW_AND_OLD_IMAGES' },
      Replicas: [Match.objectLike({ Region: 'us-west-2' })],
    });
    expect(Annotations.fromStack(stack).findWarning('*', ackWarning(STREAM_WARNING_ACK)).length).toBe(0);
  });

  test('TableType is not rendered when tableType is not declared', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: Match.absent(),
    });
  });

  test('GLOBAL_TABLE_REPLICA accepts replicas, addReplica and disassociationProtection without warnings', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-east-1' } });
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.GLOBAL_TABLE_REPLICA,
      disassociationProtection: false,
      replicas: [{ region: 'us-west-2', disassociationProtection: true }],
    });

    // WHEN
    table.addReplica({ region: 'us-east-2' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: 'GlobalTableReplica',
      StreamSpecification: { StreamViewType: 'NEW_AND_OLD_IMAGES' },
      Replicas: Match.arrayWith([
        Match.objectLike({ Region: 'us-west-2', DisassociationProtectionEnabled: true }),
        Match.objectLike({ Region: 'us-east-2', DisassociationProtectionEnabled: false }),
        Match.objectLike({ Region: 'us-east-1', DisassociationProtectionEnabled: false }),
      ]),
    });
    expect(Annotations.fromStack(stack).findWarning('*', ackWarning(STREAM_WARNING_ACK)).length).toBe(0);
    expect(Annotations.fromStack(stack).findWarning('*', ackWarning(PROTECTION_WARNING_ACK)).length).toBe(0);
  });
});

describe('disassociation update with tableType REGIONAL', () => {
  test('warns when no dynamoStream is declared, because removing the replicas drops the stream', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.REGIONAL,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: 'Regional',
      StreamSpecification: Match.absent(),
    });
    Annotations.fromStack(stack).hasWarning('/Stack/Table', ackWarning(STREAM_WARNING_ACK));
  });

  test('warns when disassociationProtection is declared, whatever its value', () => {
    for (const disassociationProtection of [true, false]) {
      // GIVEN
      const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

      // WHEN
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.REGIONAL,
        dynamoStream: StreamViewType.NEW_AND_OLD_IMAGES,
        disassociationProtection,
      });

      // THEN
      Annotations.fromStack(stack).hasWarning('/Stack/Table', ackWarning(PROTECTION_WARNING_ACK));
    }
  });

  test('accepts an empty replicas list', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.REGIONAL,
      dynamoStream: StreamViewType.NEW_AND_OLD_IMAGES,
      replicas: [],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: 'Regional',
      Replicas: [Match.objectLike({ Region: 'us-west-2' })],
    });
  });

  test('keeps provisioned read capacity on the stack-region replica', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.REGIONAL,
      dynamoStream: StreamViewType.NEW_AND_OLD_IMAGES,
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(5),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 10 }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      BillingMode: 'PROVISIONED',
      Replicas: [Match.objectLike({ Region: 'us-west-2', ReadProvisionedThroughputSettings: { ReadCapacityUnits: 5 } })],
    });
  });

  test('renders only the stack-region encryption key when replica keys remain configured', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const key = new Key(stack, 'Key');

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.REGIONAL,
      dynamoStream: StreamViewType.NEW_AND_OLD_IMAGES,
      encryption: TableEncryptionV2.customerManagedKey(key, { 'us-east-2': 'arn:aws:kms:us-east-2:123456789012:key/example' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      SSESpecification: { SSEEnabled: true, SSEType: 'KMS' },
      Replicas: [Match.objectLike({ Region: 'us-west-2', SSESpecification: { KMSMasterKeyId: Match.anyValue() } })],
    });
  });

  test('throws when replicas are configured', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.REGIONAL,
        replicas: [{ region: 'us-east-1' }],
      });
    }).toThrow("You cannot configure 'replicas' when 'tableType' is Regional");
  });

  test('throws when addReplica is called', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });
    const table = new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      tableType: TableType.REGIONAL,
    });

    // WHEN / THEN
    expect(() => {
      table.addReplica({ region: 'us-east-1' });
    }).toThrow("You cannot add a replica table when 'tableType' is Regional");
  });

  test('a witness region is rejected by the consistency validations', () => {
    // GIVEN
    const strongStack = new Stack(undefined, 'StrongStack', { env: { region: 'us-west-2' } });
    const eventualStack = new Stack(undefined, 'EventualStack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new TableV2(strongStack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.REGIONAL,
        multiRegionConsistency: MultiRegionConsistency.STRONG,
        witnessRegion: 'us-east-2',
      });
    }).toThrow(/must have exactly 2 replicas/);
    expect(() => {
      new TableV2(eventualStack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.REGIONAL,
        witnessRegion: 'us-east-2',
      });
    }).toThrow(/Witness region cannot be specified for a Multi-Region Eventual Consistency/);
  });

  test('throws when multiRegionConsistency is configured', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.REGIONAL,
        multiRegionConsistency: MultiRegionConsistency.EVENTUAL,
      });
    }).toThrow("You cannot configure 'multiRegionConsistency' when 'tableType' is Regional");
  });

  test('throws when globalTableSettingsReplicationMode is configured', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN / THEN
    expect(() => {
      new TableV2(stack, 'Table', {
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.REGIONAL,
        globalTableSettingsReplicationMode: GlobalTableSettingsReplicationMode.ALL,
      });
    }).toThrow("You cannot configure 'globalTableSettingsReplicationMode' when 'tableType' is Regional");
  });
});

describe('disassociation protection', () => {
  test('renders DisassociationProtectionEnabled on the primary replica', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      disassociationProtection: false,
      replicas: [{ region: 'us-east-1' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: Match.arrayWith([
        Match.objectLike({ Region: 'us-west-2', DisassociationProtectionEnabled: false }),
      ]),
    });
  });

  test('table-level disassociationProtection propagates to replicas and replicas can override it', () => {
    // GIVEN
    const stack = new Stack(undefined, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new TableV2(stack, 'Table', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      disassociationProtection: true,
      replicas: [
        { region: 'us-east-1' },
        { region: 'us-east-2', disassociationProtection: false },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      Replicas: Match.arrayWith([
        Match.objectLike({ Region: 'us-east-1', DisassociationProtectionEnabled: true }),
        Match.objectLike({ Region: 'us-east-2', DisassociationProtectionEnabled: false }),
        Match.objectLike({ Region: 'us-west-2', DisassociationProtectionEnabled: true }),
      ]),
    });
  });

  test('DisassociationProtectionEnabled is not rendered when not declared', () => {
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
        Match.objectLike({ DisassociationProtectionEnabled: Match.absent() }),
        Match.objectLike({ DisassociationProtectionEnabled: Match.absent() }),
      ],
    });
  });

  test('TableV2MultiAccountReplica renders DisassociationProtectionEnabled only when declared', () => {
    // GIVEN
    const app = new App();
    const sourceStack = new Stack(app, 'SourceStack', { env: { account: '111111111111', region: 'us-east-2' } });
    const declaredStack = new Stack(app, 'DeclaredStack', { env: { account: '222222222222', region: 'us-east-1' } });
    const undeclaredStack = new Stack(app, 'UndeclaredStack', { env: { account: '333333333333', region: 'us-east-1' } });
    const sourceTable = new TableV2(sourceStack, 'SourceTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
    });

    // WHEN
    new TableV2MultiAccountReplica(declaredStack, 'ReplicaTable', {
      replicaSourceTable: sourceTable,
      disassociationProtection: false,
    });
    new TableV2MultiAccountReplica(undeclaredStack, 'ReplicaTable', {
      replicaSourceTable: sourceTable,
    });

    // THEN
    Template.fromStack(declaredStack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: Match.absent(),
      Replicas: [Match.objectLike({ Region: 'us-east-1', DisassociationProtectionEnabled: false })],
    });
    Template.fromStack(undeclaredStack).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      TableType: Match.absent(),
      Replicas: [Match.objectLike({ Region: 'us-east-1', DisassociationProtectionEnabled: Match.absent() })],
    });
  });

  test('replacing TableV2MultiAccountReplica with TableV2 keeps the logical ID and the replica resource policy', () => {
    // GIVEN
    function replicaResource(useTableV2: boolean) {
      const app = new App();
      const sourceStack = new Stack(app, 'SourceStack', { env: { account: '111111111111', region: 'us-east-1' } });
      const replicaStack = new Stack(app, 'ReplicaStack', { env: { account: '222222222222', region: 'us-east-2' } });
      const sourceTable = new TableV2(sourceStack, 'SourceTable', {
        tableName: 'Music',
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        tableType: TableType.GLOBAL_TABLE_REPLICA,
      });
      if (useTableV2) {
        const table = new TableV2(replicaStack, 'ReplicaTable', {
          tableName: 'Music',
          partitionKey: { name: 'pk', type: AttributeType.STRING },
          tableType: TableType.REGIONAL,
          dynamoStream: StreamViewType.NEW_AND_OLD_IMAGES,
        });
        table.grants.multiAccountReplicationFrom(sourceTable.tableArn);
        sourceTable.grants.multiAccountReplicationTo(table.tableArn);
      } else {
        new TableV2MultiAccountReplica(replicaStack, 'ReplicaTable', {
          tableName: 'Music',
          replicaSourceTable: sourceTable,
          disassociationProtection: false,
        });
      }
      const resources = Template.fromStack(replicaStack).findResources('AWS::DynamoDB::GlobalTable');
      return { resources, source: Template.fromStack(sourceStack).toJSON() };
    }

    // WHEN
    const before = replicaResource(false);
    const after = replicaResource(true);

    // THEN
    const [beforeId] = Object.keys(before.resources);
    expect(Object.keys(after.resources)).toEqual([beforeId]);
    expect(after.resources[beforeId].Properties.Replicas[0].ResourcePolicy)
      .toEqual(before.resources[beforeId].Properties.Replicas[0].ResourcePolicy);
    expect(after.source).toEqual(before.source);
  });
});
