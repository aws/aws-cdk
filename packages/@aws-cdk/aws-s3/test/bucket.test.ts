import { EOL } from 'os';
import { countResources, expect, haveResource, haveResourceLike, ResourcePart, SynthUtils, arrayWith, objectLike } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as s3 from '../lib';

// to make it easy to copy & paste from output:
/* eslint-disable quote-props */

nodeunitShim({
  'default bucket'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket');

    expect(stack).toMatch({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });

    test.done();
  },

  'CFN properties are type-validated during resolution'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      bucketName: cdk.Token.asString(5), // Oh no
    });

    test.throws(() => {
      SynthUtils.synthesize(stack);
    }, /bucketName: 5 should be a string/);

    test.done();
  },

  'bucket without encryption'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.UNENCRYPTED,
    });

    expect(stack).toMatch({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });

    test.done();
  },

  'bucket with managed encryption'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    expect(stack).toMatch({
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
    test.done();
  },

  'valid bucket names'(test: Test) {
    const stack = new cdk.Stack();

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'abc.xyz-34ab',
    }));

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: '124.pp--33',
    }));

    test.done();
  },

  'bucket validation skips tokenized values'(test: Test) {
    const stack = new cdk.Stack();

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket', {
      bucketName: cdk.Lazy.string({ produce: () => '_BUCKET' }),
    }));

    test.done();
  },

  'fails with message on invalid bucket names'(test: Test) {
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

    test.throws(() => new s3.Bucket(stack, 'MyBucket', {
      bucketName: bucket,
    }), expectedErrors);

    test.done();
  },

  'fails if bucket name has less than 3 or more than 63 characters'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'a',
    }), /at least 3/);

    test.throws(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: new Array(65).join('x'),
    }), /no more than 63/);

    test.done();
  },

  'fails if bucket name has invalid characters'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'b@cket',
    }), /offset: 1/);

    test.throws(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: 'bucKet',
    }), /offset: 3/);

    test.throws(() => new s3.Bucket(stack, 'MyBucket3', {
      bucketName: 'bučket',
    }), /offset: 2/);

    test.done();
  },

  'fails if bucket name does not start or end with lowercase character or number'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: '-ucket',
    }), /offset: 0/);

    test.throws(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: 'bucke.',
    }), /offset: 5/);

    test.done();
  },

  'fails only if bucket name has the consecutive symbols (..), (.-), (-.)'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: 'buc..ket',
    }), /offset: 3/);

    test.throws(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: 'buck.-et',
    }), /offset: 4/);

    test.throws(() => new s3.Bucket(stack, 'MyBucket3', {
      bucketName: 'b-.ucket',
    }), /offset: 1/);

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket4', {
      bucketName: 'bu--cket',
    }));

    test.done();
  },

  'fails only if bucket name resembles IP address'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket1', {
      bucketName: '1.2.3.4',
    }), /must not resemble an IP address/);

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket2', {
      bucketName: '1.2.3',
    }));

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket3', {
      bucketName: '1.2.3.a',
    }));

    test.doesNotThrow(() => new s3.Bucket(stack, 'MyBucket4', {
      bucketName: '1000.2.3.4',
    }));

    test.done();
  },

  'fails if encryption key is used with managed encryption'(test: Test) {
    const stack = new cdk.Stack();
    const myKey = new kms.Key(stack, 'MyKey');

    test.throws(() => new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
      encryptionKey: myKey,
    }), /encryptionKey is specified, so 'encryption' must be set to KMS/);

    test.done();
  },

  'fails if encryption key is used with encryption set to unencrypted'(test: Test) {
    const stack = new cdk.Stack();
    const myKey = new kms.Key(stack, 'MyKey');

    test.throws(() => new s3.Bucket(stack, 'MyBucket', {
      encryption: s3.BucketEncryption.UNENCRYPTED,
      encryptionKey: myKey,
    }), /encryptionKey is specified, so 'encryption' must be set to KMS/);

    test.done();
  },

  'encryptionKey can specify kms key'(test: Test) {
    const stack = new cdk.Stack();

    const encryptionKey = new kms.Key(stack, 'MyKey', { description: 'hello, world' });

    new s3.Bucket(stack, 'MyBucket', { encryptionKey, encryption: s3.BucketEncryption.KMS });

    expect(stack).toMatch({
      'Resources': {
        'MyKey6AB29FA6': {
          'Type': 'AWS::KMS::Key',
          'Properties': {
            'Description': 'hello, world',
            'KeyPolicy': {
              'Statement': [
                {
                  'Action': [
                    'kms:Create*',
                    'kms:Describe*',
                    'kms:Enable*',
                    'kms:List*',
                    'kms:Put*',
                    'kms:Update*',
                    'kms:Revoke*',
                    'kms:Disable*',
                    'kms:Get*',
                    'kms:Delete*',
                    'kms:ScheduleKeyDeletion',
                    'kms:CancelKeyDeletion',
                    'kms:GenerateDataKey',
                    'kms:TagResource',
                    'kms:UntagResource',
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
                          ':iam::',
                          {
                            'Ref': 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                  'Resource': '*',
                },
              ],
              'Version': '2012-10-17',
            },
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'Properties': {
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
          },
          'DeletionPolicy': 'Retain',
          'UpdateReplacePolicy': 'Retain',
        },
      },
    });
    test.done();
  },

  'bucket with versioning turned on'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      versioned: true,
    });

    expect(stack).toMatch({
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
    test.done();
  },

  'bucket with block public access set to BlockAll'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    expect(stack).toMatch({
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
    test.done();
  },

  'bucket with block public access set to BlockAcls'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    expect(stack).toMatch({
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
    test.done();
  },

  'bucket with custom block public access setting'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      blockPublicAccess: new s3.BlockPublicAccess({ restrictPublicBuckets: true }),
    });

    expect(stack).toMatch({
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
    test.done();
  },

  'bucket with custom canned access control'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
    });

    expect(stack).toMatch({
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
    test.done();
  },

  'permissions': {

    'addPermission creates a bucket policy'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['foo'],
        actions: ['bar:baz'],
        principals: [new iam.AnyPrincipal()],
      }));

      expect(stack).toMatch({
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
                    'Principal': '*',
                    'Resource': 'foo',
                  },
                ],
                'Version': '2012-10-17',
              },
            },
          },
        },
      });

      test.done();
    },

    'forBucket returns a permission statement associated with the bucket\'s ARN'(test: Test) {
      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      const x = new iam.PolicyStatement({
        resources: [bucket.bucketArn],
        actions: ['s3:ListBucket'],
        principals: [new iam.AnyPrincipal()],
      });

      test.deepEqual(stack.resolve(x.toStatementJson()), {
        Action: 's3:ListBucket',
        Effect: 'Allow',
        Principal: '*',
        Resource: { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
      });

      test.done();
    },

    'arnForObjects returns a permission statement associated with objects in the bucket'(test: Test) {
      const stack = new cdk.Stack();

      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.UNENCRYPTED });

      const p = new iam.PolicyStatement({
        resources: [bucket.arnForObjects('hello/world')],
        actions: ['s3:GetObject'],
        principals: [new iam.AnyPrincipal()],
      });

      test.deepEqual(stack.resolve(p.toStatementJson()), {
        Action: 's3:GetObject',
        Effect: 'Allow',
        Principal: '*',
        Resource: {
          'Fn::Join': [
            '',
            [{ 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] }, '/hello/world'],
          ],
        },
      });

      test.done();
    },

    'arnForObjects accepts multiple arguments and FnConcats them'(test: Test) {

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

      test.deepEqual(stack.resolve(p.toStatementJson()), {
        Action: 's3:GetObject',
        Effect: 'Allow',
        Principal: '*',
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

      test.done();
    },
  },

  'removal policy can be used to specify behavior upon delete'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.UNENCRYPTED,
    });

    expect(stack).toMatch({
      Resources: {
        MyBucketF68F3FF0: {
          Type: 'AWS::S3::Bucket',
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
      },
    });

    test.done();
  },

  'import/export': {

    'static import(ref) allows importing an external/existing bucket'(test: Test) {
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
      test.deepEqual(p.toStatementJson(), {
        Action: 's3:ListBucket',
        Effect: 'Allow',
        Principal: '*',
        Resource: 'arn:aws:s3:::my-bucket',
      });

      test.deepEqual(bucket.bucketArn, bucketArn);
      test.deepEqual(stack.resolve(bucket.bucketName), 'my-bucket');

      test.deepEqual(SynthUtils.synthesize(stack).template, {}, 'the ref is not a real resource');
      test.done();
    },

    'import does not create any resources'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', { bucketArn: 'arn:aws:s3:::my-bucket' });
      bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['*'],
        principals: [new iam.AnyPrincipal()],
      }));

      // at this point we technically didn't create any resources in the consuming stack.
      expect(stack).toMatch({});
      test.done();
    },

    'import can also be used to import arbitrary ARNs'(test: Test) {
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

      expect(stack).toMatch({
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

      test.done();
    },

    'import can explicitly set bucket region'(test: Test) {
      const stack = new cdk.Stack(undefined, undefined, {
        env: { region: 'us-east-1' },
      });

      const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketName: 'myBucket',
        region: 'eu-west-1',
      });

      test.equals(bucket.bucketRegionalDomainName, `myBucket.s3.eu-west-1.${stack.urlSuffix}`);
      test.equals(bucket.bucketWebsiteDomainName, `myBucket.s3-website-eu-west-1.${stack.urlSuffix}`);

      test.done();
    },
  },

  'grantRead'(test: Test) {
    const stack = new cdk.Stack();
    const reader = new iam.User(stack, 'Reader');
    const bucket = new s3.Bucket(stack, 'MyBucket');
    bucket.grantRead(reader);
    expect(stack).toMatch({
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
    test.done();
  },

  'grantReadWrite': {
    'can be used to grant reciprocal permissions to an identity'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');
      bucket.grantReadWrite(user);

      expect(stack).toMatch({
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
                      's3:PutObject*',
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

      test.done();
    },

    'grant permissions to non-identity principal'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });

      // WHEN
      bucket.grantRead(new iam.OrganizationPrincipal('o-1234'));

      // THEN
      expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          'Version': '2012-10-17',
          'Statement': [
            {
              'Action': ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
              'Condition': { 'StringEquals': { 'aws:PrincipalOrgID': 'o-1234' } },
              'Effect': 'Allow',
              'Principal': '*',
              'Resource': [
                { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] }, '/*']] },
              ],
            },
          ],
        },
      }));

      expect(stack).to(haveResource('AWS::KMS::Key', {
        'KeyPolicy': {
          'Statement': [
            {
              'Action': ['kms:Create*', 'kms:Describe*', 'kms:Enable*', 'kms:List*', 'kms:Put*', 'kms:Update*',
                'kms:Revoke*', 'kms:Disable*', 'kms:Get*', 'kms:Delete*', 'kms:ScheduleKeyDeletion', 'kms:CancelKeyDeletion',
                'kms:GenerateDataKey', 'kms:TagResource', 'kms:UntagResource'],
              'Effect': 'Allow',
              'Principal': {
                'AWS': {
                  'Fn::Join': ['', [
                    'arn:', { 'Ref': 'AWS::Partition' }, ':iam::', { 'Ref': 'AWS::AccountId' }, ':root',
                  ]],
                },
              },
              'Resource': '*',
            },
            {
              'Action': ['kms:Decrypt', 'kms:DescribeKey'],
              'Effect': 'Allow',
              'Resource': '*',
              'Principal': '*',
              'Condition': { 'StringEquals': { 'aws:PrincipalOrgID': 'o-1234' } },
            },
          ],
          'Version': '2012-10-17',
        },

      }));

      test.done();
    },

    'if an encryption key is included, encrypt/decrypt permissions are also added both ways'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });
      const user = new iam.User(stack, 'MyUser');
      bucket.grantReadWrite(user);

      expect(stack).toMatch({
        'Resources': {
          'MyBucketKeyC17130CF': {
            'Type': 'AWS::KMS::Key',
            'Properties': {
              'Description': 'Created by Default/MyBucket',
              'KeyPolicy': {
                'Statement': [
                  {
                    'Action': [
                      'kms:Create*',
                      'kms:Describe*',
                      'kms:Enable*',
                      'kms:List*',
                      'kms:Put*',
                      'kms:Update*',
                      'kms:Revoke*',
                      'kms:Disable*',
                      'kms:Get*',
                      'kms:Delete*',
                      'kms:ScheduleKeyDeletion',
                      'kms:CancelKeyDeletion',
                      'kms:GenerateDataKey',
                      'kms:TagResource',
                      'kms:UntagResource',
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
                            ':iam::',
                            {
                              'Ref': 'AWS::AccountId',
                            },
                            ':root',
                          ],
                        ],
                      },
                    },
                    'Resource': '*',
                  },
                  {
                    'Action': [
                      'kms:Decrypt',
                      'kms:DescribeKey',
                      'kms:Encrypt',
                      'kms:ReEncrypt*',
                      'kms:GenerateDataKey*',
                    ],
                    'Effect': 'Allow',
                    'Principal': {
                      'AWS': {
                        'Fn::GetAtt': [
                          'MyUserDC45028B',
                          'Arn',
                        ],
                      },
                    },
                    'Resource': '*',
                  },
                ],
                'Version': '2012-10-17',
              },
            },
            'DeletionPolicy': 'Retain',
            'UpdateReplacePolicy': 'Retain',
          },
          'MyBucketF68F3FF0': {
            'Type': 'AWS::S3::Bucket',
            'DeletionPolicy': 'Retain',
            'UpdateReplacePolicy': 'Retain',
            'Properties': {
              'BucketEncryption': {
                'ServerSideEncryptionConfiguration': [
                  {
                    'ServerSideEncryptionByDefault': {
                      'KMSMasterKeyID': {
                        'Fn::GetAtt': [
                          'MyBucketKeyC17130CF',
                          'Arn',
                        ],
                      },
                      'SSEAlgorithm': 'aws:kms',
                    },
                  },
                ],
              },
            },
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
                      's3:PutObject*',
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
                      'kms:Decrypt',
                      'kms:DescribeKey',
                      'kms:Encrypt',
                      'kms:ReEncrypt*',
                      'kms:GenerateDataKey*',
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
            },
          },
        },
      });

      test.done();
    },

    'does not grant PutObjectAcl when the S3_GRANT_WRITE_WITHOUT_ACL feature is enabled'(test: Test) {
      const app = new cdk.App({
        context: {
          [cxapi.S3_GRANT_WRITE_WITHOUT_ACL]: true,
        },
      });
      const stack = new cdk.Stack(app, 'Stack');
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');

      bucket.grantReadWrite(user);

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
                's3:DeleteObject*',
                's3:PutObject',
                's3:Abort*',
              ],
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

      test.done();
    },
  },

  'grantWrite': {
    'with KMS key has appropriate permissions for multipart uploads'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });
      const user = new iam.User(stack, 'MyUser');
      bucket.grantWrite(user);

      expect(stack).toMatch({
        'Resources': {
          'MyBucketKeyC17130CF': {
            'Type': 'AWS::KMS::Key',
            'Properties': {
              'KeyPolicy': {
                'Statement': [
                  {
                    'Action': [
                      'kms:Create*',
                      'kms:Describe*',
                      'kms:Enable*',
                      'kms:List*',
                      'kms:Put*',
                      'kms:Update*',
                      'kms:Revoke*',
                      'kms:Disable*',
                      'kms:Get*',
                      'kms:Delete*',
                      'kms:ScheduleKeyDeletion',
                      'kms:CancelKeyDeletion',
                      'kms:GenerateDataKey',
                      'kms:TagResource',
                      'kms:UntagResource',
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
                            ':iam::',
                            {
                              'Ref': 'AWS::AccountId',
                            },
                            ':root',
                          ],
                        ],
                      },
                    },
                    'Resource': '*',
                  },
                  {
                    'Action': [
                      'kms:Encrypt',
                      'kms:ReEncrypt*',
                      'kms:GenerateDataKey*',
                      'kms:Decrypt',
                    ],
                    'Effect': 'Allow',
                    'Principal': {
                      'AWS': {
                        'Fn::GetAtt': [
                          'MyUserDC45028B',
                          'Arn',
                        ],
                      },
                    },
                    'Resource': '*',
                  },
                ],
                'Version': '2012-10-17',
              },
              'Description': 'Created by Default/MyBucket',
            },
            'UpdateReplacePolicy': 'Retain',
            'DeletionPolicy': 'Retain',
          },
          'MyBucketF68F3FF0': {
            'Type': 'AWS::S3::Bucket',
            'Properties': {
              'BucketEncryption': {
                'ServerSideEncryptionConfiguration': [
                  {
                    'ServerSideEncryptionByDefault': {
                      'KMSMasterKeyID': {
                        'Fn::GetAtt': [
                          'MyBucketKeyC17130CF',
                          'Arn',
                        ],
                      },
                      'SSEAlgorithm': 'aws:kms',
                    },
                  },
                ],
              },
            },
            'UpdateReplacePolicy': 'Retain',
            'DeletionPolicy': 'Retain',
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
                      's3:DeleteObject*',
                      's3:PutObject*',
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
            },
          },
        },
      });

      test.done();
    },

    'does not grant PutObjectAcl when the S3_GRANT_WRITE_WITHOUT_ACL feature is enabled'(test: Test) {
      const app = new cdk.App({
        context: {
          [cxapi.S3_GRANT_WRITE_WITHOUT_ACL]: true,
        },
      });
      const stack = new cdk.Stack(app, 'Stack');
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');

      bucket.grantWrite(user);

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:DeleteObject*',
                's3:PutObject',
                's3:Abort*',
              ],
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

      test.done();
    },
  },

  'grantPut': {
    'does not grant PutObjectAcl when the S3_GRANT_WRITE_WITHOUT_ACL feature is enabled'(test: Test) {
      const app = new cdk.App({
        context: {
          [cxapi.S3_GRANT_WRITE_WITHOUT_ACL]: true,
        },
      });
      const stack = new cdk.Stack(app, 'Stack');
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const user = new iam.User(stack, 'MyUser');

      bucket.grantPut(user);

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                's3:PutObject',
                's3:Abort*',
              ],
              'Resource': {
                'Fn::Join': ['', [
                  { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
                  '/*',
                ]],
              },
            },
          ],
        },
      }));

      test.done();
    },
  },

  'more grants'(test: Test) {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket', { encryption: s3.BucketEncryption.KMS });
    const putter = new iam.User(stack, 'Putter');
    const writer = new iam.User(stack, 'Writer');
    const deleter = new iam.User(stack, 'Deleter');

    bucket.grantPut(putter);
    bucket.grantWrite(writer);
    bucket.grantDelete(deleter);

    const resources = SynthUtils.synthesize(stack).template.Resources;
    const actions = (id: string) => resources[id].Properties.PolicyDocument.Statement[0].Action;

    test.deepEqual(actions('WriterDefaultPolicyDC585BCE'), ['s3:DeleteObject*', 's3:PutObject*', 's3:Abort*']);
    test.deepEqual(actions('PutterDefaultPolicyAB138DD3'), ['s3:PutObject*', 's3:Abort*']);
    test.deepEqual(actions('DeleterDefaultPolicyCD33B8A0'), 's3:DeleteObject*');
    test.done();
  },

  'grantDelete, with a KMS Key'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'cross-stack permissions': {
    'in the same account and region'(test: Test) {
      const app = new cdk.App();
      const stackA = new cdk.Stack(app, 'stackA');
      const bucketFromStackA = new s3.Bucket(stackA, 'MyBucket');

      const stackB = new cdk.Stack(app, 'stackB');
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      bucketFromStackA.grantRead(user);

      expect(stackA).toMatch({
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

      expect(stackB).toMatch({
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

      test.done();
    },

    'in different accounts'(test: Test) {
      // given
      const stackA = new cdk.Stack(undefined, 'StackA', { env: { account: '123456789012' } });
      const bucketFromStackA = new s3.Bucket(stackA, 'MyBucket', {
        bucketName: 'my-bucket-physical-name',
      });

      const stackB = new cdk.Stack(undefined, 'StackB', { env: { account: '234567890123' } });
      const roleFromStackB = new iam.Role(stackB, 'MyRole', {
        assumedBy: new iam.AccountPrincipal('234567890123'),
        roleName: 'MyRolePhysicalName',
      });

      // when
      bucketFromStackA.grantRead(roleFromStackB);

      // then
      expect(stackA).to(haveResourceLike('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
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
            },
          ],
        },
      }));

      expect(stackB).to(haveResourceLike('AWS::IAM::Policy', {
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
      }));

      test.done();
    },

    'in different accounts, with a KMS Key'(test: Test) {
      // given
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

      // when
      bucketFromStackA.grantRead(roleFromStackB);

      // then
      expect(stackA).to(haveResourceLike('AWS::KMS::Key', {
        'KeyPolicy': {
          'Statement': [
            {
              // grant to the root of the owning account
            },
            {
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
            },
          ],
        },
      }));

      expect(stackB).to(haveResourceLike('AWS::IAM::Policy', {
        'PolicyDocument': {
          'Statement': [
            {
              // Bucket grant
            },
            {
              'Action': [
                'kms:Decrypt',
                'kms:DescribeKey',
              ],
              'Effect': 'Allow',
              'Resource': '*',
            },
          ],
        },
      }));

      test.done();
    },
  },

  'urlForObject returns a token with the S3 URL of the token'(test: Test) {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');

    new cdk.CfnOutput(stack, 'BucketURL', { value: bucket.urlForObject() });
    new cdk.CfnOutput(stack, 'MyFileURL', { value: bucket.urlForObject('my/file.txt') });
    new cdk.CfnOutput(stack, 'YourFileURL', { value: bucket.urlForObject('/your/file.txt') }); // "/" is optional

    expect(stack).toMatch({
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
      },
    });

    test.done();
  },

  's3UrlForObject returns a token with the S3 URL of the token'(test: Test) {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'MyBucket');

    new cdk.CfnOutput(stack, 'BucketS3URL', { value: bucket.s3UrlForObject() });
    new cdk.CfnOutput(stack, 'MyFileS3URL', { value: bucket.s3UrlForObject('my/file.txt') });
    new cdk.CfnOutput(stack, 'YourFileS3URL', { value: bucket.s3UrlForObject('/your/file.txt') }); // "/" is optional

    expect(stack).toMatch({
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

    test.done();
  },

  'grantPublicAccess': {
    'by default, grants s3:GetObject to all objects'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      bucket.grantPublicAccess();

      // THEN
      expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:GetObject',
              'Effect': 'Allow',
              'Principal': '*',
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/*']] },
            },
          ],
          'Version': '2012-10-17',
        },
      }));
      test.done();
    },

    '"keyPrefix" can be used to only grant access to certain objects'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      bucket.grantPublicAccess('only/access/these/*');

      // THEN
      expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:GetObject',
              'Effect': 'Allow',
              'Principal': '*',
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/only/access/these/*']] },
            },
          ],
          'Version': '2012-10-17',
        },
      }));
      test.done();
    },

    '"allowedActions" can be used to specify actions explicitly'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      bucket.grantPublicAccess('*', 's3:GetObject', 's3:PutObject');

      // THEN
      expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': ['s3:GetObject', 's3:PutObject'],
              'Effect': 'Allow',
              'Principal': '*',
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/*']] },
            },
          ],
          'Version': '2012-10-17',
        },
      }));
      test.done();
    },

    'returns the PolicyStatement which can be then customized'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'b');

      // WHEN
      const result = bucket.grantPublicAccess();
      result.resourceStatement!.addCondition('IpAddress', { 'aws:SourceIp': '54.240.143.0/24' });

      // THEN
      expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
        'PolicyDocument': {
          'Statement': [
            {
              'Action': 's3:GetObject',
              'Effect': 'Allow',
              'Principal': '*',
              'Resource': { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['bC3BBCC65', 'Arn'] }, '/*']] },
              'Condition': {
                'IpAddress': { 'aws:SourceIp': '54.240.143.0/24' },
              },
            },
          ],
          'Version': '2012-10-17',
        },
      }));
      test.done();
    },

    'throws when blockPublicPolicy is set to true'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket', {
        blockPublicAccess: new s3.BlockPublicAccess({ blockPublicPolicy: true }),
      });

      // THEN
      test.throws(() => bucket.grantPublicAccess(), /blockPublicPolicy/);

      test.done();
    },
  },

  'website configuration': {
    'only index doc'(test: Test) {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index2.html',
      });
      expect(stack).to(haveResource('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          IndexDocument: 'index2.html',
        },
      }));
      test.done();
    },
    'fails if only error doc is specified'(test: Test) {
      const stack = new cdk.Stack();
      test.throws(() => {
        new s3.Bucket(stack, 'Website', {
          websiteErrorDocument: 'error.html',
        });
      }, /"websiteIndexDocument" is required if "websiteErrorDocument" is set/);
      test.done();
    },
    'error and index docs'(test: Test) {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index2.html',
        websiteErrorDocument: 'error.html',
      });
      expect(stack).to(haveResource('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          IndexDocument: 'index2.html',
          ErrorDocument: 'error.html',
        },
      }));
      test.done();
    },
    'exports the WebsiteURL'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index.html',
      });
      test.deepEqual(stack.resolve(bucket.bucketWebsiteUrl), { 'Fn::GetAtt': ['Website32962D0B', 'WebsiteURL'] });
      test.done();
    },
    'exports the WebsiteDomain'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = new s3.Bucket(stack, 'Website', {
        websiteIndexDocument: 'index.html',
      });
      test.deepEqual(stack.resolve(bucket.bucketWebsiteDomainName), {
        'Fn::Select': [
          2,
          {
            'Fn::Split': ['/', { 'Fn::GetAtt': ['Website32962D0B', 'WebsiteURL'] }],
          },
        ],
      });
      test.done();
    },
    'exports the WebsiteURL for imported buckets'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketName(stack, 'Website', 'my-test-bucket');
      test.deepEqual(stack.resolve(bucket.bucketWebsiteUrl), {
        'Fn::Join': [
          '',
          [
            'http://my-test-bucket.s3-website-',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ],
        ],
      });
      test.deepEqual(stack.resolve(bucket.bucketWebsiteDomainName), {
        'Fn::Join': [
          '',
          [
            'my-test-bucket.s3-website-',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
          ],
        ],
      });
      test.done();
    },
    'exports the WebsiteURL for imported buckets with url'(test: Test) {
      const stack = new cdk.Stack();
      const bucket = s3.Bucket.fromBucketAttributes(stack, 'Website', {
        bucketName: 'my-test-bucket',
        bucketWebsiteUrl: 'http://my-test-bucket.my-test.suffix',
      });
      test.deepEqual(stack.resolve(bucket.bucketWebsiteUrl), 'http://my-test-bucket.my-test.suffix');
      test.deepEqual(stack.resolve(bucket.bucketWebsiteDomainName), 'my-test-bucket.my-test.suffix');
      test.done();
    },
    'adds RedirectAllRequestsTo property'(test: Test) {
      const stack = new cdk.Stack();
      new s3.Bucket(stack, 'Website', {
        websiteRedirect: {
          hostName: 'www.example.com',
          protocol: s3.RedirectProtocol.HTTPS,
        },
      });
      expect(stack).to(haveResource('AWS::S3::Bucket', {
        WebsiteConfiguration: {
          RedirectAllRequestsTo: {
            HostName: 'www.example.com',
            Protocol: 'https',
          },
        },
      }));
      test.done();
    },
    'fails if websiteRedirect and websiteIndex and websiteError are specified'(test: Test) {
      const stack = new cdk.Stack();
      test.throws(() => {
        new s3.Bucket(stack, 'Website', {
          websiteIndexDocument: 'index.html',
          websiteErrorDocument: 'error.html',
          websiteRedirect: {
            hostName: 'www.example.com',
          },
        });
      }, /"websiteIndexDocument", "websiteErrorDocument" and, "websiteRoutingRules" cannot be set if "websiteRedirect" is used/);
      test.done();
    },
    'fails if websiteRedirect and websiteRoutingRules are specified'(test: Test) {
      const stack = new cdk.Stack();
      test.throws(() => {
        new s3.Bucket(stack, 'Website', {
          websiteRoutingRules: [],
          websiteRedirect: {
            hostName: 'www.example.com',
          },
        });
      }, /"websiteIndexDocument", "websiteErrorDocument" and, "websiteRoutingRules" cannot be set if "websiteRedirect" is used/);
      test.done();
    },
    'adds RedirectRules property'(test: Test) {
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
      expect(stack).to(haveResource('AWS::S3::Bucket', {
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
      }));
      test.done();
    },
    'fails if routingRule condition object is empty'(test: Test) {
      const stack = new cdk.Stack();
      test.throws(() => {
        new s3.Bucket(stack, 'Website', {
          websiteRoutingRules: [{
            httpRedirectCode: '303',
            condition: {},
          }],
        });
      }, /The condition property cannot be an empty object/);
      test.done();
    },
    'isWebsite set properly with': {
      'only index doc'(test: Test) {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website', {
          websiteIndexDocument: 'index2.html',
        });
        test.equal(bucket.isWebsite, true);
        test.done();
      },
      'error and index docs'(test: Test) {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website', {
          websiteIndexDocument: 'index2.html',
          websiteErrorDocument: 'error.html',
        });
        test.equal(bucket.isWebsite, true);
        test.done();
      },
      'redirects'(test: Test) {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website', {
          websiteRedirect: {
            hostName: 'www.example.com',
            protocol: s3.RedirectProtocol.HTTPS,
          },
        });
        test.equal(bucket.isWebsite, true);
        test.done();
      },
      'no website properties set'(test: Test) {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Website');
        test.equal(bucket.isWebsite, false);
        test.done();
      },
      'imported website buckets'(test: Test) {
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketAttributes(stack, 'Website', {
          bucketArn: 'arn:aws:s3:::my-bucket',
          isWebsite: true,
        });
        test.equal(bucket.isWebsite, true);
        test.done();
      },
      'imported buckets'(test: Test) {
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketAttributes(stack, 'NotWebsite', {
          bucketArn: 'arn:aws:s3:::my-bucket',
        });
        test.equal(bucket.isWebsite, false);
        test.done();
      },
    },
  },

  'Bucket.fromBucketArn'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = s3.Bucket.fromBucketArn(stack, 'my-bucket', 'arn:aws:s3:::my_corporate_bucket');

    // THEN
    test.deepEqual(bucket.bucketName, 'my_corporate_bucket');
    test.deepEqual(bucket.bucketArn, 'arn:aws:s3:::my_corporate_bucket');
    test.done();
  },

  'Bucket.fromBucketName'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const bucket = s3.Bucket.fromBucketName(stack, 'imported-bucket', 'my-bucket-name');

    // THEN
    test.deepEqual(bucket.bucketName, 'my-bucket-name');
    test.deepEqual(stack.resolve(bucket.bucketArn), {
      'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket-name']],
    });
    test.done();
  },

  'if a kms key is specified, it implies bucket is encrypted with kms (dah)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'k');

    // THEN
    new s3.Bucket(stack, 'b', { encryptionKey: key });
    test.done();
  },

  'Bucket with Server Access Logs'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = new s3.Bucket(stack, 'AccessLogs');
    new s3.Bucket(stack, 'MyBucket', {
      serverAccessLogsBucket: accessLogBucket,
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LoggingConfiguration: {
        DestinationBucketName: {
          Ref: 'AccessLogs8B620ECA',
        },
      },
    }));

    test.done();
  },

  'Bucket with Server Access Logs with Prefix'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = new s3.Bucket(stack, 'AccessLogs');
    new s3.Bucket(stack, 'MyBucket', {
      serverAccessLogsBucket: accessLogBucket,
      serverAccessLogsPrefix: 'hello',
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LoggingConfiguration: {
        DestinationBucketName: {
          Ref: 'AccessLogs8B620ECA',
        },
        LogFilePrefix: 'hello',
      },
    }));

    test.done();
  },

  'Access log prefix given without bucket'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      serverAccessLogsPrefix: 'hello',
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      LoggingConfiguration: {
        LogFilePrefix: 'hello',
      },
    }));
    test.done();
  },

  'Bucket Allow Log delivery changes bucket Access Control should fail'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const accessLogBucket = new s3.Bucket(stack, 'AccessLogs', {
      accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
    });
    test.throws(() =>
      new s3.Bucket(stack, 'MyBucket', {
        serverAccessLogsBucket: accessLogBucket,
        serverAccessLogsPrefix: 'hello',
        accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
      })
    , /Cannot enable log delivery to this bucket because the bucket's ACL has been set and can't be changed/);

    test.done();
  },

  'Defaults for an inventory bucket'(test: Test) {
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

    expect(stack).to(haveResourceLike('AWS::S3::Bucket', {
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
    }));

    expect(stack).to(haveResourceLike('AWS::S3::BucketPolicy', {
      Bucket: { Ref: 'InventoryBucketA869B8CB' },
      PolicyDocument: {
        Statement: arrayWith(objectLike({
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
        })),
      },
    }));

    test.done();
  },

  'Bucket with objectOwnership set to BUCKET_OWNER_PREFERRED'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
    });
    expect(stack).toMatch({
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
    test.done();
  },

  'Bucket with objectOwnership set to OBJECT_WRITER'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
    });
    expect(stack).toMatch({
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
    test.done();
  },

  'Bucket with objectOwnerships set to undefined'(test: Test) {
    const stack = new cdk.Stack();
    new s3.Bucket(stack, 'MyBucket', {
      objectOwnership: undefined,
    });
    expect(stack).toMatch({
      'Resources': {
        'MyBucketF68F3FF0': {
          'Type': 'AWS::S3::Bucket',
          'UpdateReplacePolicy': 'Retain',
          'DeletionPolicy': 'Retain',
        },
      },
    });
    test.done();
  },

  'with autoDeleteObjects'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    expect(stack).to(haveResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'MyBucketF68F3FF0',
      },
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              's3:GetObject*',
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
    }));

    expect(stack).to(haveResource('Custom::S3AutoDeleteObjects', {
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
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'with autoDeleteObjects on multiple buckets'(test: Test) {
    const stack = new cdk.Stack();

    new s3.Bucket(stack, 'Bucket1', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3.Bucket(stack, 'Bucket2', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    expect(stack).to(countResources('AWS::Lambda::Function', 1));

    test.done();
  },

  'autoDeleteObjects throws if RemovalPolicy is not DESTROY'(test: Test) {
    const stack = new cdk.Stack();

    test.throws(() => new s3.Bucket(stack, 'MyBucket', {
      autoDeleteObjects: true,
    }), /Cannot use \'autoDeleteObjects\' property on a bucket without setting removal policy to \'DESTROY\'/);

    test.done();
  },
});
