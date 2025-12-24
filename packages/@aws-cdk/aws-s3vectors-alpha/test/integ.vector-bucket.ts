import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3vectors from '../lib';

/**
 * Integration test for S3 Vectors - tests VectorBucket, Index, and VectorBucketPolicy
 */
class VectorBucketIntegTestStack extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;
  public readonly index: s3vectors.Index;
  public readonly vectorBucketPolicy: s3vectors.VectorBucketPolicy;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    // Create a vector bucket
    this.vectorBucket = new s3vectors.VectorBucket(this, 'VectorBucket', {
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // Create an index in the vector bucket
    this.index = new s3vectors.Index(this, 'Index', {
      vectorBucket: this.vectorBucket,
      dimension: 1536,
      distanceMetric: s3vectors.DistanceMetric.COSINE,
    });

    // Create a vector bucket policy
    this.vectorBucketPolicy = new s3vectors.VectorBucketPolicy(this, 'Policy', {
      vectorBucket: this.vectorBucket,
    });

    // Add a policy statement to allow read access from the current account
    this.vectorBucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AccountRootPrincipal()],
        actions: ['s3vectors:GetVector', 's3vectors:QueryVectors'],
        resources: [
          this.vectorBucket.vectorBucketArn,
          `${this.vectorBucket.vectorBucketArn}/*`,
        ],
      }),
    );

    // Output the bucket name to see what Ref returns
    new core.CfnOutput(this, 'VectorBucketNameOutput', {
      value: this.vectorBucket.vectorBucketName,
      description: 'The name of the vector bucket',
    });

    new core.CfnOutput(this, 'VectorBucketArnOutput', {
      value: this.vectorBucket.vectorBucketArn,
      description: 'The ARN of the vector bucket',
    });

    new core.CfnOutput(this, 'IndexNameOutput', {
      value: this.index.indexName,
      description: 'The name of the index',
    });

    new core.CfnOutput(this, 'IndexArnOutput', {
      value: this.index.indexArn,
      description: 'The ARN of the index',
    });
  }
}

const app = new core.App();

const testStack = new VectorBucketIntegTestStack(app, 'VectorBucketIntegTestStack');

new IntegTest(app, 'VectorBucketIntegTest', {
  testCases: [testStack],
});
