import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
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

  describe('Encryption', () => {
    test('creates an Index with S3 managed encryption', () => {
      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryption: s3vectors.IndexEncryption.S3_MANAGED,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        EncryptionConfiguration: {
          SseType: 'AES256',
        },
      });
    });

    test('creates an Index with KMS encryption and auto-generated key', () => {
      // WHEN
      const index = new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryption: s3vectors.IndexEncryption.KMS,
      });

      // THEN
      Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        EncryptionConfiguration: {
          SseType: 'aws:kms',
          KmsKeyArn: stack.resolve(index.encryptionKey!.keyArn),
        },
      });
    });

    test('creates an Index with KMS encryption and provided key', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryption: s3vectors.IndexEncryption.KMS,
        encryptionKey: key,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        EncryptionConfiguration: {
          SseType: 'aws:kms',
          KmsKeyArn: {
            'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
          },
        },
      });
    });

    test('creates an Index with KMS encryption when only key is provided', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryptionKey: key,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::Index', {
        EncryptionConfiguration: {
          SseType: 'aws:kms',
          KmsKeyArn: {
            'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
          },
        },
      });
    });

    test('creates an Index without encryption configuration by default', () => {
      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
      });

      // THEN - no EncryptionConfiguration property
      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::S3Vectors::Index');
      const indexResource = Object.values(resources)[0];
      expect(indexResource.Properties.EncryptionConfiguration).toBeUndefined();
    });

    test('throws error when S3 managed encryption is used with encryption key', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // WHEN/THEN
      expect(() => {
        new s3vectors.Index(stack, 'MyIndex', {
          vectorBucket,
          dimension: 1536,
          encryption: s3vectors.IndexEncryption.S3_MANAGED,
          encryptionKey: key,
        });
      }).toThrow(/Expected encryption = IndexEncryption.KMS with user provided encryption key/);
    });

    test('exposes encryptionKey property when KMS encryption is used', () => {
      // WHEN
      const index = new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryption: s3vectors.IndexEncryption.KMS,
      });

      // THEN
      expect(index.encryptionKey).toBeDefined();
    });

    test('encryptionKey is undefined when no encryption is specified', () => {
      // WHEN
      const index = new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
      });

      // THEN
      expect(index.encryptionKey).toBeUndefined();
    });

    test('adds KMS key policy with proper conditions for S3 Vectors service principal', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryption: s3vectors.IndexEncryption.KMS,
        encryptionKey: key,
      });

      // THEN - verify key policy has proper conditions per AWS documentation
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            {
              // Default key policy statement
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']],
                },
              },
              Resource: '*',
            },
            {
              // S3 Vectors indexing service access with conditions
              Sid: 'AllowS3VectorsIndexingAccess',
              Action: 'kms:Decrypt',
              Effect: 'Allow',
              Principal: {
                Service: 'indexing.s3vectors.amazonaws.com',
              },
              Resource: '*',
              Condition: {
                ArnLike: {
                  'aws:SourceArn': {
                    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3vectors:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':bucket/*']],
                  },
                },
                StringEquals: {
                  'aws:SourceAccount': { Ref: 'AWS::AccountId' },
                },
                'ForAnyValue:StringEquals': {
                  'kms:EncryptionContextKeys': ['aws:s3vectors:arn', 'aws:s3vectors:resource-id'],
                },
              },
            },
          ],
        },
      });
    });

    test('auto-generated KMS key includes proper S3 Vectors service principal policy', () => {
      // WHEN
      new s3vectors.Index(stack, 'MyIndex', {
        vectorBucket,
        dimension: 1536,
        encryption: s3vectors.IndexEncryption.KMS,
      });

      // THEN - verify auto-generated key has S3 Vectors service principal with conditions
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            {
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']],
                },
              },
              Resource: '*',
            },
            {
              Sid: 'AllowS3VectorsIndexingAccess',
              Action: 'kms:Decrypt',
              Effect: 'Allow',
              Principal: {
                Service: 'indexing.s3vectors.amazonaws.com',
              },
              Resource: '*',
              Condition: {
                ArnLike: {
                  'aws:SourceArn': {
                    'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3vectors:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':bucket/*']],
                  },
                },
                StringEquals: {
                  'aws:SourceAccount': { Ref: 'AWS::AccountId' },
                },
                'ForAnyValue:StringEquals': {
                  'kms:EncryptionContextKeys': ['aws:s3vectors:arn', 'aws:s3vectors:resource-id'],
                },
              },
            },
          ],
        },
      });
    });
  });
});
