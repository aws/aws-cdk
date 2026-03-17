import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3tables from '../../lib';

/**
 * Test for tagging a table bucket
 */
class TaggedTableBucketStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'TaggedBucket', {
      tableBucketName: 'tagged-table-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    core.Tags.of(this.tableBucket).add('Environment', 'Test');
    core.Tags.of(this.tableBucket).add('Project', 'S3Tables');
  }
}

/**
 * Test for tagging a table
 */
class TaggedTableStack extends core.Stack {
  public readonly tableBucket: s3tables.TableBucket;
  public readonly namespace: s3tables.Namespace;
  public readonly table: s3tables.Table;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.tableBucket = new s3tables.TableBucket(this, 'Bucket', {
      tableBucketName: 'tagged-table-test-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.namespace = new s3tables.Namespace(this, 'Namespace', {
      namespaceName: 'tagged_table_namespace',
      tableBucket: this.tableBucket,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.table = new s3tables.Table(this, 'TaggedTable', {
      tableName: 'tagged_test_table',
      namespace: this.namespace,
      openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      withoutMetadata: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    core.Tags.of(this.table).add('Environment', 'Test');
    core.Tags.of(this.table).add('Project', 'S3Tables');
  }
}

const app = new core.App();

const taggedBucketTest = new TaggedTableBucketStack(app, 'TaggedTableBucketStack');
const taggedTableTest = new TaggedTableStack(app, 'TaggedTableStack');

const integ = new IntegTest(app, 'TaggingIntegTest', {
  testCases: [taggedBucketTest, taggedTableTest],
});

// Assert tags on table bucket
const tableBucketTags = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListTagsForResourceCommand', {
  resourceArn: taggedBucketTest.tableBucket.tableBucketArn,
});

tableBucketTags.expect(ExpectedResult.objectLike({
  tags: Match.objectLike({
    Environment: 'Test',
    Project: 'S3Tables',
  }),
}));

// Assert tags on table
const tableTags = integ.assertions.awsApiCall('@aws-sdk/client-s3tables', 'ListTagsForResourceCommand', {
  resourceArn: taggedTableTest.table.tableArn,
});

tableTags.expect(ExpectedResult.objectLike({
  tags: Match.objectLike({
    Environment: 'Test',
    Project: 'S3Tables',
  }),
}));

