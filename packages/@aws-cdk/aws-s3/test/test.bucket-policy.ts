import { expect, haveResource } from '@aws-cdk/assert';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { RemovalPolicy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as s3 from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */

export = {
  'default properties'(test: Test) {
    const stack = new Stack();

    const myBucket = new s3.Bucket(stack, 'MyBucket');
    const myBucketPolicy = new s3.BucketPolicy(stack, 'MyBucketPolicy', {
      bucket: myBucket,
    });
    myBucketPolicy.document.addStatements(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
    }));

    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      Bucket: {
        'Ref': 'MyBucketF68F3FF0',
      },
      PolicyDocument: {
        'Version': '2012-10-17',
        'Statement': [
          {
            'Action': 's3:GetObject*',
            'Effect': 'Allow',
            'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
          },
        ],
      },
    }));

    test.done();
  },

  'when specifying a removalPolicy at creation'(test: Test) {
    const stack = new Stack();

    const myBucket = new s3.Bucket(stack, 'MyBucket');
    const myBucketPolicy = new s3.BucketPolicy(stack, 'MyBucketPolicy', {
      bucket: myBucket,
      removalPolicy: RemovalPolicy.RETAIN,
    });
    myBucketPolicy.document.addStatements(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
    }));

    expect(stack).toMatch({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
        'MyBucketPolicy0AFEFDBE': {
          'Type': 'AWS::S3::BucketPolicy',
          'Properties': {
            'Bucket': {
              'Ref': 'MyBucketF68F3FF0',
            },
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': 's3:GetObject*',
                  'Effect': 'Allow',
                  'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                },
              ],
              'Version': '2012-10-17',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });

    test.done();
  },

  'when specifying a removalPolicy after creation'(test: Test) {
    const stack = new Stack();

    const myBucket = new s3.Bucket(stack, 'MyBucket');
    myBucket.addToResourcePolicy(new PolicyStatement({
      resources: [myBucket.bucketArn],
      actions: ['s3:GetObject*'],
    }));
    myBucket.policy?.applyRemovalPolicy(RemovalPolicy.RETAIN);

    expect(stack).toMatch({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
        'MyBucketPolicyE7FBAC7B': {
          'Type': 'AWS::S3::BucketPolicy',
          'Properties': {
            'Bucket': {
              'Ref': 'MyBucketF68F3FF0',
            },
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': 's3:GetObject*',
                  'Effect': 'Allow',
                  'Resource': { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                },
              ],
              'Version': '2012-10-17',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });

    test.done();
  },
};