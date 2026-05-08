import { Match, Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as core from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';

/* eslint-disable @stylistic/quote-props */

const VECTOR_INDEX_CFN_RESOURCE = 'AWS::S3Vectors::Index';
const VECTOR_BUCKET_NAME = 'example-vector-bucket';
const INDEX_NAME = 'example-index';

describe('VectorIndex', () => {
  let stack: core.Stack;
  let vectorBucket: s3vectors.VectorBucket;

  beforeEach(() => {
    stack = new core.Stack();
    vectorBucket = new s3vectors.VectorBucket(stack, 'ExampleVectorBucket', {
      vectorBucketName: VECTOR_BUCKET_NAME,
    });
  });

  describe('created with required properties', () => {
    beforeEach(() => {
      new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        indexName: INDEX_NAME,
        dimension: 1024,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
      });
    });

    test(`creates an ${VECTOR_INDEX_CFN_RESOURCE} resource`, () => {
      Template.fromStack(stack).resourceCountIs(VECTOR_INDEX_CFN_RESOURCE, 1);
    });

    test('has all required properties', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'IndexName': INDEX_NAME,
        'Dimension': 1024,
        'DataType': 'float32',
        'DistanceMetric': 'cosine',
        'VectorBucketArn': { 'Fn::GetAtt': ['ExampleVectorBucketC67D306D', 'VectorBucketArn'] },
      });
    });

    test('has removalPolicy set to "Retain" by default', () => {
      Template.fromStack(stack).hasResource(VECTOR_INDEX_CFN_RESOURCE, {
        'DeletionPolicy': 'Retain',
      });
    });

    test('has no encryption configuration by default', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'EncryptionConfiguration': Match.absent(),
      });
    });

    test('has no metadata configuration by default', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'MetadataConfiguration': Match.absent(),
      });
    });
  });

  describe('created with nonFilterableMetadataKeys', () => {
    beforeEach(() => {
      new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        dimension: 768,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
        nonFilterableMetadataKeys: ['source', 'author'],
      });
    });

    test('renders the metadata configuration', () => {
      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'MetadataConfiguration': {
          'NonFilterableMetadataKeys': ['source', 'author'],
        },
      });
    });
  });

  describe('enum values', () => {
    test.each([
      s3vectors.DistanceMetric.COSINE,
      s3vectors.DistanceMetric.EUCLIDEAN,
    ])('accepts distance metric %s', (metric) => {
      new s3vectors.VectorIndex(stack, `Index-${metric}`, {
        vectorBucket,
        dimension: 256,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: metric,
      });

      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'DistanceMetric': metric,
      });
    });

    test('accepts float32 data type', () => {
      new s3vectors.VectorIndex(stack, 'FloatIndex', {
        vectorBucket,
        dimension: 256,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
      });

      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'DataType': 'float32',
      });
    });
  });

  describe('with KMS encryption', () => {
    const keyName = 'ExampleKey469AF2A8';

    test('KMS + user key renders encryption configuration', () => {
      const key = new kms.Key(stack, 'ExampleKey', {});
      new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        dimension: 1024,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: key,
      });

      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'EncryptionConfiguration': {
          'KmsKeyArn': { 'Fn::GetAtt': [keyName, 'Arn'] },
          'SseType': 'aws:kms',
        },
      });
    });

    test('S3_MANAGED sets sseType AES256', () => {
      new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        dimension: 1024,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
        encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
      });

      Template.fromStack(stack).hasResourceProperties(VECTOR_INDEX_CFN_RESOURCE, {
        'EncryptionConfiguration': {
          'SseType': 'AES256',
        },
      });
    });

    test('S3_MANAGED + user key throws', () => {
      const key = new kms.Key(stack, 'ExampleKey', {});
      expect(() => new s3vectors.VectorIndex(stack, 'ExampleVectorIndex', {
        vectorBucket,
        dimension: 1024,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
        encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
        encryptionKey: key,
      })).toThrow(/Expected encryption = `KMS`/);
    });
  });

  describe('validateIndexName', () => {
    it('accepts valid names', () => {
      ['abc', 'my.index', 'a-b-c', 'a'.repeat(63)].forEach(name => {
        expect(() => s3vectors.VectorIndex.validateIndexName(name)).not.toThrow();
      });
    });

    it.each([
      'ab',
      'a'.repeat(64),
      '-abc',
      'abc-',
      '.abc',
      'abc.',
      'Abc',
      'ab c',
      'abc_def',
    ])('rejects invalid name %s', (name) => {
      expect(() => s3vectors.VectorIndex.validateIndexName(name)).toThrow();
    });

    it('skips validation for unresolved tokens', () => {
      const orig = core.Token.isUnresolved;
      core.Token.isUnresolved = jest.fn().mockReturnValue(true);
      expect(() => s3vectors.VectorIndex.validateIndexName('unresolved')).not.toThrow();
      core.Token.isUnresolved = orig;
    });

    it('skips validation for undefined', () => {
      expect(() => s3vectors.VectorIndex.validateIndexName(undefined)).not.toThrow();
    });
  });

  describe('validateDimension', () => {
    it.each([1, 512, 4096])('accepts valid dimension %d', (dim) => {
      expect(() => s3vectors.VectorIndex.validateDimension(dim)).not.toThrow();
    });

    it.each([0, -1, 4097, 1.5])('rejects invalid dimension %d', (dim) => {
      expect(() => s3vectors.VectorIndex.validateDimension(dim)).toThrow(/Dimension must be an integer/);
    });

    it('skips validation for token', () => {
      const orig = core.Token.isUnresolved;
      core.Token.isUnresolved = jest.fn().mockReturnValue(true);
      expect(() => s3vectors.VectorIndex.validateDimension(999999)).not.toThrow();
      core.Token.isUnresolved = orig;
    });
  });

  describe('validateNonFilterableMetadataKeys', () => {
    it('accepts 1-10 valid keys', () => {
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys(['a'])).not.toThrow();
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys(Array.from({ length: 10 }, (_, i) => `k${i}`))).not.toThrow();
    });

    it('rejects empty array', () => {
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys([])).toThrow(/between 1 and 10 entries/);
    });

    it('rejects more than 10 keys', () => {
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys(Array.from({ length: 11 }, (_, i) => `k${i}`))).toThrow(/between 1 and 10 entries/);
    });

    it('rejects oversize key', () => {
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys(['a'.repeat(64)])).toThrow(/between 1 and 63 characters/);
    });

    it('rejects empty key', () => {
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys([''])).toThrow(/between 1 and 63 characters/);
    });

    it('skips validation for token array', () => {
      const orig = core.Token.isUnresolved;
      core.Token.isUnresolved = jest.fn((val) => Array.isArray(val));
      expect(() => s3vectors.VectorIndex.validateNonFilterableMetadataKeys(['unresolved'])).not.toThrow();
      core.Token.isUnresolved = orig;
    });
  });

  describe('isVectorIndex', () => {
    test('returns true for a concrete instance', () => {
      const idx = new s3vectors.VectorIndex(stack, 'Idx', {
        vectorBucket,
        dimension: 128,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
      });
      expect(s3vectors.VectorIndex.isVectorIndex(idx)).toBe(true);
    });

    test('returns false for a random object', () => {
      expect(s3vectors.VectorIndex.isVectorIndex({})).toBe(false);
      expect(s3vectors.VectorIndex.isVectorIndex(null)).toBe(false);
    });
  });

  describe('fromVectorIndexAttributes', () => {
    test('derives indexArn from the bucket ARN and index name', () => {
      const imported = s3vectors.VectorIndex.fromVectorIndexAttributes(stack, 'ImportedIndex', {
        vectorBucket,
        indexName: INDEX_NAME,
      });

      expect(imported.indexName).toEqual(INDEX_NAME);
      expect(stack.resolve(imported.indexArn)).toEqual({
        'Fn::Join': ['', [
          { 'Fn::GetAtt': ['ExampleVectorBucketC67D306D', 'VectorBucketArn'] },
          `/index/${INDEX_NAME}`,
        ]],
      });
    });

    test('derives index name from an explicit ARN', () => {
      const importedBucket = s3vectors.VectorBucket.fromVectorBucketArn(
        stack, 'ImportedBucket',
        'arn:aws:s3vectors:us-east-1:123456789012:bucket/demo-bucket',
      );

      const imported = s3vectors.VectorIndex.fromVectorIndexAttributes(stack, 'ImportedIndex', {
        vectorBucket: importedBucket,
        indexArn: 'arn:aws:s3vectors:us-east-1:123456789012:bucket/demo-bucket/index/demo-index',
      });

      expect(imported.indexName).toEqual('demo-index');
    });

    test('throws when neither indexArn nor indexName are provided', () => {
      expect(() => s3vectors.VectorIndex.fromVectorIndexAttributes(stack, 'ImportedIndex', {
        vectorBucket,
      })).toThrow(/`indexArn` or `indexName` must be provided/);
    });
  });

  describe('tagging', () => {
    test('implements ITaggableV2', () => {
      const idx = new s3vectors.VectorIndex(stack, 'Tagged', {
        vectorBucket,
        dimension: 128,
        dataType: s3vectors.VectorDataType.FLOAT32,
        distanceMetric: s3vectors.DistanceMetric.COSINE,
      });
      expect(core.TagManager.of(idx)).toBeDefined();
    });
  });
});
