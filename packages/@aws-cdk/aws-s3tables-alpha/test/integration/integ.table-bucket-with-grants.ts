import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../../lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as perms from '../../lib/permissions';

const PRINCIPAL = 's3.amazonaws.com';

enum TestType {
  BUCKET_ONLY,
  ALL_TABLES,
}

abstract class GrantTestBase extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;
  abstract readonly tableBucketName: string;
  abstract readonly actions: string[];
  abstract readonly type: TestType;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.tableBucket = new s3tables.TableBucket(this, id, {
      tableBucketName: id,
      account: props?.env?.account,
      region: props?.env?.region,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    this.grantAccess();
  }
  abstract grantAccess(): void;
}

class GrantReadTest extends GrantTestBase {
  tableBucketName = 'grant-read-bucket';
  type = TestType.BUCKET_ONLY;
  actions = perms.TABLE_BUCKET_READ_ACCESS;
  grantAccess() {
    this.tableBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL));
  }
}

class GrantReadAllTablesTest extends GrantTestBase {
  tableBucketName = 'grant-read-bucket-all-tables';
  type = TestType.ALL_TABLES;
  actions = perms.TABLE_BUCKET_READ_ACCESS;
  grantAccess() {
    this.tableBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL), '*');
  }
}

class GrantWriteTest extends GrantTestBase {
  tableBucketName = 'grant-write-bucket';
  type = TestType.BUCKET_ONLY;
  actions = perms.TABLE_BUCKET_WRITE_ACCESS;
  grantAccess() {
    this.tableBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL));
  }
}

class GrantWriteAllTablesTest extends GrantTestBase {
  tableBucketName = 'grant-write-bucket-all-tables';
  type = TestType.ALL_TABLES;
  actions = perms.TABLE_BUCKET_WRITE_ACCESS;
  grantAccess() {
    this.tableBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL), '*');
  }
}

class GrantReadWriteTest extends GrantTestBase {
  tableBucketName = 'grant-read-write-bucket';
  type = TestType.BUCKET_ONLY;
  actions = perms.TABLE_BUCKET_READ_WRITE_ACCESS;
  grantAccess() {
    this.tableBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL));
  }
}

class GrantReadWriteAllTablesTest extends GrantTestBase {
  tableBucketName = 'grant-read-write-bucket-all-tables';
  type = TestType.ALL_TABLES;
  actions = perms.TABLE_BUCKET_READ_WRITE_ACCESS;
  grantAccess() {
    this.tableBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL), '*');
  }
}

const app = new core.App();

const testCases = [
  new GrantReadTest(app, 'grant-read-bucket'),
  new GrantReadAllTablesTest(app, 'grant-read-bucket-all-tables'),
  new GrantWriteTest(app, 'grant-write-bucket'),
  new GrantWriteAllTablesTest(app, 'grant-write-bucket-all-tables'),
  new GrantReadWriteTest(app, 'grant-read-write-bucket'),
  new GrantReadWriteAllTablesTest(app, 'grant-read-write-bucket-all-tables'),
];
const integ = new IntegTest(app, 'TableBucketWithGrantIntegTest', { testCases });

const getTableBucketArn = (stack: GrantTestBase) => `arn:aws:s3tables:${stack.region}:${stack.account}:bucket/${stack.tableBucketName}`;
const getAllTablesArn = (stack: GrantTestBase) => `${getTableBucketArn(stack)}/table/*`;

testCases.forEach(testCase => {
  const tableBucketPolicy = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'GetTableBucketPolicyCommand', {
    tableBucketARN: testCase.tableBucket.tableBucketArn,
  });

  let expectedResources = testCase.type == TestType.BUCKET_ONLY
    ? Match.stringLikeRegexp(getTableBucketArn(testCase))
    : [
      Match.stringLikeRegexp(getTableBucketArn(testCase)),
      Match.stringLikeRegexp(getAllTablesArn(testCase)),
    ];

  tableBucketPolicy.expect(ExpectedResult.objectLike({
    resourcePolicy: Match.serializedJson({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            Service: PRINCIPAL,
          },
          Action: testCase.actions.sort(),
          Resource: expectedResources,
        },
      ],
    }),
  }));
});

app.synth();
