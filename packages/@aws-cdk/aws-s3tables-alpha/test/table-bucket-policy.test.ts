import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('TableBucketPolicy', () => {
  const TABLE_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TableBucketPolicy';

  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    let tableBucketPolicy: s3tables.TableBucketPolicy;
    let tableBucket: s3tables.TableBucket;

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'test-bucket', {
        tableBucketName: 'test-bucket',
      }),
      tableBucketPolicy = new s3tables.TableBucketPolicy(stack, 'ExampleTableBucket', {
        tableBucket,
        resourcePolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['s3tables:*'],
              resources: ['*'],
            }),
          ],
        }),
      });
    });

    test(`creates a ${TABLE_BUCKET_POLICY_CFN_RESOURCE} resource`, () => {
      tableBucketPolicy;
      Template.fromStack(stack).resourceCountIs(TABLE_BUCKET_POLICY_CFN_RESOURCE, 1);
    });

    test('with tableBucketARN property', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'TableBucketARN': {
          'Fn::GetAtt': ['testbucket04374B72', 'TableBucketARN'],
        },
      });
    });

    test('with tableBucketARN property', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'TableBucketARN': {
          'Fn::GetAtt': ['testbucket04374B72', 'TableBucketARN'],
        },
      });
    });

    test('bucket resourcePolicy contains statement', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
        'ResourcePolicy': {
          'Statement': [
            {
              'Action': 's3tables:*',
              'Effect': 'Allow',
              'Resource': '*',
            },
          ],
        },
      });
    });
  });
});
