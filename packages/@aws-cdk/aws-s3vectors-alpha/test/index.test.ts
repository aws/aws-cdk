import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';

describe('Index', () => {
  let stack: Stack;
  let vectorBucket: s3vectors.VectorBucket;

  beforeEach(() => {
    stack = new Stack();
    vectorBucket = new s3vectors.VectorBucket(stack, 'MyVectorBucket');
  });

  describe('Basic functionality', () => {
    test('creates an Index with required properties', () => {
      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
      });

      // THEN
      Template.fromStack(stack).resourceCountIs('AWS::S3Vectors::Index', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        Dimension: 1536,
        DistanceMetric: 'cosine',
        DataType: 'float32',
      });
    });

    test('creates an Index with Euclidean distance metric', () => {
      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 768,
        distanceMetric: s3vectors.DistanceMetric.EUCLIDEAN,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        Dimension: 768,
        DistanceMetric: 'euclidean',
      });
    });

    test('creates an Index with non-filterable metadata keys', () => {
      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1024,
        nonFilterableMetadataKeys: ['original-text', 'source-url'],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        MetadataConfiguration: {
          NonFilterableMetadataKeys: ['original-text', 'source-url'],
        },
      });
    });

    test('can import from ARN', () => {
      // WHEN
      const imported = s3vectors.Index.fromIndexArn(
        stack,
        'ImportedIndex',
        'arn:aws:s3vectors:us-east-1:123456789012:bucket/my-bucket/index/my-index',
      );

      // THEN
      expect(imported.indexArn).toBe('arn:aws:s3vectors:us-east-1:123456789012:bucket/my-bucket/index/my-index');
      expect(imported.indexName).toBe('my-index');
    });
  });

  describe('Validation', () => {
    test('validates dimension range', () => {
      // THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 0,
        });
      }).toThrow(/Dimension must be between 1 and 4096/);

      expect(() => {
        new s3vectors.Index(stack, 'MyIndex2', {
          vectorBucket,
          dimension: 5000,
        });
      }).toThrow(/Dimension must be between 1 and 4096/);
    });

    test('accepts minimum dimension value', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1,
        });
      }).not.toThrow();
    });

    test('accepts maximum dimension value', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 4096,
        });
      }).not.toThrow();
    });

    test('rejects negative dimension', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: -1,
        });
      }).toThrow(/Dimension must be between 1 and 4096/);
    });

    test('validates non-filterable metadata keys count', () => {
      // THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1536,
          nonFilterableMetadataKeys: Array.from({ length: 11 }, (_, i) => `key${i}`),
        });
      }).toThrow(/Maximum 10 non-filterable metadata keys/);
    });

    test('allows exactly 10 non-filterable metadata keys', () => {
      // WHEN/THEN - exactly 10 keys should be valid
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1536,
          nonFilterableMetadataKeys: Array.from({ length: 10 }, (_, i) => `key${i}`),
        });
      }).not.toThrow();
    });

    test('validates non-filterable metadata key length', () => {
      // WHEN/THEN - empty key
      expect(() => {
        new s3vectors.Index(stack, 'Index1', {
          vectorBucket,
          dimension: 1536,
          nonFilterableMetadataKeys: [''],
        });
      }).toThrow(/must be between 1 and 63 characters/);

      // WHEN/THEN - key too long (64 characters)
      expect(() => {
        new s3vectors.Index(stack, 'Index2', {
          vectorBucket,
          dimension: 1536,
          nonFilterableMetadataKeys: ['a'.repeat(64)],
        });
      }).toThrow(/must be between 1 and 63 characters/);

      // WHEN/THEN - valid key (63 characters)
      expect(() => {
        new s3vectors.Index(stack, 'Index3', {
          vectorBucket,
          dimension: 1536,
          nonFilterableMetadataKeys: ['a'.repeat(63)],
        });
      }).not.toThrow();
    });

    test('validates index name with dots and hyphens', () => {
      // WHEN/THEN - valid names with dots and hyphens
      expect(() => {
        new s3vectors.Index(stack, 'Index1', {
          vectorBucket,
          dimension: 1536,
          indexName: 'my-index.v1',
        });
      }).not.toThrow();

      expect(() => {
        new s3vectors.Index(stack, 'Index2', {
          vectorBucket,
          dimension: 1536,
          indexName: 'my.index-v2',
        });
      }).not.toThrow();
    });

    test('rejects index name starting with dot', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1536,
          indexName: '.invalid',
        });
      }).toThrow(/must start with a lowercase letter or number/);
    });

    test('rejects index name ending with hyphen', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1536,
          indexName: 'invalid-',
        });
      }).toThrow(/must end with a lowercase letter or number/);
    });

    test('handles token values in index name validation', () => {
      // GIVEN
      const tokenName = new cdk.CfnParameter(stack, 'IndexNameParameter', {
        type: 'String',
      }).valueAsString;

      // WHEN/THEN - should not throw
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1536,
          indexName: tokenName,
        });
      }).not.toThrow();
    });
  });
});
