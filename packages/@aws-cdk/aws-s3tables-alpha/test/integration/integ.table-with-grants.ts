import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../../lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as perms from '../../lib/permissions';

const PRINCIPAL = 's3.amazonaws.com';

abstract class GrantTestBase extends core.Stack {
  public readonly table: s3tables.Table;
  public readonly tableBucket: s3tables.TableBucket;
  public readonly namespace: s3tables.Namespace;
  abstract readonly tableName: string;
  abstract readonly actions: string[];

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.tableBucket = new s3tables.TableBucket(this, 'TableBucket', {
      tableBucketName: `${id}-bucket`,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    this.namespace = new s3tables.Namespace(this, 'Namespace', {
      tableBucket: this.tableBucket,
      namespaceName: 'test_namespace',
    });
    this.table = new s3tables.Table(this, 'Table', {
      tableName: id.replace(/-/g, '_'),
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      removalPolicy: core.RemovalPolicy.DESTROY,
      withoutMetadata: true,
    });
    this.grantAccess();
  }
  abstract grantAccess(): void;
}

class GrantReadTest extends GrantTestBase {
  tableName = 'grant_read_table';
  actions = perms.TABLE_READ_ACCESS;
  grantAccess() {
    this.table.grantRead(new iam.ServicePrincipal(PRINCIPAL));
  }
}

class GrantWriteTest extends GrantTestBase {
  tableName = 'grant_write_table';
  actions = perms.TABLE_WRITE_ACCESS;
  grantAccess() {
    this.table.grantWrite(new iam.ServicePrincipal(PRINCIPAL));
  }
}

class GrantReadWriteTest extends GrantTestBase {
  tableName = 'grant_read_write_table';
  actions = perms.TABLE_READ_WRITE_ACCESS;
  grantAccess() {
    this.table.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL));
  }
}

const app = new core.App();

const testCases = [
  new GrantReadTest(app, 'grant-read-table'),
  new GrantWriteTest(app, 'grant-write-table'),
  new GrantReadWriteTest(app, 'grant-read-write-table'),
];
const integ = new IntegTest(app, 'TableWithGrantIntegTest', { testCases });

testCases.forEach(testCase => {
  const tablePolicy = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTablePolicyCommand', {
    tableBucketARN: testCase.tableBucket.tableBucketArn,
    namespace: testCase.namespace.namespaceName,
    name: testCase.table.tableName,
  });

  tablePolicy.expect(ExpectedResult.objectLike({
    resourcePolicy: Match.serializedJson({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Service: PRINCIPAL,
          },
          Action: testCase.actions.length > 1 ? testCase.actions.sort() : testCase.actions[0],
          Resource: Match.stringLikeRegexp(testCase.table.tableArn),
        },
      ],
    }),
  }));
});

app.synth();
