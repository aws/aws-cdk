import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';

/* eslint-disable @stylistic/quote-props */

const VECTOR_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucketPolicy';

describe('VectorBucketPolicy', () => {
  let stack: core.Stack;
  let vectorBucket: s3vectors.VectorBucket;

  beforeEach(() => {
    stack = new core.Stack();
    vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
      vectorBucketName: 'example-vector-bucket',
    });
  });

  test('creates a bucket policy resource attached to the bucket ARN', () => {
    new s3vectors.VectorBucketPolicy(stack, 'ExamplePolicy', {
      vectorBucket,
      resourcePolicy: new iam.PolicyDocument({
        statements: [new iam.PolicyStatement({
          actions: ['s3vectors:GetVectorBucket'],
          principals: [new iam.AccountPrincipal('111122223333')],
          resources: ['*'],
        })],
      }),
    });
    Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 1);
    Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
      'VectorBucketArn': { 'Fn::GetAtt': ['ExampleVectorBucketC67D306D', 'VectorBucketArn'] },
    });
  });

  test('uses the provided resourcePolicy document', () => {
    const document = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['s3vectors:GetVectorBucket'],
          principals: [new iam.AccountPrincipal('111122223333')],
          resources: ['*'],
        }),
      ],
    });

    new s3vectors.VectorBucketPolicy(stack, 'ExamplePolicy', {
      vectorBucket,
      resourcePolicy: document,
    });

    Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
      'Policy': {
        'Statement': [
          {
            'Action': 's3vectors:GetVectorBucket',
            'Effect': 'Allow',
            'Resource': '*',
          },
        ],
      },
    });
  });

  test('applies the removal policy to the underlying resource', () => {
    new s3vectors.VectorBucketPolicy(stack, 'ExamplePolicy', {
      vectorBucket,
      resourcePolicy: new iam.PolicyDocument({
        statements: [new iam.PolicyStatement({
          actions: ['s3vectors:GetVectorBucket'],
          principals: [new iam.AccountPrincipal('111122223333')],
          resources: ['*'],
        })],
      }),
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResource(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
      'DeletionPolicy': 'Delete',
    });
  });
});
