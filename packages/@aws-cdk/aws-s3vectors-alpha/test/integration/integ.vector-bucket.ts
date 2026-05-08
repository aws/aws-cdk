import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';

/**
 * Snapshot test for a vector bucket with default parameters.
 */
class DefaultTestStack extends core.Stack {
  public readonly vectorBucket: s3vectors.VectorBucket;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.vectorBucket = new s3vectors.VectorBucket(this, 'DefaultBucket', {
      vectorBucketName: 'integ-vector-default-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });
  }
}

const app = new core.App();

const defaultStack = new DefaultTestStack(app, 'VectorBucketIntegTest');

const integ = new IntegTest(app, 'VectorBucketIntegTestCase', {
  testCases: [defaultStack],
});

const getVectorBucket = integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
  vectorBucketArn: defaultStack.vectorBucket.vectorBucketArn,
});

getVectorBucket.expect(ExpectedResult.objectLike({
  vectorBucket: {
    vectorBucketArn: defaultStack.vectorBucket.vectorBucketArn,
    vectorBucketName: 'integ-vector-default-bucket',
  },
}));

app.synth();
