import { EOL } from 'os';
import { Annotations, Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as s3 from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */

describe('bucket', () => {
  test('default bucket', () => {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket');

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('CFN properties are type-validated during resolution', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      bucketName: cdk.Token.asString(5), // Oh no
    });

    expect(() => {
      Template.fromStack(stack).toJSON();
    }).toThrow(/bucketName: 5 should be a string/);
  });

  test('bucket without encryption', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.UNENCRYPTED,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with managed encryption', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'BucketEncryption': {
              'ServerSideEncryptionConfiguration': [
                {
                  'ServerSideEncryptionByDefault': {
                    'SSEAlgorithm': 'aws:kms',
                  },
                },
              ],
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('valid bucket names', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'abc.xyz-34ab',
    })).not.toThrow();

    expect(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: '124.pp--33',
    })).not.toThrow();
  });

  test('bucket validation skips tokenized values', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket', {
      bucketName: cdk.Lazy.string({ produce: () => '_BUCKET' }),
    })).not.toThrow();
  });

  test('fails with message on invalid bucket names', () => {
    const stack = new cdk.Stack();
    const bucket = `-buckEt.-${new Array(65).join('$')}`;
    const expectedErrors = [
      `Invalid S3 bucket name (value: ${bucket})`,
      'Bucket name must be at least 3 and no more than 63 characters',
      'Bucket name must only contain lowercase characters and the symbols, period (.) and dash (-) (offset: 5)',
      'Bucket name must start and end with a lowercase character or number (offset: 0)',
      `Bucket name must start and end with a lowercase character or number (offset: ${bucket.length - 1})`,
      'Bucket name must not have dash next to period, or period next to dash, or consecutive periods (offset: 7)',
    ].join(EOL);

    expect(() => new s3.Bucket(stack, 'MyBucket', {
      bucketName: bucket,
    })).toThrow(expectedErrors);
  });

  test('fails if bucket name has less than 3 or more than 63 characters', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'a',
    })).toThrow(/at least 3/);

    expect(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: new Array(65).join('x'),
    })).toThrow(/no more than 63/);
  });

  test('fails if bucket name has invalid characters', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'b@cket',
    })).toThrow(/offset: 1/);

    expect(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: 'bucKet',
    })).toThrow(/offset: 3/);

    expect(() => new s3.Bucket(stack, 'MyBucket3', {
      bucketName: 'bučket',
    })).toThrow(/offset: 2/);
  });

  test('fails if bucket name does not start or end with lowercase character or number', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: '-ucket',
    })).toThrow(/offset: 0/);

    expect(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: 'bucke.',
    })).toThrow(/offset: 5/);
  });

  test('fails only if bucket name has the consecutive symbols (..), (.-), (-.)', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'buc..ket',
    })).toThrow(/offset: 3/);

    expect(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: 'buck.-et',
    })).toThrow(/offset: 4/);

    expect(() => new s3.Bucket(stack, 'MyBucket3', {
      bucketName: 'b-.ucket',
    })).toThrow(/offset: 1/);

    expect(() => new s3.Bucket(stack, 'MyBucket4', {
      bucketName: 'bu--cket',
    })).not.toThrow();
  });

  test('fails only if bucket name resembles IP address', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: '1.2.3.4',
    })).toThrow(/must not resemble an IP address/);

    expect(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: '1.2.3',
    })).not.toThrow();

    expect(() => new s3.Bucket(stack, 'MyBucket3', {
      bucketName: '1.2.3.a',
    })).not.toThrow();

    expect(() => new s3.Bucket(stack, 'MyBucket4', {
      bucketName: '1000.2.3.4',
    })).not.toThrow();
  });

  test('fails if encryption key is used with managed encryption', () => {
    const stack = new cdk.Stack();
    const myKey = new kms.Key(stack, 'MyKey');

    expect(() => new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
      encryptionKey: myKey,
    })).toThrow(/encryptionKey is specified, so 'encryption' must be set to KMS/);
  });

  test('fails if encryption key is used with encryption set to unencrypted', () => {
    const stack = new cdk.Stack();
    const myKey = new kms.Key(stack, 'MyKey');

    expect(() => new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.UNENCRYPTED,
      encryptionKey: myKey,
    })).toThrow(/encryptionKey is specified, so 'encryption' must be set to KMS/);
  });

  test('encryptionKey can specify kms key', () => {
    const stack = new cdk.Stack();

    const encryptionKey = new kms.Key(stack, 'MyKey', { description: 'hello, world' });

    new s3.Bucket(stack, 'MyBucket', { encryptionKey, encryption: s3.BucketEncryption.KMS });

    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      'BucketEncryption': {
        'ServerSideEncryptionConfiguration': [
          {
            'ServerSideEncryptionByDefault': {
              'KMSMasterKeyID': {
                'Fn::GetAtt': [
                  'MyKey6AB29FA6',
                  'Arn',
                ],
              },
              'SSEAlgorithm': 'aws:kms',
            },
          },
        ],
      },
    });
  });

  test('enforceSsl can be enabled', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', { enforceSSL: true });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'UpdateReplacePolicy': 'Retain',
          'DeletionPolicy': 'Retain',
        },
        'MyBucketPolicyE7FBAC7B': {
          'Type': 'AWS::S3::BucketPolicy',
          'Properties': {
            'Bucket': {
              'Ref': 'MyBucketF68F3FF0',
            },
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': 's3:*',
                  'Condition': {
                    'Bool': {
                      'aws:SecureTransport': 'false',
                    },
                  },
                  'Effect': 'Deny',
                  'Principal': { AWS: '*' },
                  'Resource': [
                    {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'Arn',
                      ],
                    },
                    {
                      'Fn::Join': [
                        '',
                        [
                          {
                            'Fn::GetAtt': [
                              'MyBucketF68F3FF0',
                              'Arn',
                            ],
                          },
                          '/*',
                        ],
                      ],
                    },
                  ],
                },
              ],
              'Version': '2012-10-17',
            },
          },
        },
      },
    });
  });

  test.each([s3.BucketEncryption.KMS, s3.BucketEncryption.KMS_MANAGED])('bucketKeyEnabled can be enabled with %p encryption', (encryption) => {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', { bucketKeyEnabled: true, encryption });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      'BucketEncryption': {
        'ServerSideEncryptionConfiguration': [
          {
            'BucketKeyEnabled': true,
            'ServerSideEncryptionByDefault': Match.objectLike({
              'SSEAlgorithm': 'aws:kms',
            }),
          },
        ],
      },
    });
  });

  test('throws error if bucketKeyEnabled is set, but encryption is not KMS', () => {
    const stack = new cdk.Stack();

    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { bucketKeyEnabled: true, encryption: s3.BucketEncryption.S3_MANAGED });
    }).toThrow("bucketKeyEnabled is specified, so 'encryption' must be set to KMS (value: S3_MANAGED)");
    expect(() => {
      new s3.Bucket(stack, 'MyBucket3', { bucketKeyEnabled: true });
    }).toThrow("bucketKeyEnabled is specified, so 'encryption' must be set to KMS (value: UNENCRYPTED)");

  });

  test('logs to self, no encryption does not throw error', () => {
    const stack = new cdk.Stack();
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED, serverAccessLogsPrefix: 'test' });
    }).not.toThrowError();
  });

  test('logs to self, S3 encryption does not throw error', () => {
    const stack = new cdk.Stack();
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.S3_MANAGED, serverAccessLogsPrefix: 'test' });
    }).not.toThrowError();
  });

  test('logs to self, KMS_MANAGED encryption throws error', () => {
    const stack = new cdk.Stack();
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS_MANAGED, serverAccessLogsPrefix: 'test' });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to self, KMS encryption without key throws error', () => {
    const stack = new cdk.Stack();
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS, serverAccessLogsPrefix: 'test' });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to self, KMS encryption with key throws error', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'TestKey');
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { encryptionKey: key, encryption: s3.BucketEncryption.KMS, serverAccessLogsPrefix: 'test' });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to self, KMS key with no specific encryption specified throws error', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'TestKey');
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { encryptionKey: key, serverAccessLogsPrefix: 'test' });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to separate bucket, no encryption does not throw error', () => {
    const stack = new cdk.Stack();
    const logBucket = new s3.Bucket(stack, 'testLogBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { serverAccessLogsBucket: logBucket });
    }).not.toThrowError();
  });

  test('logs to separate bucket, S3 encryption does not throw error', () => {
    const stack = new cdk.Stack();
    const logBucket = new s3.Bucket(stack, 'testLogBucket', { encryption: s3.BucketEncryption.S3_MANAGED });
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { serverAccessLogsBucket: logBucket });
    }).not.toThrowError();
  });

  // When provided an external bucket (as an IBucket), we cannot detect KMS_MANAGED encryption. Since this
  // check is impossible, we skip thist test.
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('logs to separate bucket, KMS_MANAGED encryption throws error', () => {
    const stack = new cdk.Stack();
    const logBucket = new s3.Bucket(stack, 'testLogBucket', { encryption: s3.BucketEncryption.KMS_MANAGED });
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { serverAccessLogsBucket: logBucket });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to separate bucket, KMS encryption without key throws error', () => {
    const stack = new cdk.Stack();
    const logBucket = new s3.Bucket(stack, 'testLogBucket', { encryption: s3.BucketEncryption.KMS });
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { serverAccessLogsBucket: logBucket });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to separate bucket, KMS encryption with key throws error', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'TestKey');
    const logBucket = new s3.Bucket(stack, 'testLogBucket', { encryptionKey: key, encryption: s3.BucketEncryption.KMS });
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { serverAccessLogsBucket: logBucket });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('logs to separate bucket, KMS key with no specific encryption specified throws error', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'TestKey');
    const logBucket = new s3.Bucket(stack, 'testLogBucket', { encryptionKey: key });
    expect(() => {
      new s3.Bucket(stack, 'MyBucket', { serverAccessLogsBucket: logBucket });
    }).toThrow(/SSE-S3 is the only supported default bucket encryption for Server Access Logging target buckets/);
  });

  test('bucket with versioning turned on', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      versioned: true,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'VersioningConfiguration': {
              'Status': 'Enabled',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with object lock enabled but no retention', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'Bucket', {
      objectLockEnabled: true,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      ObjectLockEnabled: true,
      ObjectLockConfiguration: Match.absent(),
    });
  });

  test('object lock defaults to disabled', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'Bucket');
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      ObjectLockEnabled: Match.absent(),
    });
  });

  test('object lock defaults to enabled when default retention is specified', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'Bucket', {
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(7 * 365)),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      ObjectLockEnabled: true,
      ObjectLockConfiguration: {
        ObjectLockEnabled: 'Enabled',
        Rule: {
          DefaultRetention: {
            Mode: 'GOVERNANCE',
            Days: 7 * 365,
          },
        },
      },
    });
  });

  test('bucket with object lock enabled with governance retention', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'Bucket', {
      objectLockEnabled: true,
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(1)),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      ObjectLockEnabled: true,
      ObjectLockConfiguration: {
        ObjectLockEnabled: 'Enabled',
        Rule: {
          DefaultRetention: {
            Mode: 'GOVERNANCE',
            Days: 1,
          },
        },
      },
    });
  });

  test('bucket with object lock enabled with compliance retention', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'Bucket', {
      objectLockEnabled: true,
      objectLockDefaultRetention: s3.ObjectLockRetention.compliance(cdk.Duration.days(1)),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      ObjectLockEnabled: true,
      ObjectLockConfiguration: {
        ObjectLockEnabled: 'Enabled',
        Rule: {
          DefaultRetention: {
            Mode: 'COMPLIANCE',
            Days: 1,
          },
        },
      },
    });
  });

  test('bucket with object lock disabled throws error with retention set', () => {
    const stack = new cdk.Stack();
    expect(() => new s3.Bucket(stack, 'Bucket', {
      objectLockEnabled: false,
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(1)),
    })).toThrow('Object Lock must be enabled to configure default retention settings');
  });

  test('bucket with object lock requires duration than one day', () => {
    const stack = new cdk.Stack();
    expect(() => new s3.Bucket(stack, 'Bucket', {
      objectLockEnabled: true,
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(0)),
    })).toThrow('Object Lock retention duration must be at least 1 day');
  });

  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-managing.html#object-lock-managing-retention-limits
  test('bucket with object lock requires duration less than 100 years', () => {
    const stack = new cdk.Stack();
    expect(() => new s3.Bucket(stack, 'Bucket', {
      objectLockEnabled: true,
      objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(365 * 101)),
    })).toThrow('Object Lock retention duration must be less than 100 years');
  });

  test('bucket with block public access set to BlockAll', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'PublicAccessBlockConfiguration': {
              'BlockPublicAcls': true,
              'BlockPublicPolicy': true,
              'IgnorePublicAcls': true,
              'RestrictPublicBuckets': true,
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with block public access set to BlockAcls', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'PublicAccessBlockConfiguration': {
              'BlockPublicAcls': true,
              'IgnorePublicAcls': true,
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with custom block public access setting', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      blockPublicAccess: new s3.BlockPublicAccess({ restrictPublicBuckets: true }),
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'PublicAccessBlockConfiguration': {
              'RestrictPublicBuckets': true,
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with custom canned access control', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'AccessControl': 'LogDeliveryWrite',
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  describe('permissions', () => {

    test('addPermission creates a bucket policy', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['foo'],
        actions: ['bar:baz'],
        principals: [new iam.AnyPrincipal()],
      }));

      Template.fromStack(stack).templateMatches({
        'Resources': {
          'MyBucketF68F3FF0': {
            'Type': 'AWS::S3::Bucket',
            'DeletionPolicy': 'Retain',
            'UpdateReplacePolicy': 'Retain',
          },
          'MyBucketPolicyE7FBAC7B': {
            'Type': 'AWS::S3::BucketPolicy',
            'Properties': {
              'Bucket': {
                'Ref': 'MyBucketF68F3FF0',
              },
              'PolicyDocument': {
                'Statement': [
                  {
                    'Action': 'bar:baz',
                    'Effect': 'Allow',
                    'Principal': { AWS: '*' },
                    'Resource': 'foo',
                  },
                ],
                'Version': '2012-10-17',
              },
            },
          },
        },
      });
    });

    test('forBucket returns a permission statement associated with the bucket\'s ARN', () => {
      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      const x = new iam.PolicyStatement({
        resources: [bucket.bucketArn],
        actions: ['s3:ListBucket'],
        principals: [new iam.AnyPrincipal()],
      });

      expect(stack.resolve(x.toStatementJson())).toEqual({
        Action: 's3:ListBucket',
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Resource: { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
      });
    });

    test('arnForObjects returns a permission statement associated with objects in the bucket', () => {
      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      const p = new iam.PolicyStatement({
        resources: [bucket.arnForObjects('hello/world')],
        actions: ['s3:GetObject'],
        principals: [new iam.AnyPrincipal()],
      });

      expect(stack.resolve(p.toStatementJson())).toEqual({
        Action: 's3:GetObject',
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Resource: {
          'Fn::Join': [
            '',
            [{ 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] }, '/hello/world'],
          ],
        },
      });
    });

    test('arnForObjects accepts multiple arguments and FnConcats them', () => {

      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      const user = new iam.User(stack, 'MyUser');
      const team = new iam.Group(stack, 'MyTeam');

      const resource = bucket.arnForObjects(`home/${team.groupName}/${user.userName}/*`);
      const p = new iam.PolicyStatement({
        resources: [resource],
        actions: ['s3:GetObject'],
        principals: [new iam.AnyPrincipal()],
      });

      expect(stack.resolve(p.toStatementJson())).toEqual({
        Action: 's3:GetObject',
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Resource: {
          'Fn::Join': [
            '',
            [
              { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
              '/home/',
              { Ref: 'MyTeam01DD6685' },
              '/',
              { Ref: 'MyUserDC45028B' },
              '/*',
            ],
          ],
        },
      });
    });
  });

  test('removal policy can be used to specify behavior upon delete', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.UNENCRYPTED,
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyBucketF68F3FF0: {
          Type: 'AWS::S3::Bucket',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });
  });

  describe('import/export', () => {
    test('static import(ref) allows importing an external/existing bucket', () => {
      const stack = new cdk.Stack();

      const bucketArn = 'arn:aws:s3:::my-bucket';
      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', { bucketArn });

      // this is a no-op since the bucket is external
      bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['foo'],
        actions: ['bar:baz'],
        principals: [new iam.AnyPrincipal()],
      }));

      const p = new iam.PolicyStatement({
        resources: [bucket.bucketArn],
        actions: ['s3:ListBucket'],
        principals: [new iam.AnyPrincipal()],
      });

      // it is possible to obtain a permission statement for a ref
      expect(p.toStatementJson()).toEqual({
        Action: 's3:ListBucket',
        Effect: 'Allow',
        Principal: { AWS: '*' },
        Resource: 'arn:aws:s3:::my-bucket',
      });

      expect(bucket.bucketArn).toEqual(bucketArn);
      expect(stack.resolve(bucket.bucketName)).toEqual('my-bucket');

      Template.fromStack(stack).templateMatches({});
    });

    test('import does not create any resources', () => {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', { bucketArn: 'arn:aws:s3:::my-bucket' });
      bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['*'],
        principals: [new iam.AnyPrincipal()],
      }));

      // at this point we technically didn't create any resources in the consuming stack.
      Template.fromStack(stack).templateMatches({});
    });

    test('import can also be used to import arbitrary ARNs', () => {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', { bucketArn: 'arn:aws:s3:::my-bucket' });
      bucket.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));

      // but now we can reference the bucket
      // you can even use the bucket name, which will be extracted from the arn provided.
      const user = new iam.User(stack, 'MyUser');
      user.addToPolicy(new iam.PolicyStatement({
        resources: [bucket.arnForObjects(`my/folder/${bucket.bucketName}`)],
        actions: ['s3:*'],
      }));

      Template.fromStack(stack).templateMatches({
        'Resources': {
          'MyUserDC45028B': {
            'Type': 'AWS::IAM::User',
          },
          'MyUserDefaultPolicy7B897426': {
            'Type': 'AWS::IAM::Policy',
            'Properties': {
              'PolicyDocument': {
                'Statement': [
                  {
                    'Action': 's3:*',
                    'Effect': 'Allow',
                    'Resource': 'arn:aws:s3:::my-bucket/my/folder/my-bucket',
                  },
                ],
                'Version': '2012-10-17',
              },
              'PolicyName': 'MyUserDefaultPolicy7B897426',
              'Users': [
                {
                  'Ref': 'MyUserDC45028B',
                },
              ],
            },
          },
        },
      });
    });

    test('import can explicitly set bucket region with different suffix than stack', () => {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'cn-north-1' },
      });

      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketName: 'mybucket',
        region: 'eu-west-1',
      });

      expect(bucket.bucketRegionalDomainName).toEqual('mybucket.s3.eu-west-1.amazonaws.com');
      expect(bucket.bucketWebsiteDomainName).toEqual('mybucket.s3-website-eu-west-1.amazonaws.com');
    });

    test('new bucketWebsiteUrl format for specific region', () => {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'us-east-2' },
      });

      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketName: 'mybucket',
      });

      expect(bucket.bucketWebsiteUrl).toEqual('http://mybucket.s3-website.us-east-2.amazonaws.com');
    });

    test('new bucketWebsiteUrl format for specific region with cn suffix', () => {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'cn-north-1' },
      });

      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketName: 'mybucket',
      });

      expect(bucket.bucketWebsiteUrl).toEqual('http://mybucket.s3-website.cn-north-1.amazonaws.com.cn');
    });


    testDeprecated('new bucketWebsiteUrl format with explicit bucketWebsiteNewUrlFormat', () => {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'us-east-1' },
      });

      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketName: 'mybucket',
        bucketWebsiteNewUrlFormat: true,
      });

      expect(bucket.bucketWebsiteUrl).toEqual('http://mybucket.s3-website.us-east-1.amazonaws.com');
    });

    testDeprecated('old bucketWebsiteUrl format with explicit bucketWebsiteNewUrlFormat', () => {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'us-east-2' },
      });

      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketName: 'mybucket',
        bucketWebsiteNewUrlFormat: false,
      });

      expect(bucket.bucketWebsiteUrl).toEqual('http://mybucket.s3-website-us-east-2.amazonaws.com');
    });

    test('import needs to specify a valid bucket name', () => {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'us-east-1' },
      });

      expect(() => s3.Bucket.fromBucketAttributes(stack, 'MyBucket3', {
        bucketName: 'arn:aws:s3:::example-com',
      })).toThrow();
    });
  });

  describe('fromCfnBucket()', () => {
    let stack: cdk.Stack;
    let cfnBucket: s3.CfnBucket;
    let bucket: s3.IBucket;

    beforeEach(() => {
      stack = new cdk.Stack();
      cfnBucket = new s3.CfnBucket(stack, 'CfnBucket');
      bucket = s3.Bucket.fromCfnBucket(cfnBucket);
    });

    test("correctly resolves the 'bucketName' property", () => {
      expect(stack.resolve(bucket.bucketName)).toStrictEqual({
        Ref: 'CfnBucket',
      });
    });

    test("correctly resolves the 'bucketArn' property", () => {
      expect(stack.resolve(bucket.bucketArn)).toStrictEqual({
        'Fn::GetAtt': ['CfnBucket', 'Arn'],
      });
    });

    test('allows setting the RemovalPolicy of the underlying resource', () => {
      bucket.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
        UpdateReplacePolicy: 'Retain',
        DeletionPolicy: 'Retain',
      });
    });

    test('correctly sets the default child of the returned L2', () => {
      expect(bucket.node.defaultChild).toBe(cfnBucket);
    });

    test('allows granting permissions to Principals', () => {
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountRootPrincipal(),
      });
      bucket.grantRead(role);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Resource': [{
                'Fn::GetAtt': ['CfnBucket', 'Arn'],
              }, {
                'Fn::Join': ['', [
                  { 'Fn::GetAtt': ['CfnBucket', 'Arn'] },
                  '/*',
                ]],
              }],
            },
          ],
        },
      });
    });

    test("sets the isWebsite property to 'false' if 'websiteConfiguration' is 'undefined'", () => {
      expect(bucket.isWebsite).toBeFalsy();
    });

    test("sets the isWebsite property to 'true' if 'websiteConfiguration' is not 'undefined'", () => {
      cfnBucket = new s3.CfnBucket(stack, 'WebsiteCfnBucket', {
        websiteConfiguration: {
          indexDocument: 'index.html',
        },
      });
      bucket = s3.Bucket.fromCfnBucket(cfnBucket);

      expect(bucket.isWebsite).toBeTruthy();
    });

    test('allows granting public access by default', () => {
      expect(() => {
        bucket.grantPublicAccess();
      }).not.toThrow();
    });

    test('does not allow granting public access for a Bucket that blocks it', () => {
      cfnBucket = new s3.CfnBucket(stack, 'BlockedPublicAccessCfnBucket', {
        publicAccessBlockConfiguration: {
          blockPublicPolicy: true,
        },
      });
      bucket = s3.Bucket.fromCfnBucket(cfnBucket);

      expect(() => {
        bucket.grantPublicAccess();
      }).toThrow(/Cannot grant public access when 'blockPublicPolicy' is enabled/);
    });

    test('correctly fills the encryption key if the L1 references one', () => {
      const cfnKey = new kms.CfnKey(stack, 'CfnKey', {
        keyPolicy: {
          'Statement': [
            {
              'Action': [
                'kms:*',
              ],
              'Effect': 'Allow',
              'Principal': {
                'AWS': {
                  'Fn::Join': ['', [
                    'arn:',
                    { 'Ref': 'AWS::Partition' },
                    ':iam::',
                    { 'Ref': 'AWS::AccountId' },
                    ':root',
                  ]],
                },
              },
              'Resource': '*',
            },
          ],
          'Version': '2012-10-17',
        },
      });
      cfnBucket = new s3.CfnBucket(stack, 'KmsEncryptedCfnBucket', {
        bucketEncryption: {
          serverSideEncryptionConfiguration: [
            {
              serverSideEncryptionByDefault: {
                kmsMasterKeyId: cfnKey.attrArn,
                sseAlgorithm: 'aws:kms',
              },
            },
          ],
        },
      });
      bucket = s3.Bucket.fromCfnBucket(cfnBucket);

      expect(bucket.encryptionKey).not.toBeUndefined();
    });

    test('allows importing a BucketPolicy that references a Bucket', () => {
      new s3.CfnBucketPolicy(stack, 'CfnBucketPolicy', {
        policyDocument: {
          'Statement': [
            {
              'Action': 's3:*',
              'Effect': 'Allow',
              'Principal': {
                'AWS': '*',
              },
              'Resource': ['*'],
            },
          ],
          'Version': '2012-10-17',
        },
        bucket: cfnBucket.ref,
      });
      bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['s3:*'],
        principals: [new iam.AccountRootPrincipal()],
      }));

      Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 2);
    });
  });

  test('grantRead', () => {
    const stack = new cdk.Stack();
    const reader = new iam.User(stack, 'Reader');
    const bucket = new s3.Bucket(stack, 'MyBucket');
    bucket.grantRead(reader);
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'ReaderF7BF189D': {
          'Type': 'AWS::IAM::User',
        },
        'ReaderDefaultPolicy151F3818': {
          'Type': 'AWS::IAM::Policy',
          'Properties': {
            'PolicyDocument': {
              'Statement': [
                {
                  'Action': [
                    's3:GetObject*',
                    's3:GetBucket*',
                    's3:List*',
                  ],
                  'Effect': 'Allow',
                  'Resource': [
                    {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'Arn',
                      ],
                    },
                    {
                      'Fn::Join': [
                        '',
                        [
                          {
                            'Fn::GetAtt': [
                              'MyBucketF68F3FF0',
                              'Arn',
                            ],
                          },
                          '/*',
                        ],
                      ],
                    },
                  ],
                },
              ],
              'Version': '2012-10-17',
            },
            'PolicyName': 'ReaderDefaultPolicy151F3818',
            'Users': [
              {
                'Ref': 'ReaderF7BF189D',
              },
            ],
          },
        },
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  describe('grantReadWrite', () => {
    test('can be used to grant reciprocal permissions to an identity', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');
      bucket.grantReadWrite(user);

      Template.fromStack(stack).templateMatches({
        'Resources': {
          'MyBucketF68F3FF0': {
            'Type': 'AWS::S3::Bucket',
            'DeletionPolicy': 'Retain',
            'UpdateReplacePolicy': 'Retain',
          },
          'MyUserDC45028B': {
            'Type': 'AWS::IAM::User',
          },
          'MyUserDefaultPolicy7B897426': {
            'Type': 'AWS::IAM::Policy',
            'Properties': {
              'PolicyDocument': {
                'Statement': [
                  {
                    'Action': [
                      's3:GetObject*',
                      's3:GetBucket*',
                      's3:List*',
                      's3:DeleteObject*',
                      's3:PutObject',
                      's3:PutObjectLegalHold',
                      's3:PutObjectRetention',
                      's3:PutObjectTagging',
                      's3:PutObjectVersionTagging',
                      's3:Abort*',
                    ],
                    'Effect': 'Allow',
                    'Resource': [
                      {
                        'Fn::GetAtt': [
                          'MyBucketF68F3FF0',
                          'Arn',
                        ],
                      },
                      {
                        'Fn::Join': [
                          '',
                          [
                            {
                              'Fn::GetAtt': [
                                'MyBucketF68F3FF0',
                                'Arn',
                              ],
                            },
                            '/*',
                          ],
                        ],
                      },
                    ],
                  },
                ],
                'Version': '2012-10-17',
              },
              'PolicyName': 'MyUserDefaultPolicy7B897426',
              'Users': [
                {
                  'Ref': 'MyUserDC45028B',
                },
              ],
            },
          },
        },
      });
    });

    test('grant permissions to non-identity principal', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });

      // WHEN
      bucket.grantRead(new iam.OrganizationPrincipal('o-1234'));

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          'Version': '2012-10-17',
          'Statement': [
            {
              'Action': ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
              'Condition': { 'StringEquals': { 'aws:PrincipalOrgID': 'o-1234' } },
              'Effect': 'Allow',
              'Principal': { AWS: '*' },
              'Resource': [
                { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] }, '/*']] },
              ],
            },
          ],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        'KeyPolicy': {
          'Statement': Match.arrayWith([
            {
              'Action': ['kms:Decrypt', 'kms:DescribeKey'],
              'Effect': 'Allow',
              'Resource': '*',
              'Principal': { AWS: '*' },
              'Condition': { 'StringEquals': { 'aws:PrincipalOrgID': 'o-1234' } },
            },
          ]),
          'Version': '2012-10-17',
        },

      });
    });

    test('does not grant PutObjectAcl when the S3_GRANT_WRITE_WITHOUT_ACL feature is enabled', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');

      bucket.grantReadWrite(user);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              'Effect': 'Allow',
              'Resource': [
                { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                {
                  'Fn::Join': ['', [
                    { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                    '/*',
                  ]],
                },
              ],
            },
          ],
        },
      }));
    });
  });

  describe('grantWrite', () => {
    test('with KMS key has appropriate permissions for multipart uploads', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });
      const user = new iam.User(stack, 'MyUser');
      bucket.grantWrite(user);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              'Effect': 'Allow',
              'Resource': [
                {
                  'Fn::GetAtt': [
                    'MyBucketF68F3FF0',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'MyBucketF68F3FF0',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
            {
              'Action': [
                'kms:Encrypt',
                'kms:ReEncrypt*',
                'kms:GenerateDataKey*',
                'kms:Decrypt',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::GetAtt': [
                  'MyBucketKeyC17130CF',
                  'Arn',
                ],
              },
            },
          ],
          'Version': '2012-10-17',
        },
        'PolicyName': 'MyUserDefaultPolicy7B897426',
        'Users': [
          {
            'Ref': 'MyUserDC45028B',
          },
        ],
      });
    });

    test('does not grant PutObjectAcl when the S3_GRANT_WRITE_WITHOUT_ACL feature is enabled', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');

      bucket.grantWrite(user);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              'Effect': 'Allow',
              'Resource': [
                { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                {
                  'Fn::Join': ['', [
                    { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                    '/*',
                  ]],
                },
              ],
            },
          ],
        },
      });
    });
  });

  describe('grantPut', () => {
    test('does not grant PutObjectAcl when the S3_GRANT_WRITE_WITHOUT_ACL feature is enabled', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');

      bucket.grantPut(user);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::Join': ['', [
                  { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                  '/*',
                ]],
              },
            },
          ],
        },
      });
    });
  });

  test('more grants', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });
    const putter = new iam.User(stack, 'Putter');
    const writer = new iam.User(stack, 'Writer');
    const deleter = new iam.User(stack, 'Deleter');

    bucket.grantPut(putter);
    bucket.grantWrite(writer);
    bucket.grantDelete(deleter);

    const resources = Template.fromStack(stack).toJSON().Resources;
    const actions = (id: string) => resources[id].Properties.PolicyDocument.Statement[0].Action;

    expect(actions('WriterDefaultPolicyDC585BCE')).toEqual([
      's3:DeleteObject*',
      's3:PutObject',
      's3:PutObjectLegalHold',
      's3:PutObjectRetention',
      's3:PutObjectTagging',
      's3:PutObjectVersionTagging',
      's3:Abort*',
    ]);
    expect(actions('PutterDefaultPolicyAB138DD3')).toEqual([
      's3:PutObject',
      's3:PutObjectLegalHold',
      's3:PutObjectRetention',
      's3:PutObjectTagging',
      's3:PutObjectVersionTagging',
      's3:Abort*',
    ]);
    expect(actions('DeleterDefaultPolicyCD33B8A0')).toEqual('s3:DeleteObject*');

  });

  test('grantDelete, with a KMS Key', () => {
    // given
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey');
    const deleter = new iam.User(stack, 'Deleter');
    const bucket = new s3.Bucket(stack, 'MyBucket', {
      bucketName: 'my-bucket-physical-name',
      encryptionKey: key,
      encryption: s3.BucketEncryption.KMS,
    });

    // when
    bucket.grantDelete(deleter);

    // then
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': 's3:DeleteObject*',
            'Effect': 'Allow',
            'Resource': {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'MyBucketF68F3FF0',
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
        'Version': '2012-10-17',
      },
    });
  });

  describe('cross-stack permissions', () => {
    test('in the same account and region', () => {
      const app = new cdk.App();
      const stackA = new cdk.Stack(app, 'stackA');
      const bucketFromStackA = new s3.Bucket(stackA, 'MyBucket');

      const stackB = new cdk.Stack(app, 'stackB');
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      bucketFromStackA.grantRead(user);

      Template.fromStack(stackA).templateMatches({
        'Resources': {
          'MyBucketF68F3FF0': {
            'Type': 'AWS::S3::Bucket',
            'DeletionPolicy': 'Retain',
            'UpdateReplacePolicy': 'Retain',
          },
        },
        'Outputs': {
          'ExportsOutputFnGetAttMyBucketF68F3FF0Arn0F7E8E58': {
            'Value': {
              'Fn::GetAtt': [
                'MyBucketF68F3FF0',
                'Arn',
              ],
            },
            'Export': {
              'Name': 'stackA:ExportsOutputFnGetAttMyBucketF68F3FF0Arn0F7E8E58',
            },
          },
        },
      });

      Template.fromStack(stackB).templateMatches({
        'Resources': {
          'UserWhoNeedsAccessF8959C3D': {
            'Type': 'AWS::IAM::User',
          },
          'UserWhoNeedsAccessDefaultPolicy6A9EB530': {
            'Type': 'AWS::IAM::Policy',
            'Properties': {
              'PolicyDocument': {
                'Statement': [
                  {
                    'Action': [
                      's3:GetObject*',
                      's3:GetBucket*',
                      's3:List*',
                    ],
                    'Effect': 'Allow',
                    'Resource': [
                      {
                        'Fn::ImportValue': 'stackA:ExportsOutputFnGetAttMyBucketF68F3FF0Arn0F7E8E58',
                      },
                      {
                        'Fn::Join': [
                          '',
                          [
                            {
                              'Fn::ImportValue': 'stackA:ExportsOutputFnGetAttMyBucketF68F3FF0Arn0F7E8E58',
                            },
                            '/*',
                          ],
                        ],
                      },
                    ],
                  },
                ],
                'Version': '2012-10-17',
              },
              'PolicyName': 'UserWhoNeedsAccessDefaultPolicy6A9EB530',
              'Users': [
                {
                  'Ref': 'UserWhoNeedsAccessF8959C3D',
                },
              ],
            },
          },
        },
      });
    });

    test('in different accounts', () => {
      // GIVEN
      const stackA = new cdk.Stack(undefined, 'StackA', { env: { account: '123456789012' } });
      const bucketFromStackA = new s3.Bucket(stackA, 'MyBucket', {
        bucketName: 'my-bucket-physical-name',
      });

      const stackB = new cdk.Stack(undefined, 'StackB', { env: { account: '234567890123' } });
      const roleFromStackB = new iam.Role(stackB, 'MyRole', {
        assumedBy: new iam.AccountPrincipal('234567890123'),
        roleName: 'MyRolePhysicalName',
      });

      // WHEN
      bucketFromStackA.grantRead(roleFromStackB);

      // THEN
      Template.fromStack(stackA).hasResourceProperties('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            Match.objectLike({
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
              'Principal': {
                'AWS': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':iam::234567890123:role/MyRolePhysicalName',
                    ],
                  ],
                },
              },
            }),
          ],
        },
      });

      Template.fromStack(stackB).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              'Effect': 'Allow',
              'Resource': [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':s3:::my-bucket-physical-name',
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':s3:::my-bucket-physical-name/*',
                    ],
                  ],
                },
              ],
            },
          ],
        },
      });
    });

    test('in different accounts, with a KMS Key', () => {
      // GIVEN
      const stackA = new cdk.Stack(undefined, 'StackA', { env: { account: '123456789012' } });
      const key = new kms.Key(stackA, 'MyKey');
      const bucketFromStackA = new s3.Bucket(stackA, 'MyBucket', {
        bucketName: 'my-bucket-physical-name',
        encryptionKey: key,
        encryption: s3.BucketEncryption.KMS,
      });

      const stackB = new cdk.Stack(undefined, 'StackB', { env: { account: '234567890123' } });
      const roleFromStackB = new iam.Role(stackB, 'MyRole', {
        assumedBy: new iam.AccountPrincipal('234567890123'),
        roleName: 'MyRolePhysicalName',
      });

      // WHEN
      bucketFromStackA.grantRead(roleFromStackB);

      // THEN
      Template.fromStack(stackA).hasResourceProperties('AWS::KMS::Key', {
        'KeyPolicy': {
          'Statement': Match.arrayWith([
            Match.objectLike({
              'Action': [
                'kms:Decrypt',
                'kms:DescribeKey',
              ],
              'Effect': 'Allow',
              'Principal': {
                'AWS': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':iam::234567890123:role/MyRolePhysicalName',
                    ],
                  ],
                },
              },
            }),
          ]),
        },
      });

      Template.fromStack(stackB).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': Match.arrayWith([
            Match.objectLike({
              'Action': [
                'kms:Decrypt',
                'kms:DescribeKey',
              ],
              'Effect': 'Allow',
              'Resource': '*',
            }),
          ]),
        },
      });
    });
  });

  test('urlForObject returns a token with the S3 URL of the token', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');
    const bucketWithRegion = s3.Bucket.fromBucketAttributes(stack, 'RegionalBucket', {
      bucketArn: 'arn:aws:s3:::explicit-region-bucket',
      region: 'us-west-2',
    });

    new cdk.CfnOutput(stack, 'BucketURL', { value: bucket.urlForObject() });
    new cdk.CfnOutput(stack, 'MyFileURL', { value: bucket.urlForObject('my/file.txt') });
    new cdk.CfnOutput(stack, 'YourFileURL', { value: bucket.urlForObject('/your/file.txt') }); // "/" is optional
    new cdk.CfnOutput(stack, 'RegionBucketURL', { value: bucketWithRegion.urlForObject() });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
      'Outputs': {
        'BucketURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://s3.',
                {
                  'Ref': 'AWS::Region',
                },
                '.',
                {
                  'Ref': 'AWS::URLSuffix',
                },
                '/',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
              ],
            ],
          },
        },
        'MyFileURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://s3.',
                {
                  'Ref': 'AWS::Region',
                },
                '.',
                {
                  'Ref': 'AWS::URLSuffix',
                },
                '/',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '/my/file.txt',
              ],
            ],
          },
        },
        'YourFileURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://s3.',
                {
                  'Ref': 'AWS::Region',
                },
                '.',
                {
                  'Ref': 'AWS::URLSuffix',
                },
                '/',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '/your/file.txt',
              ],
            ],
          },
        },
        'RegionBucketURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://s3.us-west-2.',
                {
                  'Ref': 'AWS::URLSuffix',
                },
                '/explicit-region-bucket',
              ],
            ],
          },
        },
      },
    });
  });

  test('s3UrlForObject returns a token with the S3 URL of the token', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');

    new cdk.CfnOutput(stack, 'BucketS3URL', { value: bucket.s3UrlForObject() });
    new cdk.CfnOutput(stack, 'MyFileS3URL', { value: bucket.s3UrlForObject('my/file.txt') });
    new cdk.CfnOutput(stack, 'YourFileS3URL', { value: bucket.s3UrlForObject('/your/file.txt') }); // "/" is optional

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
      'Outputs': {
        'BucketS3URL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
              ],
            ],
          },
        },
        'MyFileS3URL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '/my/file.txt',
              ],
            ],
          },
        },
        'YourFileS3URL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '/your/file.txt',
              ],
            ],
          },
        },
      },
    });
  });

  describe('grantPublicAccess', () => {
    test('by default, grants s3:GetObject to all objects', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      bucket.grantPublicAccess();

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:GetObject',
              'Effect': 'Allow',
              'Principal': { AWS: '*' },
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/*']] },
            },
          ],
          'Version': '2012-10-17',
        },
      });

    });

    test('"keyPrefix" can be used to only grant access to certain objects', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      bucket.grantPublicAccess('only/access/these/*');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:GetObject',
              'Effect': 'Allow',
              'Principal': { AWS: '*' },
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/only/access/these/*']] },
            },
          ],
          'Version': '2012-10-17',
        },
      });

    });

    test('"allowedActions" can be used to specify actions explicitly', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      bucket.grantPublicAccess('*', 's3:GetObject', 's3:PutObject');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': ['s3:GetObject', 's3:PutObject'],
              'Effect': 'Allow',
              'Principal': { AWS: '*' },
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/*']] },
            },
          ],
          'Version': '2012-10-17',
        },
      });

    });

    test('returns the PolicyStatement which can be then customized', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      const result = bucket.grantPublicAccess();
      result.resourceStatement!.addCondition('IpAddress', { 'aws:SourceIp': '54.240.143.0/24' });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:GetObject',
              'Effect': 'Allow',
              'Principal': { AWS: '*' },
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/*']] },
              'Condition': {
                'IpAddress': { 'aws:SourceIp': '54.240.143.0/24' },
              },
            },
          ],
          'Version': '2012-10-17',
        },
      });

    });

    test('throws when blockPublicPolicy is set to true', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', {
        blockPublicAccess: new s3.BlockPublicAccess({ blockPublicPolicy: true }),
      });

      // THEN
      expect(() => bucket.grantPublicAccess()).toThrow(/blockPublicPolicy/);
    });
  });

  describe('website configuration', () => {
    test('only index doc', () => {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index2.html',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          IndexDocument: 'index2.html',
        },
      });

    });
    test('fails if only error doc is specified', () => {
      const stack = new cdk.Stack();
      expect(() => {
        new s3.Bucket(stack, 'Website', {
          websiteErrorDocument: 'error.html',
        });
      }).toThrow(/"websiteIndexDocument" is required if "websiteErrorDocument" is set/);

    });
    test('error and index docs', () => {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index2.html',
        websiteErrorDocument: 'error.html',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          IndexDocument: 'index2.html',
          ErrorDocument: 'error.html',
        },
      });

    });
    test('exports the WebsiteURL', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index.html',
      });
      expect(stack.resolve(bucket.bucketWebsiteUrl)).toEqual({ 'Fn::GetAtt': ['Website32962D0B', 'WebsiteURL'] });

    });
    test('exports the WebsiteDomain', () => {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index.html',
      });
      expect(stack.resolve(bucket.bucketWebsiteDomainName)).toEqual({
        'Fn::Select': [
          2,
          {
            'Fn::Split': ['/', { 'Fn::GetAtt': ['Website32962D0B', 'WebsiteURL'] }],
          },
        ],
      });

    });
    test('exports the WebsiteURL for imported buckets', () => {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketName(stack, 'Website', 'my-test-bucket');
      expect(stack.resolve(bucket.bucketWebsiteUrl)).toEqual({
        'Fn::Join': [
          '',
          [
            'http://my-test-bucket.',
            {
              'Fn::FindInMap': [
                'S3staticwebsiteMap',
                { Ref: 'AWS::Region' },
                'endpoint',
              ],
            },
          ],
        ],
      });
      expect(stack.resolve(bucket.bucketWebsiteDomainName)).toEqual({
        'Fn::Join': [
          '',
          [
            'my-test-bucket.',
            {
              'Fn::FindInMap': [
                'S3staticwebsiteMap',
                { Ref: 'AWS::Region' },
                'endpoint',
              ],
            },
          ],
        ],
      });
    });
    test('exports the WebsiteURL for imported buckets with url', () => {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketAttributes(stack, 'Website', {
        bucketName: 'my-test-bucket',
        bucketWebsiteUrl: 'http://my-test-bucket.my-test.suffix',
      });
      expect(stack.resolve(bucket.bucketWebsiteUrl)).toEqual('http://my-test-bucket.my-test.suffix');
      expect(stack.resolve(bucket.bucketWebsiteDomainName)).toEqual('my-test-bucket.my-test.suffix');

    });
    test('adds RedirectAllRequestsTo property', () => {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteRedirect: {
          hostName: 'www.example.com',
          protocol: s3.RedirectProtocol.HTTPS,
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          RedirectAllRequestsTo: {
            HostName: 'www.example.com',
            Protocol: 'https',
          },
        },
      });

    });
    test('fails if websiteRedirect and websiteIndex and websiteError are specified', () => {
      const stack = new cdk.Stack();
      expect(() => {
        new s3.Bucket(stack, 'Website', {
          websiteIndexDocument: 'index.html',
          websiteErrorDocument: 'error.html',
          websiteRedirect: {
            hostName: 'www.example.com',
          },
        });
      }).toThrow(/"websiteIndexDocument", "websiteErrorDocument" and, "websiteRoutingRules" cannot be set if "websiteRedirect" is used/);

    });
    test('fails if websiteRedirect and websiteRoutingRules are specified', () => {
      const stack = new cdk.Stack();
      expect(() => {
        new s3.Bucket(stack, 'Website', {
          websiteRoutingRules: [],
          websiteRedirect: {
            hostName: 'www.example.com',
          },
        });
      }).toThrow(/"websiteIndexDocument", "websiteErrorDocument" and, "websiteRoutingRules" cannot be set if "websiteRedirect" is used/);

    });
    test('adds RedirectRules property', () => {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteRoutingRules: [{
          hostName: 'www.example.com',
          httpRedirectCode: '302',
          protocol: s3.RedirectProtocol.HTTPS,
          replaceKey: s3.ReplaceKey.prefixWith('test/'),
          condition: {
            httpErrorCodeReturnedEquals: '200',
            keyPrefixEquals: 'prefix',
          },
        }],
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          RoutingRules: [{
            RedirectRule: {
              HostName: 'www.example.com',
              HttpRedirectCode: '302',
              Protocol: 'https',
              ReplaceKeyPrefixWith: 'test/',
            },
            RoutingRuleCondition: {
              HttpErrorCodeReturnedEquals: '200',
              KeyPrefixEquals: 'prefix',
            },
          }],
        },
      });

    });
    test('fails if routingRule condition object is empty', () => {
      const stack = new cdk.Stack();
      expect(() => {
        new s3.Bucket(stack, 'Website', {
          websiteRoutingRules: [{
            httpRedirectCode: '303',
            condition: {},
          }],
        });
      }).toThrow(/The condition property cannot be an empty object/);

    });
    describe('isWebsite set properly with', () => {
      test('only index doc', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website', {
          websiteIndexDocument: 'index2.html',
        });
        expect(bucket.isWebsite).toEqual(true);

      });
      test('error and index docs', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website', {
          websiteIndexDocument: 'index2.html',
          websiteErrorDocument: 'error.html',
        });
        expect(bucket.isWebsite).toEqual(true);

      });
      test('redirects', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website', {
          websiteRedirect: {
            hostName: 'www.example.com',
            protocol: s3.RedirectProtocol.HTTPS,
          },
        });
        expect(bucket.isWebsite).toEqual(true);

      });
      test('no website properties set', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website');
        expect(bucket.isWebsite).toEqual(false);

      });
      test('imported website buckets', () => {
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketAttributes(stack, 'Website', {
          bucketArn: 'arn:aws:s3:::my-bucket',
          isWebsite: true,
        });
        expect(bucket.isWebsite).toEqual(true);

      });
      test('imported buckets', () => {
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketAttributes(stack, 'NotWebsite', {
          bucketArn: 'arn:aws:s3:::my-bucket',
        });
        expect(bucket.isWebsite).toEqual(false);

      });
    });
  });

  test('Bucket.fromBucketArn', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = s3.Bucket.fromBucketArn(stack, 'my-bucket', 'arn:aws:s3:::my-corporate-bucket');

    // THEN
    expect(bucket.bucketName).toEqual('my-corporate-bucket');
    expect(bucket.bucketArn).toEqual('arn:aws:s3:::my-corporate-bucket');

  });

  test('Bucket.fromBucketName', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = s3.Bucket.fromBucketName(stack, 'imported-bucket', 'my-bucket-name');

    // THEN
    expect(bucket.bucketName).toEqual('my-bucket-name');
    expect(stack.resolve(bucket.bucketArn)).toEqual({
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket-name']],
    });
  });

  test('if a kms key is specified, it implies bucket is encrypted with kms (dah)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'k');

    // THEN
    new s3.Bucket(stack, 'b', { encryptionKey: key });
  });

  test('Bucket with Server Access Logs', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = new s3.Bucket(stack, 'AccessLogs');
    new s3.Bucket(stack, 'MyBucket', {
      serverAccessLogsBucket: accessLogBucket,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LoggingConfiguration: {
        DestinationBucketName: {
          Ref: 'AccessLogs8B620ECA',
        },
      },
    });
  });

  test('Bucket with Server Access Logs with Prefix', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = new s3.Bucket(stack, 'AccessLogs');
    new s3.Bucket(stack, 'MyBucket', {
      serverAccessLogsBucket: accessLogBucket,
      serverAccessLogsPrefix: 'hello',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LoggingConfiguration: {
        DestinationBucketName: {
          Ref: 'AccessLogs8B620ECA',
        },
        LogFilePrefix: 'hello',
      },
    });
  });

  test('Access log prefix given without bucket', () => {
    // GIVEN
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      serverAccessLogsPrefix: 'hello',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      LoggingConfiguration: {
        LogFilePrefix: 'hello',
      },
    });
  });

  test('Bucket Allow Log delivery changes bucket Access Control should fail', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = new s3.Bucket(stack, 'AccessLogs', {
      accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
    });
    expect(() =>
      new s3.Bucket(stack, 'MyBucket', {
        serverAccessLogsBucket: accessLogBucket,
        serverAccessLogsPrefix: 'hello',
        accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
      }),
    ).toThrow(/Cannot enable log delivery to this bucket because the bucket's ACL has been set and can't be changed/);
  });

  test('Bucket skips setting up access log ACL but configures delivery for an imported target bucket', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = s3.Bucket.fromBucketName(stack, 'TargetBucket', 'target-logs-bucket');
    new s3.Bucket(stack, 'TestBucket', {
      serverAccessLogsBucket: accessLogBucket,
      serverAccessLogsPrefix: 'test/',
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3::Bucket', {
      LoggingConfiguration: {
        DestinationBucketName: stack.resolve(accessLogBucket.bucketName),
        LogFilePrefix: 'test/',
      },
    });
    template.allResourcesProperties('AWS::S3::Bucket', {
      AccessControl: Match.absent(),
    });
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('Unable to add necessary logging permissions to imported target bucket'));
  });

  test('Bucket Allow Log delivery should use the recommended policy when flag enabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext('@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy', true);

    // WHEN
    const bucket = new s3.Bucket(stack, 'TestBucket', { serverAccessLogsPrefix: 'test' });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3::Bucket', {
      AccessControl: Match.absent(),
    });
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: stack.resolve(bucket.bucketName),
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([Match.objectLike({
          Effect: 'Allow',
          Principal: { Service: 'logging.s3.amazonaws.com' },
          Action: 's3:PutObject',
          Resource: stack.resolve(`${bucket.bucketArn}/test*`),
          Condition: {
            ArnLike: {
              'aws:SourceArn': stack.resolve(bucket.bucketArn),
            },
            StringEquals: {
              'aws:SourceAccount': { 'Ref': 'AWS::AccountId' },
            },
          },
        })]),
      }),
    });
  });

  test('Log Delivery bucket policy should properly set source bucket ARN/Account', () => {
    // GIVEN
    const stack = new cdk.Stack();
    stack.node.setContext('@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy', true);

    // WHEN
    const targetBucket = new s3.Bucket(stack, 'TargetBucket');
    const sourceBucket = new s3.Bucket(stack, 'SourceBucket', { serverAccessLogsBucket: targetBucket });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: stack.resolve(targetBucket.bucketName),
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([Match.objectLike({
          Effect: 'Allow',
          Principal: { Service: 'logging.s3.amazonaws.com' },
          Action: 's3:PutObject',
          Resource: stack.resolve(`${targetBucket.bucketArn}/*`),
          Condition: {
            ArnLike: {
              'aws:SourceArn': stack.resolve(sourceBucket.bucketArn),
            },
            StringEquals: {
              'aws:SourceAccount': stack.resolve(sourceBucket.env.account),
            },
          },
        })]),
      }),
    });
  });

  test('Defaults for an inventory bucket', () => {
    // Given
    const stack = new cdk.Stack();

    const inventoryBucket = new s3.Bucket(stack, 'InventoryBucket');
    new s3.Bucket(stack, 'MyBucket', {
      inventories: [
        {
          destination: {
            bucket: inventoryBucket,
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      InventoryConfigurations: [
        {
          Enabled: true,
          IncludedObjectVersions: 'All',
          ScheduleFrequency: 'Weekly',
          Destination: {
            Format: 'CSV',
            BucketArn: { 'Fn::GetAtt': ['InventoryBucketA869B8CB', 'Arn'] },
          },
          Id: 'MyBucketInventory0',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: { Ref: 'InventoryBucketA869B8CB' },
      PolicyDocument: {
        Statement: Match.arrayWith([Match.objectLike({
          Action: 's3:PutObject',
          Principal: { Service: 's3.amazonaws.com' },
          Resource: [
            {
              'Fn::GetAtt': ['InventoryBucketA869B8CB', 'Arn'],
            },
            {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['InventoryBucketA869B8CB', 'Arn'] }, '/*']],
            },
          ],
        })]),
      },
    });
  });

  test('Bucket with objectOwnership set to BUCKET_OWNER_ENFORCED', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    });
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'OwnershipControls': {
              'Rules': [
                {
                  'ObjectOwnership': 'BucketOwnerEnforced',
                },
              ],
            },
          },
          'UpdateReplacePolicy': 'Retain',
          'DeletionPolicy': 'Retain',
        },
      },
    });
  });

  test('Bucket with objectOwnership set to BUCKET_OWNER_PREFERRED', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
    });
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'OwnershipControls': {
              'Rules': [
                {
                  'ObjectOwnership': 'BucketOwnerPreferred',
                },
              ],
            },
          },
          'UpdateReplacePolicy': 'Retain',
          'DeletionPolicy': 'Retain',
        },
      },
    });
  });

  test('Bucket with objectOwnership set to OBJECT_WRITER', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
    });
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'OwnershipControls': {
              'Rules': [
                {
                  'ObjectOwnership': 'ObjectWriter',
                },
              ],
            },
          },
          'UpdateReplacePolicy': 'Retain',
          'DeletionPolicy': 'Retain',
        },
      },
    });
  });

  test('Bucket with objectOwnerships set to undefined', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: undefined,
    });
    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'UpdateReplacePolicy': 'Retain',
          'DeletionPolicy': 'Retain',
        },
      },
    });
  });

  test('with autoDeleteObjects', () => {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'MyBucketF68F3FF0',
      },
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              's3:GetBucket*',
              's3:List*',
              's3:DeleteObject*',
            ],
            'Effect': 'Allow',
            'Principal': {
              'AWS': {
                'Fn::GetAtt': [
                  'CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092',
                  'Arn',
                ],
              },
            },
            'Resource': [
              {
                'Fn::GetAtt': [
                  'MyBucketF68F3FF0',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
          },
        ],
        'Version': '2012-10-17',
      },
    });

    Template.fromStack(stack).hasResource('Custom::S3AutoDeleteObjects', {
      'Properties': {
        'ServiceToken': {
          'Fn::GetAtt': [
            'CustomS3AutoDeleteObjectsCustomResourceProviderHandler9D90184F',
            'Arn',
          ],
        },
        'BucketName': {
          'Ref': 'MyBucketF68F3FF0',
        },
      },
      'DependsOn': [
        'MyBucketPolicyE7FBAC7B',
      ],
    });
  });

  test('with autoDeleteObjects on multiple buckets', () => {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'Bucket1', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3.Bucket(stack, 'Bucket2', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
  });

  test('autoDeleteObjects throws if RemovalPolicy is not DESTROY', () => {
    const stack = new cdk.Stack();

    expect(() => new s3.Bucket(stack, 'MyBucket', {
      autoDeleteObjects: true,
    })).toThrow(/Cannot use \'autoDeleteObjects\' property on a bucket without setting removal policy to \'DESTROY\'/);
  });

  test('bucket with transfer acceleration turned on', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      transferAcceleration: true,
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'AccelerateConfiguration': {
              'AccelerationStatus': 'Enabled',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('transferAccelerationUrlForObject returns a token with the S3 URL of the token', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');
    const bucketWithRegion = s3.Bucket.fromBucketAttributes(stack, 'RegionalBucket', {
      bucketArn: 'arn:aws:s3:::explicit-region-bucket',
      region: 'us-west-2',
    });

    new cdk.CfnOutput(stack, 'BucketURL', { value: bucket.transferAccelerationUrlForObject() });
    new cdk.CfnOutput(stack, 'MyFileURL', { value: bucket.transferAccelerationUrlForObject('my/file.txt') });
    new cdk.CfnOutput(stack, 'YourFileURL', { value: bucket.transferAccelerationUrlForObject('/your/file.txt') }); // "/" is optional
    new cdk.CfnOutput(stack, 'RegionBucketURL', { value: bucketWithRegion.transferAccelerationUrlForObject() });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
      'Outputs': {
        'BucketURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '.s3-accelerate.amazonaws.com/',
              ],
            ],
          },
        },
        'MyFileURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '.s3-accelerate.amazonaws.com/my/file.txt',
              ],
            ],
          },
        },
        'YourFileURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '.s3-accelerate.amazonaws.com/your/file.txt',
              ],
            ],
          },
        },
        'RegionBucketURL': {
          'Value': 'https://explicit-region-bucket.s3-accelerate.amazonaws.com/',
        },
      },
    });
  });

  test('transferAccelerationUrlForObject with dual stack option returns a token with the S3 URL of the token', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');
    const bucketWithRegion = s3.Bucket.fromBucketAttributes(stack, 'RegionalBucket', {
      bucketArn: 'arn:aws:s3:::explicit-region-bucket',
      region: 'us-west-2',
    });

    new cdk.CfnOutput(stack, 'BucketURL', { value: bucket.transferAccelerationUrlForObject(undefined, { dualStack: true }) });
    new cdk.CfnOutput(stack, 'MyFileURL', { value: bucket.transferAccelerationUrlForObject('my/file.txt', { dualStack: true }) });
    new cdk.CfnOutput(stack, 'YourFileURL', { value: bucket.transferAccelerationUrlForObject('/your/file.txt', { dualStack: true }) }); // "/" is optional
    new cdk.CfnOutput(stack, 'RegionBucketURL', { value: bucketWithRegion.transferAccelerationUrlForObject(undefined, { dualStack: true }) });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
      'Outputs': {
        'BucketURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '.s3-accelerate.dualstack.amazonaws.com/',
              ],
            ],
          },
        },
        'MyFileURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '.s3-accelerate.dualstack.amazonaws.com/my/file.txt',
              ],
            ],
          },
        },
        'YourFileURL': {
          'Value': {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  'Ref': 'MyBucketF68F3FF0',
                },
                '.s3-accelerate.dualstack.amazonaws.com/your/file.txt',
              ],
            ],
          },
        },
        'RegionBucketURL': {
          'Value': 'https://explicit-region-bucket.s3-accelerate.dualstack.amazonaws.com/',
        },
      },
    });
  });

  test('bucket with intelligent tiering turned on', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      intelligentTieringConfigurations: [{
        name: 'foo',
      }],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'IntelligentTieringConfigurations': [
              {
                'Id': 'foo',
                'Status': 'Enabled',
                'Tierings': [],
              },
            ],
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with intelligent tiering turned on with archive access', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      intelligentTieringConfigurations: [{
        name: 'foo',
        archiveAccessTierTime: cdk.Duration.days(90),
      }],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'IntelligentTieringConfigurations': [
              {
                'Id': 'foo',
                'Status': 'Enabled',
                'Tierings': [{
                  'AccessTier': 'ARCHIVE_ACCESS',
                  'Days': 90,
                }],
              },
            ],
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with intelligent tiering turned on with deep archive access', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      intelligentTieringConfigurations: [{
        name: 'foo',
        deepArchiveAccessTierTime: cdk.Duration.days(180),
      }],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'IntelligentTieringConfigurations': [
              {
                'Id': 'foo',
                'Status': 'Enabled',
                'Tierings': [{
                  'AccessTier': 'DEEP_ARCHIVE_ACCESS',
                  'Days': 180,
                }],
              },
            ],
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('bucket with intelligent tiering turned on with all properties', () => {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      intelligentTieringConfigurations: [{
        name: 'foo',
        prefix: 'bar',
        archiveAccessTierTime: cdk.Duration.days(90),
        deepArchiveAccessTierTime: cdk.Duration.days(180),
        tags: [{ key: 'test', value: 'bazz' }],
      }],
    });

    Template.fromStack(stack).templateMatches({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
            'IntelligentTieringConfigurations': [
              {
                'Id': 'foo',
                'Prefix': 'bar',
                'Status': 'Enabled',
                'TagFilters': [
                  {
                    'Key': 'test',
                    'Value': 'bazz',
                  },
                ],
                'Tierings': [{
                  'AccessTier': 'ARCHIVE_ACCESS',
                  'Days': 90,
                },
                {
                  'AccessTier': 'DEEP_ARCHIVE_ACCESS',
                  'Days': 180,
                }],
              },
            ],
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
  });

  test('Event Bridge notification can be enabled after the bucket is created', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');
    bucket.enableEventBridgeNotification();

    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      NotificationConfiguration: {
        EventBridgeConfiguration: {},
      },
    });
  });
});
