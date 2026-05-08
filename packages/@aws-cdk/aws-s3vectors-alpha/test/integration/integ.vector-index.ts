import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';

class IndexStack extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly vectorIndex: s3vectors.VectorIndex;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: 'integ-vb-with-index',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.vectorIndex = new s3vectors.VectorIndex(this, 'Index', {
      vectorBucket: this.vectorBucket,
      indexName: 'integ-example-index',
      dimension: 1024,
      dataType: s3vectors.VectorDataType.FLOAT32,
      distanceMetric: s3vectors.DistanceMetric.COSINE,
      nonFilterableMetadataKeys: ['source', 'author'],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const stack = new IndexStack(app, 'VectorIndexIntegTest');

const integ = new IntegTest(app, 'VectorIndexIntegTestCase', {
  testCases: [stack],
});

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetIndexCommand', {
  indexArn: stack.vectorIndex.indexArn,
}).expect(ExpectedResult.objectLike({
  index: {
    indexArn: stack.vectorIndex.indexArn,
    indexName: 'integ-example-index',
    dimension: 1024,
    dataType: 'float32',
    distanceMetric: 'cosine',
  },
}));

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'ListIndexesCommand', {
  vectorBucketArn: stack.vectorBucket.vectorBucketArn,
}).expect(ExpectedResult.objectLike({
  indexes: [{
    indexName: 'integ-example-index',
  }],
}));

app.synth();
