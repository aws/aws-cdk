import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3vectors from '../lib';

/**
 * Snapshot test for vector bucket with IAM grants
 */
class VectorBucketWithGrantsTestStack extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly index: s3vectors.Index;
  public readonly readRole: iam.Role;
  public readonly writeRole: iam.Role;
  public readonly readWriteRole: iam.Role;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.vectorBucket = new s3vectors.VectorBucket(this, 'VectorBucket', {
      vectorBucketName: 'vector-bucket-with-grants',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.index = new s3vectors.Index(this, 'Index', {
      vectorBucket: this.vectorBucket,
      indexName: 'test-index',
      dimension: 1536,
      distanceMetric: s3vectors.DistanceMetric.COSINE,
    });

    // Create roles for testing grants
    this.readRole = new iam.Role(this, 'ReadRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role with read permissions to vector bucket',
    });

    this.writeRole = new iam.Role(this, 'WriteRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role with write permissions to vector bucket',
    });

    this.readWriteRole = new iam.Role(this, 'ReadWriteRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role with read/write permissions to vector bucket',
    });

    // Grant permissions
    this.vectorBucket.grantRead(this.readRole, '*');
    this.vectorBucket.grantWrite(this.writeRole, '*');
    this.vectorBucket.grantReadWrite(this.readWriteRole, '*');

    // Grant permissions to specific index
    this.vectorBucket.grantRead(this.readRole, 'test-index');
  }
}

const app = new core.App();

const vectorBucketWithGrantsTest = new VectorBucketWithGrantsTestStack(app, 'VectorBucketWithGrantsTestStack');

new IntegTest(app, 'VectorBucketWithGrantsIntegTest', {
  testCases: [vectorBucketWithGrantsTest],
});
