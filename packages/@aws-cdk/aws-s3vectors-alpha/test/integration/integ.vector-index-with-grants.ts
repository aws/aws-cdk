import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';

class IndexGrantsStack extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly vectorIndex: s3vectors.VectorIndex;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.vectorBucket = new s3vectors.VectorBucket(this, 'Bucket', {
      vectorBucketName: 'integ-vi-with-grants',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.vectorIndex = new s3vectors.VectorIndex(this, 'Index', {
      vectorBucket: this.vectorBucket,
      indexName: 'integ-example-index',
      dimension: 256,
      dataType: s3vectors.VectorDataType.FLOAT32,
      distanceMetric: s3vectors.DistanceMetric.COSINE,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    const role = new iam.Role(this, 'ConsumerRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    this.vectorIndex.grantReadWrite(role);
  }
}

const app = new core.App();

const stack = new IndexGrantsStack(app, 'VectorIndexGrantsIntegTest');

new IntegTest(app, 'VectorIndexGrantsIntegTestCase', {
  testCases: [stack],
});

app.synth();
