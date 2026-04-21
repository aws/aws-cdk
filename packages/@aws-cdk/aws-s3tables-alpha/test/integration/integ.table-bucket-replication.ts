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
 * Cross-region coverage is intentionally omitted here to keep this integ test
 * scoped and fast; it can be added later once the in-account path is stable.
 */

abstract class ReplicationTestBase extends core.Stack {
  public abstract validateAssertions(integ: IntegTest): void;
}

class InAccountReplicationStack extends ReplicationTestBase {
  public readonly source: s3tables.TableBucket;
  public readonly destination: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.destination = new s3tables.TableBucket(this, 'Dest', {
      tableBucketName: 'integ-tb-repl-dst',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.source = new s3tables.TableBucket(this, 'Src', {
      tableBucketName: 'integ-tb-repl-src',
      replicationDestinations: [this.destination],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    const replicationConfig = integ.assertions.awsApiCall(
      '@aws-sdk/client-s3tables',
      'GetTableBucketReplicationCommand',
      { tableBucketARN: this.source.tableBucketArn },
    );

    replicationConfig.expect(ExpectedResult.objectLike({
      replicationConfiguration: {
        rules: [
          {
            destinations: [
              { destinationTableBucketArn: this.destination.tableBucketArn },
            ],
          },
        ],
      },
    }));
  }
}

class BringYourOwnRoleReplicationStack extends ReplicationTestBase {
  public readonly source: s3tables.TableBucket;
  public readonly destination: s3tables.TableBucket;
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.destination = new s3tables.TableBucket(this, 'Dest', {
      tableBucketName: 'integ-tb-repl-byo-dst',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.role = new iam.Role(this, 'ReplicationRole', {
      assumedBy: new iam.ServicePrincipal('replication.s3tables.amazonaws.com'),
    });

    // Minimal permissions required by the replication service for this integ test.
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        's3tables:ListTables',
        's3tables:GetTable',
        's3tables:GetTableMetadataLocation',
        's3tables:GetTableMaintenanceConfiguration',
        's3tables:GetTableData',
        's3tables:CreateNamespace',
        's3tables:CreateTable',
        's3tables:PutTableData',
        's3tables:UpdateTableMetadataLocation',
        's3tables:PutTableMaintenanceConfiguration',
      ],
      resources: ['*'],
    }));

    this.source = new s3tables.TableBucket(this, 'Src', {
      tableBucketName: 'integ-tb-repl-byo-src',
      replicationDestinations: [this.destination],
      replicationRole: this.role,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }

  public validateAssertions(integ: IntegTest) {
    const replicationConfig = integ.assertions.awsApiCall(
      '@aws-sdk/client-s3tables',
      'GetTableBucketReplicationCommand',
      { tableBucketARN: this.source.tableBucketArn },
    );

    replicationConfig.expect(ExpectedResult.objectLike({
      replicationConfiguration: {
        role: this.role.roleArn,
        rules: [
          {
            destinations: [
              { destinationTableBucketArn: this.destination.tableBucketArn },
            ],
          },
        ],
      },
    }));
  }
}

const app = new core.App();

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
