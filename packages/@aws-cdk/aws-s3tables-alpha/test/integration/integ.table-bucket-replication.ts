import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Integ test cases for `TableBucket.replicationDestinations`.
 *
 * Case 1: in-account, in-region destination with an auto-created replication role.
 * Case 2: in-account, in-region destination with a bring-your-own (BYO) replication role.
 *
 * Each case creates a namespace + table on the source as native CloudFormation
 * resources (L2 `Namespace` + `Table`) and then waits for the table to appear on
 * the destination — this exercises the replication pipeline end-to-end. S3
 * Tables replication operates at the table level, so an empty namespace alone
 * is never propagated; a table is required to trigger replication.
 *
 * Before the stacks tear down, the test also deletes the replicated
 * namespace/table from the destination so that CloudFormation can delete the
 * destination bucket cleanly (S3 Tables refuses to delete non-empty buckets).
 *
 * Cross-region coverage is intentionally omitted here to keep this integ test
 * scoped and fast; it can be added later once the in-account path is stable.
 */

const REPL_NAMESPACE = 'integreplns';
const REPL_TABLE = 'integrepltbl';

abstract class ReplicationTestBase extends core.Stack {
  public abstract validateAssertions(integ: IntegTest): void;
}

class InAccountReplicationStack extends ReplicationTestBase {
  public readonly source: s3tables.TableBucket;
  public readonly destination: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.destination = new s3tables.TableBucket(this, 'Dest', {
      tableBucketName: 'integ-tb-repl-dst-v4',
    });

    this.source = new s3tables.TableBucket(this, 'Src', {
      tableBucketName: 'integ-tb-repl-src-v4',
      replicationDestinations: [this.destination],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    createSourceTable(this, this.source);
  }

  public validateAssertions(integ: IntegTest) {
    verifyTableReplicates(integ, this.destination);
  }
}

class BringYourOwnRoleReplicationStack extends ReplicationTestBase {
  public readonly source: s3tables.TableBucket;
  public readonly destination: s3tables.TableBucket;
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.destination = new s3tables.TableBucket(this, 'Dest', {
      tableBucketName: 'integ-tb-repl-byo-dst-v4',
    });

    this.role = new iam.Role(this, 'ReplicationRole', {
      assumedBy: new iam.ServicePrincipal('replication.s3tables.amazonaws.com'),
    });

    // Formatted up-front so we can scope the policy before creating the source bucket.
    const sourceArn = core.Stack.of(this).formatArn({
      service: 's3tables',
      resource: 'bucket',
      resourceName: 'integ-tb-repl-byo-src-v4',
    });

    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        's3tables:ListTables',
      ],
      resources: [sourceArn],
    }));
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        's3tables:GetTable',
        's3tables:GetTableMetadataLocation',
        's3tables:GetTableMaintenanceConfiguration',
        's3tables:GetTableData',
      ],
      resources: [`${sourceArn}/table/*`],
    }));
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        's3tables:CreateNamespace',
        's3tables:CreateTable',
      ],
      resources: [this.destination.tableBucketArn],
    }));
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        's3tables:GetTableData',
        's3tables:PutTableData',
        's3tables:UpdateTableMetadataLocation',
        's3tables:PutTableMaintenanceConfiguration',
      ],
      resources: [`${this.destination.tableBucketArn}/table/*`],
    }));

    this.source = new s3tables.TableBucket(this, 'Src', {
      tableBucketName: 'integ-tb-repl-byo-src-v4',
      replicationDestinations: [this.destination],
      replicationRole: this.role,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    createSourceTable(this, this.source);
  }

  public validateAssertions(integ: IntegTest) {
    verifyTableReplicates(integ, this.destination);
  }
}

/**
 * Creates a namespace + empty Iceberg table on the source bucket as native CFN
 * resources. The table's presence is what the replication service picks up and
 * copies to the destination; an empty namespace alone would not be replicated.
 */
function createSourceTable(stack: core.Stack, source: s3tables.TableBucket) {
  const namespace = new s3tables.Namespace(stack, 'SrcNs', {
    namespaceName: REPL_NAMESPACE,
    tableBucket: source,
    removalPolicy: core.RemovalPolicy.DESTROY,
  });

  new s3tables.Table(stack, 'SrcTable', {
    tableName: REPL_TABLE,
    namespace,
    openTableFormat: s3tables.OpenTableFormat.ICEBERG,
    withoutMetadata: true,
    removalPolicy: core.RemovalPolicy.DESTROY,
  });
}

/**
 * Poll the destination for the replicated table (retrying until the replication
 * service has copied it across), then delete the replicated table + namespace
 * on the destination. The delete step is required because S3 Tables will reject
 * bucket deletion during stack teardown if any namespace remains.
 */
function verifyTableReplicates(
  integ: IntegTest,
  destination: s3tables.ITableBucket,
) {
  const getDestinationTable = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'GetTableCommand',
    {
      tableBucketARN: destination.tableBucketArn,
      namespace: REPL_NAMESPACE,
      name: REPL_TABLE,
    },
  ).expect(ExpectedResult.objectLike({
    name: REPL_TABLE,
  })).waitForAssertions({
    totalTimeout: core.Duration.minutes(15),
    interval: core.Duration.seconds(30),
  });

  const deleteDestinationTable = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'DeleteTableCommand',
    {
      tableBucketARN: destination.tableBucketArn,
      namespace: REPL_NAMESPACE,
      name: REPL_TABLE,
    },
  );

  const deleteDestinationNamespace = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'DeleteNamespaceCommand',
    {
      tableBucketARN: destination.tableBucketArn,
      namespace: REPL_NAMESPACE,
    },
  );

  getDestinationTable.next(deleteDestinationTable).next(deleteDestinationNamespace);
}

const app = new core.App();

core.RemovalPolicies.of(app).apply(core.RemovalPolicy.DESTROY);

const testCases = [
  new InAccountReplicationStack(app, 'InAccountReplicationStack'),
  new BringYourOwnRoleReplicationStack(app, 'BringYourOwnRoleReplicationStack'),
];

const integ = new IntegTest(app, 'TableBucketReplicationIntegTest', {
  testCases,
});

for (const testCase of testCases) {
  testCase.validateAssertions(integ);
}
