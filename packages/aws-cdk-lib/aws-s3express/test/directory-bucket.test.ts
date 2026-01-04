import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { Stack } from '../../core';
import * as s3express from '../lib';

describe('DirectoryBucket', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('default bucket with Availability Zone', () => {
    // WHEN
    new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::DirectoryBucket', {
      DataRedundancy: 'SingleAvailabilityZone',
      LocationName: 'us-east-1a',
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'AES256',
          },
        }],
      },
    });
  });

  test('bucket with Local Zone', () => {
    // WHEN
    new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        localZone: 'us-west-2-lax-1a',
      },
      dataRedundancy: s3express.DataRedundancy.SINGLE_LOCAL_ZONE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::DirectoryBucket', {
      DataRedundancy: 'SingleLocalZone',
      LocationName: 'us-west-2-lax-1a',
    });
  });

  test('bucket with custom name', () => {
    // WHEN
    new s3express.DirectoryBucket(stack, 'MyBucket', {
      directoryBucketName: 'my-custom-bucket--useast1az1--x-s3',
      location: {
        availabilityZone: 'us-east-1a',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::DirectoryBucket', {
      BucketName: 'my-custom-bucket--useast1az1--x-s3',
    });
  });

  test('bucket with KMS encryption', () => {
    // GIVEN
    const key = new kms.Key(stack, 'MyKey');

    // WHEN
    new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
      encryption: s3express.DirectoryBucketEncryption.KMS,
      encryptionKey: key,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::DirectoryBucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'aws:kms',
            KMSMasterKeyID: {
              'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
            },
          },
        }],
      },
    });
  });

  test('bucket with S3-managed encryption', () => {
    // WHEN
    new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
      encryption: s3express.DirectoryBucketEncryption.S3_MANAGED,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3Express::DirectoryBucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [{
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: 'AES256',
          },
        }],
      },
    });
  });

  test('grantRead grants correct permissions', () => {
    // GIVEN
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    bucket.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3express:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':bucket/',
                    { Ref: 'MyBucketF68F3FF0' },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3express:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':bucket/',
                    { Ref: 'MyBucketF68F3FF0' },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
      },
    });
  });

  test('grantWrite grants correct permissions', () => {
    // GIVEN
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    bucket.grantWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3express:CreateSession',
              's3:PutObject',
              's3:DeleteObject',
              's3:AbortMultipartUpload',
            ],
            Effect: 'Allow',
          },
        ],
      },
    });
  });

  test('grantReadWrite grants correct permissions', () => {
    // GIVEN
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    bucket.grantReadWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
              's3:PutObject',
              's3:DeleteObject',
              's3:AbortMultipartUpload',
            ],
            Effect: 'Allow',
          },
        ],
      },
    });
  });

  test('grantRead with object key pattern', () => {
    // GIVEN
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    bucket.grantRead(user, 'prefix/*');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3express:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':bucket/',
                    { Ref: 'MyBucketF68F3FF0' },
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3express:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':bucket/',
                    { Ref: 'MyBucketF68F3FF0' },
                    '/prefix/*',
                  ],
                ],
              },
            ],
          },
        ],
      },
    });
  });

  test('grantRead with KMS encryption grants key permissions', () => {
    // GIVEN
    const key = new kms.Key(stack, 'MyKey');
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
      encryption: s3express.DirectoryBucketEncryption.KMS,
      encryptionKey: key,
    });
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    bucket.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
            ],
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:DescribeKey',
            ],
            Resource: {
              'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
            },
          },
        ],
      },
    });
  });

  test('fromBucketArn imports bucket correctly', () => {
    // WHEN
    const bucket = s3express.DirectoryBucket.fromBucketArn(
      stack,
      'ImportedBucket',
      'arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1az1--x-s3',
    );

    // THEN
    expect(bucket.bucketArn).toBe('arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1az1--x-s3');
    expect(bucket.bucketName).toBe('my-bucket--useast1az1--x-s3');
  });

  test('fromBucketName imports bucket correctly', () => {
    // WHEN
    const bucket = s3express.DirectoryBucket.fromBucketName(
      stack,
      'ImportedBucket',
      'my-bucket--useast1az1--x-s3',
    );

    // THEN
    expect(bucket.bucketName).toBe('my-bucket--useast1az1--x-s3');
    expect(bucket.bucketArn).toContain('arn:');
    expect(bucket.bucketArn).toContain(':s3express:');
    expect(bucket.bucketArn).toContain(':bucket/my-bucket--useast1az1--x-s3');
  });

  test('imported bucket can grant permissions', () => {
    // GIVEN
    const bucket = s3express.DirectoryBucket.fromBucketArn(
      stack,
      'ImportedBucket',
      'arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1az1--x-s3',
    );
    const user = new iam.User(stack, 'MyUser');

    // WHEN
    bucket.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              's3express:CreateSession',
              's3:GetObject',
              's3:ListBucket',
            ],
            Resource: [
              'arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1az1--x-s3',
              'arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1az1--x-s3/*',
            ],
          },
        ],
      },
    });
  });

  test('throws error when neither availabilityZone nor localZone is specified', () => {
    // THEN
    expect(() => {
      new s3express.DirectoryBucket(stack, 'MyBucket', {
        location: {},
      });
    }).toThrow(/Either availabilityZone or localZone must be specified/);
  });

  test('throws error when both availabilityZone and localZone are specified', () => {
    // THEN
    expect(() => {
      new s3express.DirectoryBucket(stack, 'MyBucket', {
        location: {
          availabilityZone: 'us-east-1a',
          localZone: 'us-west-2-lax-1a',
        },
      });
    }).toThrow(/Cannot specify both availabilityZone and localZone/);
  });

  test('throws error when encryptionKey is specified without KMS encryption', () => {
    // GIVEN
    const key = new kms.Key(stack, 'MyKey');

    // THEN
    expect(() => {
      new s3express.DirectoryBucket(stack, 'MyBucket', {
        location: {
          availabilityZone: 'us-east-1a',
        },
        encryption: s3express.DirectoryBucketEncryption.S3_MANAGED,
        encryptionKey: key,
      });
    }).toThrow(/encryptionKey can only be specified when encryption is set to KMS/);
  });

  test('throws error with invalid bucket name format', () => {
    // THEN
    expect(() => {
      new s3express.DirectoryBucket(stack, 'MyBucket', {
        directoryBucketName: 'invalid-bucket-name',
        location: {
          availabilityZone: 'us-east-1a',
        },
      });
    }).toThrow(/Invalid directory bucket name.*must follow the format: bucket-base-name--zone-id--x-s3/);
  });

  test('addToResourcePolicy adds statement to bucket policy', () => {
    // GIVEN
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      location: {
        availabilityZone: 'us-east-1a',
      },
    });

    // WHEN
    const result = bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3express:CreateSession'],
      resources: [bucket.bucketArn],
      principals: [new iam.AccountPrincipal('123456789012')],
    }));

    // THEN
    expect(result.statementAdded).toBe(true);
  });

  test('bucket attributes are correctly exposed', () => {
    // GIVEN
    const bucket = new s3express.DirectoryBucket(stack, 'MyBucket', {
      directoryBucketName: 'my-bucket--useast1az1--x-s3',
      location: {
        availabilityZone: 'us-east-1a',
      },
    });

    // THEN
    expect(bucket.bucketName).toBeDefined();
    expect(bucket.bucketArn).toBeDefined();
    expect(bucket.bucketArn).toContain(':s3express:');
  });
});
