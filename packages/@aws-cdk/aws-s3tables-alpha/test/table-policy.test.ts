import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('TablePolicy', () => {
  const TABLE_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TablePolicy';

  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    let table: s3tables.Table;

    beforeEach(() => {
      const tableBucket = new s3tables.TableBucket(stack, 'test-bucket', {
        tableBucketName: 'test-bucket',
      });
      const namespace = new s3tables.Namespace(stack, 'test-namespace', {
        tableBucket,
        namespaceName: 'test_namespace',
      });
      table = new s3tables.Table(stack, 'test-table', {
        tableName: 'test_table',
        namespace,
        openTableFormat: s3tables.OpenTableFormat.ICEBERG,
      });
      new s3tables.TablePolicy(stack, 'ExampleTablePolicy', {
        table,
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

    test(`creates a ${TABLE_POLICY_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(TABLE_POLICY_CFN_RESOURCE, 1);
    });

    test('with tableArn property', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
        'TableARN': {
          'Fn::GetAtt': ['testtableD2E6992A', 'TableARN'],
        },
      });
    });

    test('table resourcePolicy contains statement', () => {
      Template.fromStack(stack).hasResourceProperties(TABLE_POLICY_CFN_RESOURCE, {
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
