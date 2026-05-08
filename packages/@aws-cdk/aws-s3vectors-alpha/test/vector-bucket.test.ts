import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';

/* Allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable @stylistic/quote-props */

describe('VectorBucket', () => {
  const VECTOR_BUCKET_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucket';
  const VECTOR_BUCKET_POLICY_CFN_RESOURCE = 'AWS::S3Vectors::VectorBucketPolicy';

  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  describe('created with default properties', () => {
    const DEFAULT_PROPS: s3vectors.VectorBucketProps = {
      vectorBucketName: 'example-vector-bucket',
    };
    let vectorBucket: s3vectors.VectorBucket;

    beforeEach(() => {
      vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', DEFAULT_PROPS);
    });

    test(`creates a ${VECTOR_BUCKET_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_CFN_RESOURCE, 1);
    });

    test('with vectorBucketName property', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'VectorBucketName': DEFAULT_PROPS.vectorBucketName,
      });
    });

    test('has no encryption configuration by default', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'EncryptionConfiguration': Match.absent(),
      });
    });

    test('returns true from addToResourcePolicy', () => {
      const result = vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3vectors:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toBe(true);
    });

    test('has removalPolicy set to "Retain"', () => {
      Template.fromStack(stack).hasResource(VECTOR_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Retain',
      });
    });
  });

  describe('created without a name (auto-generated)', () => {
    beforeEach(() => {
      new s3vectors.VectorBucket(stack, 'AutoNamedBucket');
    });

    test('does not set VectorBucketName', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        'VectorBucketName': Match.absent(),
      });
    });
  });

  describe('created with explicit props', () => {
    const VECTOR_BUCKET_PROPS: s3vectors.VectorBucketProps = {
      vectorBucketName: 'example-vector-bucket',
      removalPolicy: core.RemovalPolicy.DESTROY,
    };

    beforeEach(() => {
      new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', VECTOR_BUCKET_PROPS);
    });

    test('has removalPolicy set to "Delete"', () => {
      Template.fromStack(stack).hasResource(VECTOR_BUCKET_CFN_RESOURCE, {
        'DeletionPolicy': 'Delete',
      });
    });
  });

  describe('defined with resource policy', () => {
    let vectorBucket: s3vectors.VectorBucket;

    beforeEach(() => {
      vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
        vectorBucketName: 'example-vector-bucket',
      });
      vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3vectors:*'],
        resources: ['*'],
      }));
    });

    test('resourcePolicy contains statement', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
        'Policy': {
          'Statement': [
            {
              'Action': 's3vectors:*',
              'Effect': 'Allow',
              'Resource': '*',
            },
          ],
        },
      });
    });

    test('calling multiple times appends statements', () => {
      vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.DENY,
        resources: ['*'],
      }));
      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_POLICY_CFN_RESOURCE, {
        'Policy': {
          'Statement': [
            {
              'Action': 's3vectors:*',
              'Effect': 'Allow',
              'Resource': '*',
            },
            {
              'Action': 's3:*',
              'Effect': 'Deny',
              'Resource': '*',
            },
          ],
        },
      });
    });

    test('reuses the auto-created VectorBucketPolicy', () => {
      vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3:*'],
        effect: iam.Effect.DENY,
        resources: ['*'],
      }));
      Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 1);
    });
  });

  describe('import existing vector bucket with name', () => {
    const BUCKET_PROPS = {
      vectorBucketName: 'example-vector-bucket',
    };
    let vectorBucket: s3vectors.IVectorBucket;

    beforeEach(() => {
      vectorBucket = s3vectors.VectorBucket.fromVectorBucketAttributes(stack, 'ExampleVectorBucket', BUCKET_PROPS);
    });

    test('has the same name as it was imported with', () => {
      expect(vectorBucket.vectorBucketName).toEqual(BUCKET_PROPS.vectorBucketName);
    });

    test('renders the correct ARN for example resource', () => {
      const arn = stack.resolve(vectorBucket.vectorBucketArn);
      expect(arn).toEqual({
        'Fn::Join': ['', [
          'arn:',
          { 'Ref': 'AWS::Partition' },
          ':s3vectors:',
          { 'Ref': 'AWS::Region' },
          ':',
          { 'Ref': 'AWS::AccountId' },
          `:bucket/${BUCKET_PROPS.vectorBucketName}`,
        ]],
      });
    });

    test('returns false from addToResourcePolicy', () => {
      const result = vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3vectors:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toEqual(false);
    });
  });

  describe('import existing vector bucket with arn', () => {
    const BUCKET_NAME = 'test-bucket';
    const ACCOUNT_ID = '123456789012';
    const REGION = 'us-west-2';
    const BUCKET_ARN = `arn:aws:s3vectors:${REGION}:${ACCOUNT_ID}:bucket/${BUCKET_NAME}`;
    let vectorBucket: s3vectors.IVectorBucket;

    beforeEach(() => {
      vectorBucket = s3vectors.VectorBucket.fromVectorBucketArn(stack, 'ExampleVectorBucket', BUCKET_ARN);
    });

    test('has the same name as it was imported with', () => {
      expect(vectorBucket.vectorBucketName).toEqual(BUCKET_NAME);
    });

    test('has the same region as it was imported with', () => {
      expect(vectorBucket.region).toEqual(REGION);
    });

    test('has the same account as it was imported with', () => {
      expect(vectorBucket.account).toEqual(ACCOUNT_ID);
    });

    test('returns false from addToResourcePolicy', () => {
      const result = vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['s3vectors:*'],
        resources: ['*'],
      }));

      expect(result.statementAdded).toEqual(false);
      Template.fromStack(stack).resourceCountIs(VECTOR_BUCKET_POLICY_CFN_RESOURCE, 0);
    });
  });

  describe('validateVectorBucketName', () => {
    it('should accept valid bucket names', () => {
      const validNames = [
        'my-bucket-123',
        'test-bucket',
        'abc',
        'a'.repeat(63),
        '123-bucket',
      ];

      validNames.forEach(name => {
        expect(() => s3vectors.VectorBucket.validateVectorBucketName(name)).not.toThrow();
      });
    });

    it('should skip validation for unresolved tokens', () => {
      const isUnresolved = core.Token.isUnresolved;
      core.Token.isUnresolved = jest.fn().mockReturnValue(true);
      expect(() => s3vectors.VectorBucket.validateVectorBucketName('unresolved')).not.toThrow();
      core.Token.isUnresolved = isUnresolved;
    });

    it('should skip validation for undefined name', () => {
      expect(() => s3vectors.VectorBucket.validateVectorBucketName(undefined)).not.toThrow();
    });

    it('should reject bucket names that are too short', () => {
      expect(() => s3vectors.VectorBucket.validateVectorBucketName('XX')).toThrow(
        /Bucket name must be at least 3/,
      );
    });

    it('should reject bucket names that are too long', () => {
      const longName = 'a'.repeat(64);
      expect(() => s3vectors.VectorBucket.validateVectorBucketName(longName)).toThrow(
        /no more than 63 characters/,
      );
    });

    it('should reject bucket names with illegal characters', () => {
      const invalidNames = [
        'My-Bucket',
        'bucket!123',
        'bucket.123',
        'bucket_123',
      ];

      invalidNames.forEach(name => {
        expect(() => s3vectors.VectorBucket.validateVectorBucketName(name)).toThrow(
          /must only contain lowercase characters, numbers, and hyphens/,
        );
      });
    });

    it('should reject bucket names that start with invalid characters', () => {
      expect(() => s3vectors.VectorBucket.validateVectorBucketName('-bucket')).toThrow(
        /must start with a lowercase letter or number/,
      );
    });

    it('should reject bucket names that end with invalid characters', () => {
      expect(() => s3vectors.VectorBucket.validateVectorBucketName('bucket-')).toThrow(
        /must end with a lowercase letter or number/,
      );
    });

    it('should include the invalid bucket name in the error message', () => {
      expect(() => s3vectors.VectorBucket.validateVectorBucketName('Invalid-Bucket!')).toThrow(
        /Invalid-Bucket!/,
      );
    });

    it('should handle empty bucket names', () => {
      expect(() => s3vectors.VectorBucket.validateVectorBucketName('')).toThrow(
        /Bucket name must be at least 3/,
      );
    });
  });

  describe('isVectorBucket', () => {
    test('returns true for a concrete instance', () => {
      const vectorBucket = new s3vectors.VectorBucket(stack, 'B');
      expect(s3vectors.VectorBucket.isVectorBucket(vectorBucket)).toBe(true);
    });

    test('returns false for a random object', () => {
      expect(s3vectors.VectorBucket.isVectorBucket({})).toBe(false);
      expect(s3vectors.VectorBucket.isVectorBucket(null)).toBe(false);
      expect(s3vectors.VectorBucket.isVectorBucket('string')).toBe(false);
    });
  });

  describe('tagging', () => {
    test('implements ITaggableV2', () => {
      const vectorBucket = new s3vectors.VectorBucket(stack, 'TaggedBucket', {
        vectorBucketName: 'tagged-bucket',
      });
      expect(core.TagManager.of(vectorBucket)).toBeDefined();
    });

    test('tags are applied to the vector bucket', () => {
      const vectorBucket = new s3vectors.VectorBucket(stack, 'TaggedBucket', {
        vectorBucketName: 'tagged-bucket',
      });

      core.Tags.of(vectorBucket).add('Environment', 'Production');
      core.Tags.of(vectorBucket).add('Team', 'DataEng');

      Template.fromStack(stack).hasResourceProperties(VECTOR_BUCKET_CFN_RESOURCE, {
        Tags: Match.arrayWith([
          Match.objectLike({ Key: 'Environment', Value: 'Production' }),
          Match.objectLike({ Key: 'Team', Value: 'DataEng' }),
        ]),
      });
    });
  });
});
