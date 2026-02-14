import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { VectorBucket, VectorBucketPolicy } from '../lib';

describe('VectorBucketPolicy', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates a vector bucket policy', () => {
    // GIVEN
    const vectorBucket = new VectorBucket(stack, 'VectorBucket');

    // WHEN
    new VectorBucketPolicy(stack, 'Policy', {
      vectorBucket,
      resourcePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ['s3vectors:QueryVectors'],
            principals: [new iam.AccountRootPrincipal()],
            resources: [vectorBucket.vectorBucketArn],
          }),
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucketPolicy', {
      Policy: {
        Statement: [
          {
            Action: 's3vectors:QueryVectors',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ],
                ],
              },
            },
            Resource: {
              'Fn::GetAtt': ['VectorBucket7AA37AC5', 'VectorBucketArn'],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('creates policy with removal policy', () => {
    // GIVEN
    const vectorBucket = new VectorBucket(stack, 'VectorBucket');

    // WHEN
    new VectorBucketPolicy(stack, 'Policy', {
      vectorBucket,
      resourcePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ['s3vectors:*'],
            principals: [new iam.AccountRootPrincipal()],
            resources: [vectorBucket.vectorBucketArn],
          }),
        ],
      }),
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::S3Vectors::VectorBucketPolicy', {
      DeletionPolicy: 'Retain',
    });
  });

  test('addToResourcePolicy creates policy automatically', () => {
    // GIVEN
    const vectorBucket = new VectorBucket(stack, 'VectorBucket');

    // WHEN
    vectorBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3vectors:PutVectors'],
        principals: [new iam.AccountRootPrincipal()],
        resources: [`${vectorBucket.vectorBucketArn}/index/*`],
      }),
    );

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucketPolicy', {
      Policy: {
        Statement: [
          {
            Action: 's3vectors:PutVectors',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ],
                ],
              },
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': ['VectorBucket7AA37AC5', 'VectorBucketArn'],
                  },
                  '/index/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});
