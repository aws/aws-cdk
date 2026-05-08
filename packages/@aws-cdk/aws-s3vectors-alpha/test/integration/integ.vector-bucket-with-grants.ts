import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';
import * as perms from '../../lib/permissions';

const PRINCIPAL = 'lambda.amazonaws.com';
const INDEX_NAME = 'example-index';
const WILDCARD = '*';

enum TestType {
  SINGLE_INDEX,
  ALL_INDEXES,
}

abstract class GrantTestBase extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  abstract readonly vectorBucketName: string;
  abstract readonly actions: string[];
  abstract readonly type: TestType;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: id,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
    this.grantAccess();
  }
  abstract grantAccess(): void;
}

class GrantReadTest extends GrantTestBase {
  vectorBucketName = 'integ-vb-grant-read';
  type = TestType.SINGLE_INDEX;
  actions = perms.VECTOR_BUCKET_READ_ACCESS;
  grantAccess() {
    this.vectorBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL), INDEX_NAME);
  }
}

class GrantReadAllTest extends GrantTestBase {
  vectorBucketName = 'integ-vb-grant-read-all';
  type = TestType.ALL_INDEXES;
  actions = perms.VECTOR_BUCKET_READ_ACCESS;
  grantAccess() {
    this.vectorBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL), WILDCARD);
  }
}

class GrantWriteTest extends GrantTestBase {
  vectorBucketName = 'integ-vb-grant-write';
  type = TestType.SINGLE_INDEX;
  actions = perms.VECTOR_BUCKET_WRITE_ACCESS;
  grantAccess() {
    this.vectorBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL), INDEX_NAME);
  }
}

class GrantReadWriteTest extends GrantTestBase {
  vectorBucketName = 'integ-vb-grant-read-write';
  type = TestType.SINGLE_INDEX;
  actions = perms.VECTOR_BUCKET_READ_WRITE_ACCESS;
  grantAccess() {
    this.vectorBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL), INDEX_NAME);
  }
}

const app = new core.App();

const testCases: GrantTestBase[] = [
  new GrantReadTest(app, 'integ-vb-grant-read'),
  new GrantReadAllTest(app, 'integ-vb-grant-read-all'),
  new GrantWriteTest(app, 'integ-vb-grant-write'),
  new GrantReadWriteTest(app, 'integ-vb-grant-read-write'),
];

const integ = new IntegTest(app, 'VectorBucketWithGrantIntegTest', { testCases });

const getVectorBucketArn = (stack: GrantTestBase) => `arn:aws:s3vectors:${stack.region}:${stack.account}:bucket/${stack.vectorBucketName}`;
const getIndexArn = (stack: GrantTestBase, indexName: string) => `${getVectorBucketArn(stack)}/index/${indexName}`;

testCases.forEach(testCase => {
  const expectedResources = testCase.type === TestType.SINGLE_INDEX
    ? [
      Match.stringLikeRegexp(getVectorBucketArn(testCase)),
      Match.stringLikeRegexp(getIndexArn(testCase, INDEX_NAME)),
    ]
    : [
      Match.stringLikeRegexp(getVectorBucketArn(testCase)),
      Match.stringLikeRegexp(getIndexArn(testCase, WILDCARD)),
    ];

  integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketPolicyCommand', {
    vectorBucketArn: testCase.vectorBucket.vectorBucketArn,
  }).expect(ExpectedResult.objectLike({
    policy: Match.serializedJson({
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
