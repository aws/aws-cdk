import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3tables from '../lib';
import * as perms from '../lib/permissions';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */

describe('TableBucket', () => {
  const TABLE_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Tables::TableBucketPolicy';

  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('grant access methods', () => {
    const PRINCIPAL = 's3.amazonaws.com';
    const DEFAULT_PROPS: s3tables.TableBucketProps = {
      tableBucketName: 'example-table-bucket',
    };
    const TABLE_BUCKET_ARN_SUB = {
      'Fn::GetAtt': ['ExampleTableBucket9B5A2796', 'TableBucketARN'],
    };
    let tableBucket: s3tables.TableBucket;

    beforeEach(() => {
      tableBucket = new s3tables.TableBucket(stack, 'ExampleTableBucket', DEFAULT_PROPS);
    });

    describe('grantRead', () => {
      it('provides read and list permissions for all tables', () => {
        tableBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL));
        Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
          'ResourcePolicy': {
            'Statement': [
              {
                'Action': perms.TABLE_BUCKET_READ_ACCESS,
                'Effect': 'Allow',
                'Principal': {
                  'Service': PRINCIPAL,
                },
                'Resource': [
                  TABLE_BUCKET_ARN_SUB,
                  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, '/table/*']] },
                ],
              },
            ],
          },
        });
      });

      it('provides read and list permissions for a specific table', () => {
        const TABLE_UUID = 'example-table-uuid';
        tableBucket.grantRead(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
        Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
          'ResourcePolicy': {
            'Statement': [
              {
                'Action': perms.TABLE_BUCKET_READ_ACCESS,
                'Effect': 'Allow',
                'Principal': {
                  'Service': PRINCIPAL,
                },
                'Resource': [
                  TABLE_BUCKET_ARN_SUB,
                  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${TABLE_UUID}`]] },
                ],
              },
            ],
          },
        });
      });
    });

    describe('grantWrite', () => {
      it('provides write permissions for all tables', () => {
        tableBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL));
        Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
          'ResourcePolicy': {
            'Statement': [
              {
                'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
                'Effect': 'Allow',
                'Principal': {
                  'Service': PRINCIPAL,
                },
                'Resource': [
                  TABLE_BUCKET_ARN_SUB,
                  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, '/table/*']] },
                ],
              },
            ],
          },
        });
      });

      it('provides write permissions for a specific table', () => {
        const TABLE_UUID = 'example-table-uuid';
        tableBucket.grantWrite(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
        Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
          'ResourcePolicy': {
            'Statement': [
              {
                'Action': perms.TABLE_BUCKET_WRITE_ACCESS,
                'Effect': 'Allow',
                'Principal': {
                  'Service': PRINCIPAL,
                },
                'Resource': [
                  TABLE_BUCKET_ARN_SUB,
                  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${TABLE_UUID}`]] },
                ],
              },
            ],
          },
        });
      });
    });

    describe('grantReadWrite', () => {
      it('provides read & write permissions for all tables', () => {
        tableBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL));
        Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
          'ResourcePolicy': {
            'Statement': [
              {
                'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
                'Effect': 'Allow',
                'Principal': {
                  'Service': PRINCIPAL,
                },
                'Resource': [
                  TABLE_BUCKET_ARN_SUB,
                  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, '/table/*']] },
                ],
              },
            ],
          },
        });
      });

      it('provides read & write permissions for a specific table', () => {
        const TABLE_UUID = 'example-table-uuid';
        tableBucket.grantReadWrite(new iam.ServicePrincipal(PRINCIPAL), TABLE_UUID);
        Template.fromStack(stack).hasResourceProperties(TABLE_BUCKET_POLICY_CFN_RESOURCE, {
          'ResourcePolicy': {
            'Statement': [
              {
                'Action': perms.TABLE_BUCKET_READ_WRITE_ACCESS,
                'Effect': 'Allow',
                'Principal': {
                  'Service': PRINCIPAL,
                },
                'Resource': [
                  TABLE_BUCKET_ARN_SUB,
                  { 'Fn::Join': ['', [TABLE_BUCKET_ARN_SUB, `/table/${TABLE_UUID}`]] },
                ],
              },
            ],
          },
        });
      });
    });
  });

  describe('validateBucketName', () => {
    it('should accept valid bucket names', () => {
      const validNames = [
        'my-bucket-123',
        'test-bucket',
        'abc',
        'a'.repeat(63),
        '123-bucket',
      ];

      validNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).not.toThrow();
      });
    });

    it('should skip validation for unresolved tokens', () => {
      // const mockToken = { isUnresolved: true };
      // core.Token.isUnresolved = jest.fn().mockReturnValue(true);
      expect(() => s3tables.TableBucket.validateTableBucketName(undefined)).not.toThrow();
    });

    it('should reject bucket names that are too short', () => {
      expect(() => s3tables.TableBucket.validateTableBucketName('XX')).toThrow(
        /Bucket name must be at least 3/,
      );
    });

    it('should reject bucket names that are too long', () => {
      const longName = 'a'.repeat(64);
      expect(() => s3tables.TableBucket.validateTableBucketName(longName)).toThrow(
        /no more than 63 characters/,
      );
    });

    it('should reject bucket names with illegal characters', () => {
      const invalidNames = [
        'My-Bucket', // uppercase
        'bucket!123', // special character
        'bucket.123', // period
        'bucket_123', // underscore
      ];

      invalidNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).toThrow(
          /must only contain lowercase characters, numbers, and hyphens/,
        );
      });
    });

    it('should reject bucket names that start with invalid characters', () => {
      const invalidNames = [
        '-bucket',
        '.bucket',
      ];

      invalidNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).toThrow(
          /must start with a lowercase letter or number/,
        );
      });
    });

    it('should reject bucket names that end with invalid characters', () => {
      const invalidNames = [
        'bucket-',
        'bucket.',
      ];

      invalidNames.forEach(name => {
        expect(() => s3tables.TableBucket.validateTableBucketName(name)).toThrow(
          /must end with a lowercase letter or number/,
        );
      });
    });

    it('should include the invalid bucket name in the error message', () => {
      const invalidName = 'Invalid-Bucket!';
      expect(() => s3tables.TableBucket.validateTableBucketName(invalidName)).toThrow(
        /Invalid-Bucket!/,
      );
    });

    it('should handle empty bucket names', () => {
      expect(() => s3tables.TableBucket.validateTableBucketName('')).toThrow(
        /Bucket name must be at least 3/,
      );
    });
  });
});
