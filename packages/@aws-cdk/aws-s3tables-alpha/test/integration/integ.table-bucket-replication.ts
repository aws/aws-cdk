import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Integ test cases for `TableBucket.replicationDestinations`.
 *
 * Case 1: in-account, in-region destination with an auto-created replication role.
 * Case 2: in-account, in-region destination with a bring-your-own (BYO) replication role.
 * Case 3: KMS-encrypted source and destination buckets with an auto-created role,
 *         so the role is granted the necessary permissions on both KMS keys.
 *
 * Each stack deploys only the source and destination `TableBucket`s (plus a BYO
 * role and KMS keys in the relevant cases). The source namespace and table are
 * created via integ assertions *after* deploy succeeds and deleted *before*
 * CloudFormation teardown. This keeps the destination bucket empty whenever a
 * deploy is interrupted — replication can only start once the source table
 * exists, so a rollback never leaves replicated content that would block
 * destination-bucket deletion.
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
      tableBucketName: 'integ-tb-repl-dst-v9',
    });

    this.source = new s3tables.TableBucket(this, 'Src', {
      tableBucketName: 'integ-tb-repl-src-v9',
      replicationDestinations: [this.destination],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    verifyTableReplicates(integ, this.source, this.destination);
  }
}

class BringYourOwnRoleReplicationStack extends ReplicationTestBase {
  public readonly source: s3tables.TableBucket;
  public readonly destination: s3tables.TableBucket;
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.destination = new s3tables.TableBucket(this, 'Dest', {
      tableBucketName: 'integ-tb-repl-byo-dst-v9',
    });

    this.role = new iam.Role(this, 'ReplicationRole', {
      assumedBy: new iam.ServicePrincipal('replication.s3tables.amazonaws.com'),
    });

    // Formatted up-front so we can scope the policy before creating the source bucket.
    const sourceArn = core.Stack.of(this).formatArn({
      service: 's3tables',
      resource: 'bucket',
      resourceName: 'integ-tb-repl-byo-src-v9',
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
      tableBucketName: 'integ-tb-repl-byo-src-v9',
      replicationDestinations: [this.destination],
      replicationRole: this.role,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    verifyTableReplicates(integ, this.source, this.destination);
  }
}

class KmsReplicationStack extends ReplicationTestBase {
  public readonly source: s3tables.TableBucket;
  public readonly destination: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const destKey = new kms.Key(this, 'DestKey', {
      enableKeyRotation: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.destination = new s3tables.TableBucket(this, 'Dest', {
      tableBucketName: 'integ-tb-repl-kms-dst-v9',
      encryption: s3tables.TableBucketEncryption.KMS,
      encryptionKey: destKey,
    });

    const sourceKey = new kms.Key(this, 'SourceKey', {
      enableKeyRotation: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.source = new s3tables.TableBucket(this, 'Src', {
      tableBucketName: 'integ-tb-repl-kms-src-v9',
      encryption: s3tables.TableBucketEncryption.KMS,
      encryptionKey: sourceKey,
      replicationDestinations: [this.destination],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    verifyTableReplicates(integ, this.source, this.destination);
  }
}

/**
 * Drives replication end-to-end via integ assertions:
 *
 *   1. Create a namespace and table on the source (this is what triggers
 *      replication — replication is table-scoped, an empty namespace alone
 *      never propagates).
 *   2. Poll the destination until the replicated table appears, confirming
 *      the replication pipeline works.
 *   3. Delete the source table and namespace. Doing this *before* touching
 *      the destination stops replication so the service doesn't re-push the
 *      table after we clean the destination but before CloudFormation deletes
 *      the destination bucket.
 *   4. Delete the replicated table on the destination, then the replicated
 *      namespace. The destination namespace is auto-created by replication
 *      and isn't cleaned up by deleting the table alone, so it must be
 *      deleted explicitly for CloudFormation to delete the destination
 *      bucket (S3 Tables refuses to delete non-empty buckets).
 */
function verifyTableReplicates(
  integ: IntegTest,
  source: s3tables.ITableBucket,
  destination: s3tables.ITableBucket,
) {
  const createSourceNamespace = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'CreateNamespaceCommand',
    {
      tableBucketARN: source.tableBucketArn,
      namespace: [REPL_NAMESPACE],
    },
  );

  const createSourceTable = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'CreateTableCommand',
    {
      tableBucketARN: source.tableBucketArn,
      namespace: REPL_NAMESPACE,
      name: REPL_TABLE,
      format: 'ICEBERG',
    },
  );

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

  const deleteSourceTable = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'DeleteTableCommand',
    {
      tableBucketARN: source.tableBucketArn,
      namespace: REPL_NAMESPACE,
      name: REPL_TABLE,
    },
  );

  const deleteSourceNamespace = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'DeleteNamespaceCommand',
    {
      tableBucketARN: source.tableBucketArn,
      namespace: REPL_NAMESPACE,
    },
  );

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

  createSourceNamespace
    .next(createSourceTable)
    .next(getDestinationTable)
    .next(deleteSourceTable)
    .next(deleteSourceNamespace)
    .next(deleteDestinationTable)
    .next(deleteDestinationNamespace);
}

const app = new core.App();

core.RemovalPolicies.of(app).apply(core.RemovalPolicy.DESTROY);

const testCases = [
  new InAccountReplicationStack(app, 'InAccountReplicationStack'),
  new BringYourOwnRoleReplicationStack(app, 'BringYourOwnRoleReplicationStack'),
  new KmsReplicationStack(app, 'KmsReplicationStack'),
];

const integ = new IntegTest(app, 'TableBucketReplicationIntegTest', {
  testCases,
});

for (const testCase of testCases) {
  testCase.validateAssertions(integ);
}
