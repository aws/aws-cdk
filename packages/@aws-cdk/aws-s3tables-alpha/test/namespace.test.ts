import { Template } from 'aws-cdk-lib/assertions';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('Namespace', () => {
  const NAMESPACE_CFN_RESOURCE = 'AWS::S3Tables::Namespace';

  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    let namespace: s3tables.Namespace;
    let tableBucket: s3tables.TableBucket;

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'test-bucket', {
        tableBucketName: 'test-bucket',
      }),
      namespace = new s3tables.Namespace(stack, 'ExampleNamespace', {
        namespaceName: 'test-namespace',
        tableBucket,
      });
    });

    test(`creates a ${NAMESPACE_CFN_RESOURCE} resource`, () => {
      namespace;
      Template.fromStack(stack).resourceCountIs(NAMESPACE_CFN_RESOURCE, 1);
    });

    test('with tableBucketARN property', () => {
      Template.fromStack(stack).hasResourceProperties(NAMESPACE_CFN_RESOURCE, {
        'TableBucketARN': {
          'Fn::GetAtt': ['testbucket04374B72', 'TableBucketARN'],
        },
      });
    });

    test('with tableBucketARN property', () => {
      Template.fromStack(stack).hasResourceProperties(NAMESPACE_CFN_RESOURCE, {
        'TableBucketARN': {
          'Fn::GetAtt': ['testbucket04374B72', 'TableBucketARN'],
        },
      });
    });
  });
});
