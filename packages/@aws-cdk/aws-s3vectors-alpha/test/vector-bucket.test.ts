import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Stack } from 'aws-cdk-lib/core';
import * as s3vectors from '../lib';

describe('VectorBucket', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  describe('Basic functionality', () => {
    test('creates a VectorBucket with default properties', () => {
      // WHEN
      new s3vectors.VectorBucket(stack, 'MyVectorBucket');

      // THEN
      Template.fromStack(stack).resourceCountIs('AWS::S3Vectors::VectorBucket', 1);
    });

    test('creates a VectorBucket with specified name', () => {
      // WHEN
      new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
        vectorBucketName: 'test-bucket',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucket', {
        VectorBucketName: 'test-bucket',
      });
    });

    test('can import from ARN', () => {
      // WHEN
      const imported = s3vectors.VectorBucket.fromVectorBucketArn(
        stack,
        'ImportedBucket',
        'arn:aws:s3vectors:us-east-1:123456789012:bucket/my-bucket',
      );

      // THEN
      expect(imported.vectorBucketArn).toBe('arn:aws:s3vectors:us-east-1:123456789012:bucket/my-bucket');
      expect(imported.vectorBucketName).toBe('my-bucket');
    });

    test('can import from name', () => {
      // WHEN
      const imported = s3vectors.VectorBucket.fromVectorBucketName(
        stack,
        'ImportedBucket',
        'my-bucket',
      );

      // THEN
      expect(imported.vectorBucketName).toBe('my-bucket');
    });
  });

  describe('Validation', () => {
    test('validates bucket name', () => {
      // THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: 'Invalid-Name!',
        });
      }).toThrow(/must only contain lowercase/);
    });

    test('validates bucket name length', () => {
      // THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: 'ab',
        });
      }).toThrow(/at least 3 and no more than 63 characters/);
    });

    test('rejects bucket name with uppercase letters', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: 'MyBucket',
        });
      }).toThrow(/must only contain lowercase/);
    });

    test('accepts bucket name with numbers', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: 'my-bucket-123',
        });
      }).not.toThrow();
    });

    test('accepts minimum length bucket name', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: 'abc',
        });
      }).not.toThrow();
    });

    test('accepts maximum length bucket name', () => {
      // WHEN/THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: 'a'.repeat(63),
        });
      }).not.toThrow();
    });

    test('handles token values in bucket name validation', () => {
      // GIVEN
      const tokenName = new cdk.CfnParameter(stack, 'BucketNameParameter', {
        type: 'String',
      }).valueAsString;

      // WHEN/THEN - should not throw
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          vectorBucketName: tokenName,
        });
      }).not.toThrow();
    });
  });

  describe('Encryption', () => {
    test('creates a VectorBucket with S3 managed encryption', () => {
      // WHEN
      new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
        encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucket', {
        EncryptionConfiguration: {
          SseType: 'AES256',
        },
      });
    });

    test('creates with KMS encryption and provided key', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // WHEN
      const bucket = new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: key,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucket', {
        EncryptionConfiguration: {
          SseType: 'aws:kms',
          KmsKeyArn: {
            'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
          },
        },
      });
      expect(bucket.encryptionKey).toBe(key);
    });

    test('creates with KMS encryption and auto-generated key', () => {
      // WHEN
      const bucket = new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
        encryption: s3vectors.VectorBucketEncryption.KMS,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucket', {
        EncryptionConfiguration: {
          SseType: 'aws:kms',
          KmsKeyArn: {
            'Fn::GetAtt': ['MyVectorBucketKey7ACA85A8', 'Arn'],
          },
        },
      });
      expect(bucket.encryptionKey).toBeDefined();
      Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
    });

    test('throws error when S3_MANAGED encryption with provided key', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // THEN
      expect(() => {
        new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
          encryption: s3vectors.VectorBucketEncryption.S3_MANAGED,
          encryptionKey: key,
        });
      }).toThrow(/Expected encryption = VectorBucketEncryption.KMS/);
    });

    test('uses KMS when only key is provided without encryption type', () => {
      // GIVEN
      const key = new kms.Key(stack, 'MyKey');

      // WHEN
      const bucket = new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
        encryptionKey: key,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3Vectors::VectorBucket', {
        EncryptionConfiguration: {
          SseType: 'aws:kms',
          KmsKeyArn: {
            'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
          },
        },
      });
      expect(bucket.encryptionKey).toBe(key);
    });

    test('creates without encryption configuration when neither encryption nor key specified', () => {
      // WHEN
      const bucket = new s3vectors.VectorBucket(stack, 'MyVectorBucket');

      // THEN
      const template = Template.fromStack(stack);
      const resources = template.findResources('AWS::S3Vectors::VectorBucket');
      const bucketResource = Object.values(resources)[0];
      expect(bucketResource?.Properties?.EncryptionConfiguration).toBeUndefined();
      expect(bucket.encryptionKey).toBeUndefined();
    });

    test('auto-generated KMS key has key rotation enabled', () => {
      // WHEN
      new s3vectors.VectorBucket(stack, 'MyVectorBucket', {
        encryption: s3vectors.VectorBucketEncryption.KMS,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        EnableKeyRotation: true,
      });
    });
  });

  describe('Permissions', () => {
    let permStack: Stack;
    let bucket: s3vectors.VectorBucket;
    let role: iam.Role;

    beforeEach(() => {
      permStack = new Stack();
      bucket = new s3vectors.VectorBucket(permStack, 'MyVectorBucket', {
        vectorBucketName: 'test-bucket',
      });
      role = new iam.Role(permStack, 'TestRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
    });

    test('grantRead adds correct IAM permissions with proper resource separation', () => {
      // WHEN
      bucket.grantRead(role, '*');

      // THEN - VectorBucket actions on bucket ARN, Index actions on index ARN
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3vectors:ListIndexes',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
              },
            },
            {
              Action: [
                's3vectors:GetIndex',
                's3vectors:GetVectors',
                's3vectors:ListVectors',
                's3vectors:QueryVectors',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
                    },
                    '/index/*',
                  ],
                ],
              },
            },
          ],
        },
      });
    });

    test('grantWrite adds correct IAM permissions with proper resource separation', () => {
      // WHEN
      bucket.grantWrite(role, '*');

      // THEN - Only Index actions (no VectorBucket write actions exist)
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3vectors:CreateIndex',
                's3vectors:DeleteIndex',
                's3vectors:PutVectors',
                's3vectors:DeleteVectors',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
                    },
                    '/index/*',
                  ],
                ],
              },
            },
          ],
        },
      });
    });

    test('grantReadWrite adds correct IAM permissions with proper resource separation', () => {
      // WHEN
      bucket.grantReadWrite(role, '*');

      // THEN - VectorBucket actions on bucket ARN, Index actions on index ARN
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3vectors:ListIndexes',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
              },
            },
            {
              Action: [
                's3vectors:GetIndex',
                's3vectors:GetVectors',
                's3vectors:ListVectors',
                's3vectors:QueryVectors',
                's3vectors:CreateIndex',
                's3vectors:DeleteIndex',
                's3vectors:PutVectors',
                's3vectors:DeleteVectors',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
                    },
                    '/index/*',
                  ],
                ],
              },
            },
          ],
        },
      });
    });

    test('grantRead with indexId scopes permissions correctly', () => {
      // WHEN
      bucket.grantRead(role, 'my-index');

      // THEN
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3vectors:ListIndexes',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
              },
            },
            {
              Action: [
                's3vectors:GetIndex',
                's3vectors:GetVectors',
                's3vectors:ListVectors',
                's3vectors:QueryVectors',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': ['MyVectorBucket4697D5BD', 'VectorBucketArn'],
                    },
                    '/index/my-index',
                  ],
                ],
              },
            },
          ],
        },
      });
    });

    test('grant methods add KMS permissions when encrypted', () => {
      // GIVEN
      const key = new kms.Key(permStack, 'MyKey');
      const encryptedBucket = new s3vectors.VectorBucket(permStack, 'EncryptedBucket', {
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: key,
      });

      // WHEN
      encryptedBucket.grantRead(role, '*');

      // THEN
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3vectors:ListIndexes',
              Effect: 'Allow',
            },
            {
              Action: [
                's3vectors:GetIndex',
                's3vectors:GetVectors',
                's3vectors:ListVectors',
                's3vectors:QueryVectors',
              ],
              Effect: 'Allow',
            },
            {
              Action: 'kms:Decrypt',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
              },
            },
          ],
        },
      });
    });

    test('grantWrite adds KMS GenerateDataKey permission when encrypted', () => {
      // GIVEN
      const key = new kms.Key(permStack, 'MyKey');
      const encryptedBucket = new s3vectors.VectorBucket(permStack, 'EncryptedBucket', {
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: key,
      });

      // WHEN
      encryptedBucket.grantWrite(role, '*');

      // THEN
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3vectors:CreateIndex',
                's3vectors:DeleteIndex',
                's3vectors:PutVectors',
                's3vectors:DeleteVectors',
              ],
              Effect: 'Allow',
            },
            {
              Action: [
                'kms:Decrypt',
                'kms:GenerateDataKey*',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
              },
            },
          ],
        },
      });
    });

    test('grantReadWrite adds comprehensive KMS permissions when encrypted', () => {
      // GIVEN
      const key = new kms.Key(permStack, 'MyKey');
      const encryptedBucket = new s3vectors.VectorBucket(permStack, 'EncryptedBucket', {
        encryption: s3vectors.VectorBucketEncryption.KMS,
        encryptionKey: key,
      });

      // WHEN
      encryptedBucket.grantReadWrite(role, '*');

      // THEN
      Template.fromStack(permStack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 's3vectors:ListIndexes',
              Effect: 'Allow',
            },
            {
              Action: [
                's3vectors:GetIndex',
                's3vectors:GetVectors',
                's3vectors:ListVectors',
                's3vectors:QueryVectors',
                's3vectors:CreateIndex',
                's3vectors:DeleteIndex',
                's3vectors:PutVectors',
                's3vectors:DeleteVectors',
              ],
              Effect: 'Allow',
            },
            {
              Action: [
                'kms:Decrypt',
                'kms:GenerateDataKey*',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
              },
            },
          ],
        },
      });
    });
  });
});
