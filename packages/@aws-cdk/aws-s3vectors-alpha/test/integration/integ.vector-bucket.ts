import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import type { Construct } from 'constructs';
import * as s3vectors from '../../lib';

class TestStack extends core.Stack {
  public readonly plainBucket: s3vectors.VectorBucket;
  public readonly encryptedBucket: s3vectors.VectorBucket;
  public readonly vectorIndex: s3vectors.VectorIndex;
  public readonly key: kms.IKey;
  public readonly consumer: iam.Role;

  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    this.plainBucket = new s3vectors.VectorBucket(this, 'PlainBucket', {
      vectorBucketName: 'integ-vb-plain',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.consumer = new iam.Role(this, 'Consumer', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    this.plainBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3vectors:GetVectorBucket'],
      principals: [new iam.ArnPrincipal(this.consumer.roleArn)],
      resources: [this.plainBucket.vectorBucketArn],
    }));

    this.key = new kms.Key(this, 'Key', { removalPolicy: core.RemovalPolicy.DESTROY });
    this.encryptedBucket = new s3vectors.VectorBucket(this, 'EncryptedBucket', {
      vectorBucketName: 'integ-vb-encrypted',
      encryption: s3vectors.VectorBucketEncryption.KMS,
      encryptionKey: this.key,
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.vectorIndex = new s3vectors.VectorIndex(this, 'Index', {
      vectorBucket: this.encryptedBucket,
      indexName: 'integ-example-index',
      dimension: 1024,
      dataType: s3vectors.VectorDataType.FLOAT32,
      distanceMetric: s3vectors.DistanceMetric.COSINE,
      nonFilterableMetadataKeys: ['source', 'author'],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    this.encryptedBucket.grantReadWrite(this.consumer, '*');
    this.vectorIndex.grantReadWrite(this.consumer);
  }
}

const app = new core.App();

const stack = new TestStack(app, 'VectorBucketIntegTest');

const integ = new IntegTest(app, 'VectorBucketIntegTestCase', {
  testCases: [stack],
});

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
  vectorBucketArn: stack.plainBucket.vectorBucketArn,
}).expect(ExpectedResult.objectLike({
  vectorBucket: {
    vectorBucketName: 'integ-vb-plain',
  },
}));

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketCommand', {
  vectorBucketArn: stack.encryptedBucket.vectorBucketArn,
}).expect(ExpectedResult.objectLike({
  vectorBucket: {
    encryptionConfiguration: {
      sseType: 'aws:kms',
      kmsKeyArn: stack.key.keyArn,
    },
  },
}));

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetVectorBucketPolicyCommand', {
  vectorBucketArn: stack.plainBucket.vectorBucketArn,
}).expect(ExpectedResult.objectLike({
  policy: Match.stringLikeRegexp('s3vectors:GetVectorBucket'),
}));

integ.assertions.awsApiCall('@aws-sdk/client-s3vectors', 'GetIndexCommand', {
  indexArn: stack.vectorIndex.indexArn,
}).expect(ExpectedResult.objectLike({
  index: {
    indexName: 'integ-example-index',
    dimension: 1024,
    dataType: 'float32',
    distanceMetric: 'cosine',
  },
}));
