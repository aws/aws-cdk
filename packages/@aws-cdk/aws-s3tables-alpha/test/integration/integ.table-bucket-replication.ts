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
 * In addition to verifying that the replication configuration is emitted on the
 * source bucket, each case also creates a namespace on the source and waits for
 * the replication service to propagate it to the destination — this is the
 * end-to-end behaviour users ultimately care about.
 *
 * Cross-region coverage is intentionally omitted here to keep this integ test
 * scoped and fast; it can be added later once the in-account path is stable.
 */

const REPL_NAMESPACE = 'integreplns';

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

    verifyNamespaceReplicates(integ, this.source, this.destination, replicationConfig);
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

    // Formatted up-front so we can scope the policy before creating the source bucket.
    const sourceArn = core.Stack.of(this).formatArn({
      service: 's3tables',
      resource: 'bucket',
      resourceName: 'integ-tb-repl-byo-src',
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

    verifyNamespaceReplicates(integ, this.source, this.destination, replicationConfig);
  }
}

/**
 * Chain: create a namespace on the source, then poll the destination until it
 * appears (or the total timeout is reached). The `GetNamespaceCommand` call
 * will throw `NotFoundException` until the replication service has propagated
 * the namespace, so `waitForAssertions` retries it.
 */
function verifyNamespaceReplicates(
  integ: IntegTest,
  source: s3tables.ITableBucket,
  destination: s3tables.ITableBucket,
  previous: ReturnType<IntegTest['assertions']['awsApiCall']>,
) {
  const createNamespace = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'CreateNamespaceCommand',
    {
      tableBucketARN: source.tableBucketArn,
      namespace: [REPL_NAMESPACE],
    },
  );

  const getDestinationNamespace = integ.assertions.awsApiCall(
    '@aws-sdk/client-s3tables',
    'GetNamespaceCommand',
    {
      tableBucketARN: destination.tableBucketArn,
      namespace: REPL_NAMESPACE,
    },
  ).expect(ExpectedResult.objectLike({
    namespace: [REPL_NAMESPACE],
  })).waitForAssertions({
    totalTimeout: core.Duration.minutes(15),
    interval: core.Duration.seconds(30),
  });

  previous.next(createNamespace).next(getDestinationNamespace);
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
