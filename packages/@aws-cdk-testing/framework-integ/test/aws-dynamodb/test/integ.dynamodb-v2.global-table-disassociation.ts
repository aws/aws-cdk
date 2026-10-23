import type { StackProps } from 'aws-cdk-lib';
import { Annotations, App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

/**
 * A global table declaring its type explicitly, with disassociation protection
 * enabled on the primary (inherited by the us-west-2 replica through the usual
 * propagation rules) and disabled on the opted-out replica.
 */
class GlobalTableStack extends Stack {
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.TableV2(this, 'GlobalTable', {
      tableName: 'aws-cdk-dynamodb-gt-disassociation-integ',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      tableType: dynamodb.TableType.GLOBAL_TABLE_REPLICA,
      disassociationProtection: true,
      replicas: [
        { region: 'us-west-2' },
        { region: 'us-east-2', disassociationProtection: false },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.tableName = table.tableName;
  }
}

/**
 * A standalone regional table created with an explicit Regional declaration.
 * This is also the template shape a disassociating update converges to, so it
 * validates that the handler accepts the shape on create. A new regional table
 * does not need the stream a disassociating table keeps, so the warning about the
 * missing stream is acknowledged.
 *
 * The disassociation itself (an update from a global table replica to Regional on
 * an existing stack) is a sequence of two stack updates and cannot be modeled as a
 * single snapshot.
 */
class RegionalTableStack extends Stack {
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.TableV2(this, 'RegionalTable', {
      tableName: 'aws-cdk-dynamodb-regional-tabletype-integ',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      tableType: dynamodb.TableType.REGIONAL,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    Annotations.of(table).acknowledgeWarning(
      '@aws-cdk/aws-dynamodb:regionalTableTypeWithoutStream',
      'A new regional table that never belonged to a global table needs no stream',
    );

    this.tableName = table.tableName;
  }
}

const globalTableStack = new GlobalTableStack(app, 'aws-cdk-dynamodb-gt-disassociation', {
  env: { region: 'us-east-1' },
});
const regionalTableStack = new RegionalTableStack(app, 'aws-cdk-dynamodb-regional-tabletype', {
  env: { region: 'us-east-1' },
});

const integ = new IntegTest(app, 'dynamodb-gt-disassociation-test', {
  testCases: [globalTableStack, regionalTableStack],
});

// Verify both tables were created and are ACTIVE.
integ.assertions.awsApiCall('DynamoDB', 'describeTable', {
  TableName: globalTableStack.tableName,
}).expect(ExpectedResult.objectLike({
  Table: {
    TableStatus: 'ACTIVE',
  },
}));

integ.assertions.awsApiCall('DynamoDB', 'describeTable', {
  TableName: regionalTableStack.tableName,
}).expect(ExpectedResult.objectLike({
  Table: {
    TableStatus: 'ACTIVE',
  },
}));
