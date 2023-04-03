"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const s3 = require("../lib");
// to make it easy to copy & paste from output:
/* eslint-disable quote-props */
describe('bucket', () => {
    test('default bucket', () => {
        const stack = new cdk.Stack();
        new s3.Bucket(stack, 'MyBucket');
        assertions_1.Template.fromStack(stack).templateMatches({
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
            assertions_1.Template.fromStack(stack).toJSON();
        }).toThrow(/bucketName: 5 should be a string/);
    });
    test('bucket without encryption', () => {
        const stack = new cdk.Stack();
        new s3.Bucket(stack, 'MyBucket', {
            encryption: s3.BucketEncryption.UNENCRYPTED,
        });
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        ].join(os_1.EOL);
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            'BucketEncryption': {
                'ServerSideEncryptionConfiguration': [
                    {
                        'BucketKeyEnabled': true,
                        'ServerSideEncryptionByDefault': assertions_1.Match.objectLike({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            ObjectLockEnabled: true,
            ObjectLockConfiguration: assertions_1.Match.absent(),
        });
    });
    test('object lock defaults to disabled', () => {
        const stack = new cdk.Stack();
        new s3.Bucket(stack, 'Bucket');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            ObjectLockEnabled: assertions_1.Match.absent(),
        });
    });
    test('object lock defaults to enabled when default retention is specified', () => {
        const stack = new cdk.Stack();
        new s3.Bucket(stack, 'Bucket', {
            objectLockDefaultRetention: s3.ObjectLockRetention.governance(cdk.Duration.days(7 * 365)),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
            assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
            assertions_1.Template.fromStack(stack).templateMatches({});
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
            assertions_1.Template.fromStack(stack).templateMatches({});
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
            assertions_1.Template.fromStack(stack).templateMatches({
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
        (0, cdk_build_tools_1.testDeprecated)('new bucketWebsiteUrl format with explicit bucketWebsiteNewUrlFormat', () => {
            const stack = new cdk.Stack(undefined, undefined, {
                env: { region: 'us-east-1' },
            });
            const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
                bucketName: 'mybucket',
                bucketWebsiteNewUrlFormat: true,
            });
            expect(bucket.bucketWebsiteUrl).toEqual('http://mybucket.s3-website.us-east-1.amazonaws.com');
        });
        (0, cdk_build_tools_1.testDeprecated)('old bucketWebsiteUrl format with explicit bucketWebsiteNewUrlFormat', () => {
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
        let stack;
        let cfnBucket;
        let bucket;
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
            assertions_1.Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 2);
        });
    });
    test('grantRead', () => {
        const stack = new cdk.Stack();
        const reader = new iam.User(stack, 'Reader');
        const bucket = new s3.Bucket(stack, 'MyBucket');
        bucket.grantRead(reader);
        assertions_1.Template.fromStack(stack).templateMatches({
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
            assertions_1.Template.fromStack(stack).templateMatches({
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                'KeyPolicy': {
                    'Statement': assertions_1.Match.arrayWith([
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', assertions_1.Match.objectLike({
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
        test('grant only allowedActionPatterns when specified', () => {
            const stack = new cdk.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');
            const user = new iam.User(stack, 'MyUser');
            bucket.grantWrite(user, '*', ['s3:PutObject', 's3:DeleteObject*']);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Action': [
                                's3:PutObject',
                                's3:DeleteObject*',
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
        const resources = assertions_1.Template.fromStack(stack).toJSON().Resources;
        const actions = (id) => resources[id].Properties.PolicyDocument.Statement[0].Action;
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
            assertions_1.Template.fromStack(stackA).templateMatches({
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
            assertions_1.Template.fromStack(stackB).templateMatches({
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
            assertions_1.Template.fromStack(stackA).hasResourceProperties('AWS::S3::BucketPolicy', {
                'PolicyDocument': {
                    'Statement': [
                        assertions_1.Match.objectLike({
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
            assertions_1.Template.fromStack(stackB).hasResourceProperties('AWS::IAM::Policy', {
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
            assertions_1.Template.fromStack(stackA).hasResourceProperties('AWS::KMS::Key', {
                'KeyPolicy': {
                    'Statement': assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
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
            assertions_1.Template.fromStack(stackB).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
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
            result.resourceStatement.addCondition('IpAddress', { 'aws:SourceIp': '54.240.143.0/24' });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        expect(() => new s3.Bucket(stack, 'MyBucket', {
            serverAccessLogsBucket: accessLogBucket,
            serverAccessLogsPrefix: 'hello',
            accessControl: s3.BucketAccessControl.AUTHENTICATED_READ,
        })).toThrow(/Cannot enable log delivery to this bucket because the bucket's ACL has been set and can't be changed/);
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
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::S3::Bucket', {
            LoggingConfiguration: {
                DestinationBucketName: stack.resolve(accessLogBucket.bucketName),
                LogFilePrefix: 'test/',
            },
        });
        template.allResourcesProperties('AWS::S3::Bucket', {
            AccessControl: assertions_1.Match.absent(),
        });
        assertions_1.Annotations.fromStack(stack).hasWarning('*', assertions_1.Match.stringLikeRegexp('Unable to add necessary logging permissions to imported target bucket'));
    });
    test('Bucket Allow Log delivery should use the recommended policy when flag enabled', () => {
        // GIVEN
        const stack = new cdk.Stack();
        stack.node.setContext('@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy', true);
        // WHEN
        const bucket = new s3.Bucket(stack, 'TestBucket', { serverAccessLogsPrefix: 'test' });
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::S3::Bucket', {
            AccessControl: assertions_1.Match.absent(),
        });
        template.hasResourceProperties('AWS::S3::BucketPolicy', {
            Bucket: stack.resolve(bucket.bucketName),
            PolicyDocument: assertions_1.Match.objectLike({
                Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
            Bucket: stack.resolve(targetBucket.bucketName),
            PolicyDocument: assertions_1.Match.objectLike({
                Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
            Bucket: { Ref: 'InventoryBucketA869B8CB' },
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
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
        assertions_1.Template.fromStack(stack).hasResource('Custom::S3AutoDeleteObjects', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Function', 1);
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).templateMatches({
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
            NotificationConfiguration: {
                EventBridgeConfiguration: {},
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWNrZXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUF5QjtBQUN6QixvREFBbUU7QUFDbkUsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLDZCQUE2QjtBQUU3QiwrQ0FBK0M7QUFDL0MsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsV0FBVyxFQUFFO2dCQUNYLGtCQUFrQixFQUFFO29CQUNsQixNQUFNLEVBQUUsaUJBQWlCO29CQUN6QixnQkFBZ0IsRUFBRSxRQUFRO29CQUMxQixxQkFBcUIsRUFBRSxRQUFRO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQy9CLFVBQVUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRO1NBQzVDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFN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QzFCLHFCQUFxQixFQUFFLFFBQVE7aUJBQ2hDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzRUFBc0UsRUFBRSxHQUFHLEVBQUU7UUFDaEYsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztRQUV2QyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywrQkFBK0IsRUFBRTtZQUMvRSx5QkFBeUIsRUFBRTtnQkFDekIsd0JBQXdCLEVBQUUsRUFBRTthQUM3QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFT0wgfSBmcm9tICdvcyc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICcuLi9saWInO1xuXG4vLyB0byBtYWtlIGl0IGVhc3kgdG8gY29weSAmIHBhc3RlIGZyb20gb3V0cHV0OlxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ2J1Y2tldCcsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBidWNrZXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NGTiBwcm9wZXJ0aWVzIGFyZSB0eXBlLXZhbGlkYXRlZCBkdXJpbmcgcmVzb2x1dGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBjZGsuVG9rZW4uYXNTdHJpbmcoNSksIC8vIE9oIG5vXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50b0pTT04oKTtcbiAgICB9KS50b1Rocm93KC9idWNrZXROYW1lOiA1IHNob3VsZCBiZSBhIHN0cmluZy8pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aG91dCBlbmNyeXB0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBtYW5hZ2VkIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQnVja2V0RW5jcnlwdGlvbic6IHtcbiAgICAgICAgICAgICAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbic6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnU2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQnOiB7XG4gICAgICAgICAgICAgICAgICAgICdTU0VBbGdvcml0aG0nOiAnYXdzOmttcycsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkIGJ1Y2tldCBuYW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQxJywge1xuICAgICAgYnVja2V0TmFtZTogJ2FiYy54eXotMzRhYicsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MicsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICcxMjQucHAtLTMzJyxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHZhbGlkYXRpb24gc2tpcHMgdG9rZW5pemVkIHZhbHVlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnX0JVQ0tFVCcgfSksXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdpdGggbWVzc2FnZSBvbiBpbnZhbGlkIGJ1Y2tldCBuYW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBgLWJ1Y2tFdC4tJHtuZXcgQXJyYXkoNjUpLmpvaW4oJyQnKX1gO1xuICAgIGNvbnN0IGV4cGVjdGVkRXJyb3JzID0gW1xuICAgICAgYEludmFsaWQgUzMgYnVja2V0IG5hbWUgKHZhbHVlOiAke2J1Y2tldH0pYCxcbiAgICAgICdCdWNrZXQgbmFtZSBtdXN0IGJlIGF0IGxlYXN0IDMgYW5kIG5vIG1vcmUgdGhhbiA2MyBjaGFyYWN0ZXJzJyxcbiAgICAgICdCdWNrZXQgbmFtZSBtdXN0IG9ubHkgY29udGFpbiBsb3dlcmNhc2UgY2hhcmFjdGVycyBhbmQgdGhlIHN5bWJvbHMsIHBlcmlvZCAoLikgYW5kIGRhc2ggKC0pIChvZmZzZXQ6IDUpJyxcbiAgICAgICdCdWNrZXQgbmFtZSBtdXN0IHN0YXJ0IGFuZCBlbmQgd2l0aCBhIGxvd2VyY2FzZSBjaGFyYWN0ZXIgb3IgbnVtYmVyIChvZmZzZXQ6IDApJyxcbiAgICAgIGBCdWNrZXQgbmFtZSBtdXN0IHN0YXJ0IGFuZCBlbmQgd2l0aCBhIGxvd2VyY2FzZSBjaGFyYWN0ZXIgb3IgbnVtYmVyIChvZmZzZXQ6ICR7YnVja2V0Lmxlbmd0aCAtIDF9KWAsXG4gICAgICAnQnVja2V0IG5hbWUgbXVzdCBub3QgaGF2ZSBkYXNoIG5leHQgdG8gcGVyaW9kLCBvciBwZXJpb2QgbmV4dCB0byBkYXNoLCBvciBjb25zZWN1dGl2ZSBwZXJpb2RzIChvZmZzZXQ6IDcpJyxcbiAgICBdLmpvaW4oRU9MKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiBidWNrZXQsXG4gICAgfSkpLnRvVGhyb3coZXhwZWN0ZWRFcnJvcnMpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBidWNrZXQgbmFtZSBoYXMgbGVzcyB0aGFuIDMgb3IgbW9yZSB0aGFuIDYzIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdhJyxcbiAgICB9KSkudG9UaHJvdygvYXQgbGVhc3QgMy8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDInLCB7XG4gICAgICBidWNrZXROYW1lOiBuZXcgQXJyYXkoNjUpLmpvaW4oJ3gnKSxcbiAgICB9KSkudG9UaHJvdygvbm8gbW9yZSB0aGFuIDYzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGJ1Y2tldCBuYW1lIGhhcyBpbnZhbGlkIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdiQGNrZXQnLFxuICAgIH0pKS50b1Rocm93KC9vZmZzZXQ6IDEvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQyJywge1xuICAgICAgYnVja2V0TmFtZTogJ2J1Y0tldCcsXG4gICAgfSkpLnRvVGhyb3coL29mZnNldDogMy8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDMnLCB7XG4gICAgICBidWNrZXROYW1lOiAnYnXEjWtldCcsXG4gICAgfSkpLnRvVGhyb3coL29mZnNldDogMi8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBidWNrZXQgbmFtZSBkb2VzIG5vdCBzdGFydCBvciBlbmQgd2l0aCBsb3dlcmNhc2UgY2hhcmFjdGVyIG9yIG51bWJlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQxJywge1xuICAgICAgYnVja2V0TmFtZTogJy11Y2tldCcsXG4gICAgfSkpLnRvVGhyb3coL29mZnNldDogMC8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDInLCB7XG4gICAgICBidWNrZXROYW1lOiAnYnVja2UuJyxcbiAgICB9KSkudG9UaHJvdygvb2Zmc2V0OiA1Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIG9ubHkgaWYgYnVja2V0IG5hbWUgaGFzIHRoZSBjb25zZWN1dGl2ZSBzeW1ib2xzICguLiksICguLSksICgtLiknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdidWMuLmtldCcsXG4gICAgfSkpLnRvVGhyb3coL29mZnNldDogMy8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDInLCB7XG4gICAgICBidWNrZXROYW1lOiAnYnVjay4tZXQnLFxuICAgIH0pKS50b1Rocm93KC9vZmZzZXQ6IDQvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQzJywge1xuICAgICAgYnVja2V0TmFtZTogJ2ItLnVja2V0JyxcbiAgICB9KSkudG9UaHJvdygvb2Zmc2V0OiAxLyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0NCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdidS0tY2tldCcsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIG9ubHkgaWYgYnVja2V0IG5hbWUgcmVzZW1ibGVzIElQIGFkZHJlc3MnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICcxLjIuMy40JyxcbiAgICB9KSkudG9UaHJvdygvbXVzdCBub3QgcmVzZW1ibGUgYW4gSVAgYWRkcmVzcy8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDInLCB7XG4gICAgICBidWNrZXROYW1lOiAnMS4yLjMnLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDMnLCB7XG4gICAgICBidWNrZXROYW1lOiAnMS4yLjMuYScsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0NCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICcxMDAwLjIuMy40JyxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgZW5jcnlwdGlvbiBrZXkgaXMgdXNlZCB3aXRoIG1hbmFnZWQgZW5jcnlwdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBteUtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNU19NQU5BR0VELFxuICAgICAgZW5jcnlwdGlvbktleTogbXlLZXksXG4gICAgfSkpLnRvVGhyb3coL2VuY3J5cHRpb25LZXkgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGVuY3J5cHRpb24ga2V5IGlzIHVzZWQgd2l0aCBlbmNyeXB0aW9uIHNldCB0byB1bmVuY3J5cHRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBteUtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVELFxuICAgICAgZW5jcnlwdGlvbktleTogbXlLZXksXG4gICAgfSkpLnRvVGhyb3coL2VuY3J5cHRpb25LZXkgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VuY3J5cHRpb25LZXkgY2FuIHNwZWNpZnkga21zIGtleScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGVuY3J5cHRpb25LZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5JywgeyBkZXNjcmlwdGlvbjogJ2hlbGxvLCB3b3JsZCcgfSk7XG5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb25LZXksIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6S01TOjpLZXknLCAxKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAnQnVja2V0RW5jcnlwdGlvbic6IHtcbiAgICAgICAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbic6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnU2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQnOiB7XG4gICAgICAgICAgICAgICdLTVNNYXN0ZXJLZXlJRCc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeUtleTZBQjI5RkE2JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdTU0VBbGdvcml0aG0nOiAnYXdzOmttcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbmZvcmNlU3NsIGNhbiBiZSBlbmFibGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5mb3JjZVNTTDogdHJ1ZSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ015QnVja2V0UG9saWN5RTdGQkFDN0InOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0UG9saWN5JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdCdWNrZXQnOiB7XG4gICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnczM6KicsXG4gICAgICAgICAgICAgICAgICAnQ29uZGl0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAnQm9vbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnYXdzOlNlY3VyZVRyYW5zcG9ydCc6ICdmYWxzZScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdEZW55JyxcbiAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW3MzLkJ1Y2tldEVuY3J5cHRpb24uS01TLCBzMy5CdWNrZXRFbmNyeXB0aW9uLktNU19NQU5BR0VEXSkoJ2J1Y2tldEtleUVuYWJsZWQgY2FuIGJlIGVuYWJsZWQgd2l0aCAlcCBlbmNyeXB0aW9uJywgKGVuY3J5cHRpb24pID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgYnVja2V0S2V5RW5hYmxlZDogdHJ1ZSwgZW5jcnlwdGlvbiB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAnQnVja2V0RW5jcnlwdGlvbic6IHtcbiAgICAgICAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbic6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQnVja2V0S2V5RW5hYmxlZCc6IHRydWUsXG4gICAgICAgICAgICAnU2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQnOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgJ1NTRUFsZ29yaXRobSc6ICdhd3M6a21zJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgZXJyb3IgaWYgYnVja2V0S2V5RW5hYmxlZCBpcyBzZXQsIGJ1dCBlbmNyeXB0aW9uIGlzIG5vdCBLTVMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBidWNrZXRLZXlFbmFibGVkOiB0cnVlLCBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQgfSk7XG4gICAgfSkudG9UaHJvdyhcImJ1Y2tldEtleUVuYWJsZWQgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TICh2YWx1ZTogUzNfTUFOQUdFRClcIik7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDMnLCB7IGJ1Y2tldEtleUVuYWJsZWQ6IHRydWUgfSk7XG4gICAgfSkudG9UaHJvdyhcImJ1Y2tldEtleUVuYWJsZWQgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TICh2YWx1ZTogVU5FTkNSWVBURUQpXCIpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgdG8gc2VsZiwgbm8gZW5jcnlwdGlvbiBkb2VzIG5vdCB0aHJvdyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVELCBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAndGVzdCcgfSk7XG4gICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlbGYsIFMzIGVuY3J5cHRpb24gZG9lcyBub3QgdGhyb3cgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VELCBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAndGVzdCcgfSk7XG4gICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlbGYsIEtNU19NQU5BR0VEIGVuY3J5cHRpb24gdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRUQsIHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg6ICd0ZXN0JyB9KTtcbiAgICB9KS50b1Rocm93KC9TU0UtUzMgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIGRlZmF1bHQgYnVja2V0IGVuY3J5cHRpb24gZm9yIFNlcnZlciBBY2Nlc3MgTG9nZ2luZyB0YXJnZXQgYnVja2V0cy8pO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlbGYsIEtNUyBlbmNyeXB0aW9uIHdpdGhvdXQga2V5IHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUywgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ3Rlc3QnIH0pO1xuICAgIH0pLnRvVGhyb3coL1NTRS1TMyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgZGVmYXVsdCBidWNrZXQgZW5jcnlwdGlvbiBmb3IgU2VydmVyIEFjY2VzcyBMb2dnaW5nIHRhcmdldCBidWNrZXRzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgdG8gc2VsZiwgS01TIGVuY3J5cHRpb24gd2l0aCBrZXkgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnVGVzdEtleScpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb25LZXk6IGtleSwgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMsIHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg6ICd0ZXN0JyB9KTtcbiAgICB9KS50b1Rocm93KC9TU0UtUzMgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIGRlZmF1bHQgYnVja2V0IGVuY3J5cHRpb24gZm9yIFNlcnZlciBBY2Nlc3MgTG9nZ2luZyB0YXJnZXQgYnVja2V0cy8pO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlbGYsIEtNUyBrZXkgd2l0aCBubyBzcGVjaWZpYyBlbmNyeXB0aW9uIHNwZWNpZmllZCB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdUZXN0S2V5Jyk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbktleToga2V5LCBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAndGVzdCcgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZXBhcmF0ZSBidWNrZXQsIG5vIGVuY3J5cHRpb24gZG9lcyBub3QgdGhyb3cgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbG9nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ3Rlc3RMb2dCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogbG9nQnVja2V0IH0pO1xuICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZXBhcmF0ZSBidWNrZXQsIFMzIGVuY3J5cHRpb24gZG9lcyBub3QgdGhyb3cgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbG9nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ3Rlc3RMb2dCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBsb2dCdWNrZXQgfSk7XG4gICAgfSkubm90LnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICAvLyBXaGVuIHByb3ZpZGVkIGFuIGV4dGVybmFsIGJ1Y2tldCAoYXMgYW4gSUJ1Y2tldCksIHdlIGNhbm5vdCBkZXRlY3QgS01TX01BTkFHRUQgZW5jcnlwdGlvbi4gU2luY2UgdGhpc1xuICAvLyBjaGVjayBpcyBpbXBvc3NpYmxlLCB3ZSBza2lwIHRoaXN0IHRlc3QuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqZXN0L25vLWRpc2FibGVkLXRlc3RzXG4gIHRlc3Quc2tpcCgnbG9ncyB0byBzZXBhcmF0ZSBidWNrZXQsIEtNU19NQU5BR0VEIGVuY3J5cHRpb24gdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGxvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICd0ZXN0TG9nQnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNU19NQU5BR0VEIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ6IGxvZ0J1Y2tldCB9KTtcbiAgICB9KS50b1Rocm93KC9TU0UtUzMgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIGRlZmF1bHQgYnVja2V0IGVuY3J5cHRpb24gZm9yIFNlcnZlciBBY2Nlc3MgTG9nZ2luZyB0YXJnZXQgYnVja2V0cy8pO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlcGFyYXRlIGJ1Y2tldCwgS01TIGVuY3J5cHRpb24gd2l0aG91dCBrZXkgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGxvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICd0ZXN0TG9nQnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBsb2dCdWNrZXQgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZXBhcmF0ZSBidWNrZXQsIEtNUyBlbmNyeXB0aW9uIHdpdGgga2V5IHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ1Rlc3RLZXknKTtcbiAgICBjb25zdCBsb2dCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAndGVzdExvZ0J1Y2tldCcsIHsgZW5jcnlwdGlvbktleToga2V5LCBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBsb2dCdWNrZXQgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZXBhcmF0ZSBidWNrZXQsIEtNUyBrZXkgd2l0aCBubyBzcGVjaWZpYyBlbmNyeXB0aW9uIHNwZWNpZmllZCB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdUZXN0S2V5Jyk7XG4gICAgY29uc3QgbG9nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ3Rlc3RMb2dCdWNrZXQnLCB7IGVuY3J5cHRpb25LZXk6IGtleSB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBsb2dCdWNrZXQgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggdmVyc2lvbmluZyB0dXJuZWQgb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgdmVyc2lvbmVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdWZXJzaW9uaW5nQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgJ1N0YXR1cyc6ICdFbmFibGVkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggb2JqZWN0IGxvY2sgZW5hYmxlZCBidXQgbm8gcmV0ZW50aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBvYmplY3RMb2NrRW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgICBPYmplY3RMb2NrQ29uZmlndXJhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29iamVjdCBsb2NrIGRlZmF1bHRzIHRvIGRpc2FibGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdvYmplY3QgbG9jayBkZWZhdWx0cyB0byBlbmFibGVkIHdoZW4gZGVmYXVsdCByZXRlbnRpb24gaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBvYmplY3RMb2NrRGVmYXVsdFJldGVudGlvbjogczMuT2JqZWN0TG9ja1JldGVudGlvbi5nb3Zlcm5hbmNlKGNkay5EdXJhdGlvbi5kYXlzKDcgKiAzNjUpKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgICBPYmplY3RMb2NrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBPYmplY3RMb2NrRW5hYmxlZDogJ0VuYWJsZWQnLFxuICAgICAgICBSdWxlOiB7XG4gICAgICAgICAgRGVmYXVsdFJldGVudGlvbjoge1xuICAgICAgICAgICAgTW9kZTogJ0dPVkVSTkFOQ0UnLFxuICAgICAgICAgICAgRGF5czogNyAqIDM2NSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggb2JqZWN0IGxvY2sgZW5hYmxlZCB3aXRoIGdvdmVybmFuY2UgcmV0ZW50aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBvYmplY3RMb2NrRW5hYmxlZDogdHJ1ZSxcbiAgICAgIG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uOiBzMy5PYmplY3RMb2NrUmV0ZW50aW9uLmdvdmVybmFuY2UoY2RrLkR1cmF0aW9uLmRheXMoMSkpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgT2JqZWN0TG9ja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6ICdFbmFibGVkJyxcbiAgICAgICAgUnVsZToge1xuICAgICAgICAgIERlZmF1bHRSZXRlbnRpb246IHtcbiAgICAgICAgICAgIE1vZGU6ICdHT1ZFUk5BTkNFJyxcbiAgICAgICAgICAgIERheXM6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIG9iamVjdCBsb2NrIGVuYWJsZWQgd2l0aCBjb21wbGlhbmNlIHJldGVudGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgb2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgICBvYmplY3RMb2NrRGVmYXVsdFJldGVudGlvbjogczMuT2JqZWN0TG9ja1JldGVudGlvbi5jb21wbGlhbmNlKGNkay5EdXJhdGlvbi5kYXlzKDEpKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgICBPYmplY3RMb2NrQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBPYmplY3RMb2NrRW5hYmxlZDogJ0VuYWJsZWQnLFxuICAgICAgICBSdWxlOiB7XG4gICAgICAgICAgRGVmYXVsdFJldGVudGlvbjoge1xuICAgICAgICAgICAgTW9kZTogJ0NPTVBMSUFOQ0UnLFxuICAgICAgICAgICAgRGF5czogMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggb2JqZWN0IGxvY2sgZGlzYWJsZWQgdGhyb3dzIGVycm9yIHdpdGggcmV0ZW50aW9uIHNldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgIG9iamVjdExvY2tFbmFibGVkOiBmYWxzZSxcbiAgICAgIG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uOiBzMy5PYmplY3RMb2NrUmV0ZW50aW9uLmdvdmVybmFuY2UoY2RrLkR1cmF0aW9uLmRheXMoMSkpLFxuICAgIH0pKS50b1Rocm93KCdPYmplY3QgTG9jayBtdXN0IGJlIGVuYWJsZWQgdG8gY29uZmlndXJlIGRlZmF1bHQgcmV0ZW50aW9uIHNldHRpbmdzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIG9iamVjdCBsb2NrIHJlcXVpcmVzIGR1cmF0aW9uIHRoYW4gb25lIGRheScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgIG9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb246IHMzLk9iamVjdExvY2tSZXRlbnRpb24uZ292ZXJuYW5jZShjZGsuRHVyYXRpb24uZGF5cygwKSksXG4gICAgfSkpLnRvVGhyb3coJ09iamVjdCBMb2NrIHJldGVudGlvbiBkdXJhdGlvbiBtdXN0IGJlIGF0IGxlYXN0IDEgZGF5Jyk7XG4gIH0pO1xuXG4gIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25TMy9sYXRlc3QvdXNlcmd1aWRlL29iamVjdC1sb2NrLW1hbmFnaW5nLmh0bWwjb2JqZWN0LWxvY2stbWFuYWdpbmctcmV0ZW50aW9uLWxpbWl0c1xuICB0ZXN0KCdidWNrZXQgd2l0aCBvYmplY3QgbG9jayByZXF1aXJlcyBkdXJhdGlvbiBsZXNzIHRoYW4gMTAwIHllYXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgb2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgICBvYmplY3RMb2NrRGVmYXVsdFJldGVudGlvbjogczMuT2JqZWN0TG9ja1JldGVudGlvbi5nb3Zlcm5hbmNlKGNkay5EdXJhdGlvbi5kYXlzKDM2NSAqIDEwMSkpLFxuICAgIH0pKS50b1Rocm93KCdPYmplY3QgTG9jayByZXRlbnRpb24gZHVyYXRpb24gbXVzdCBiZSBsZXNzIHRoYW4gMTAwIHllYXJzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIGJsb2NrIHB1YmxpYyBhY2Nlc3Mgc2V0IHRvIEJsb2NrQWxsJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1B1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgJ0Jsb2NrUHVibGljQWNscyc6IHRydWUsXG4gICAgICAgICAgICAgICdCbG9ja1B1YmxpY1BvbGljeSc6IHRydWUsXG4gICAgICAgICAgICAgICdJZ25vcmVQdWJsaWNBY2xzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ1Jlc3RyaWN0UHVibGljQnVja2V0cyc6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIGJsb2NrIHB1YmxpYyBhY2Nlc3Mgc2V0IHRvIEJsb2NrQWNscycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUNMUyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUHVibGljQWNjZXNzQmxvY2tDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAnQmxvY2tQdWJsaWNBY2xzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ0lnbm9yZVB1YmxpY0FjbHMnOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBjdXN0b20gYmxvY2sgcHVibGljIGFjY2VzcyBzZXR0aW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBuZXcgczMuQmxvY2tQdWJsaWNBY2Nlc3MoeyByZXN0cmljdFB1YmxpY0J1Y2tldHM6IHRydWUgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1B1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgJ1Jlc3RyaWN0UHVibGljQnVja2V0cyc6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIGN1c3RvbSBjYW5uZWQgYWNjZXNzIGNvbnRyb2wnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYWNjZXNzQ29udHJvbDogczMuQnVja2V0QWNjZXNzQ29udHJvbC5MT0dfREVMSVZFUllfV1JJVEUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0FjY2Vzc0NvbnRyb2wnOiAnTG9nRGVsaXZlcnlXcml0ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Blcm1pc3Npb25zJywgKCkgPT4ge1xuXG4gICAgdGVzdCgnYWRkUGVybWlzc2lvbiBjcmVhdGVzIGEgYnVja2V0IHBvbGljeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEIH0pO1xuXG4gICAgICBidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogWydmb28nXSxcbiAgICAgICAgYWN0aW9uczogWydiYXI6YmF6J10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgIH0pKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdNeUJ1Y2tldFBvbGljeUU3RkJBQzdCJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0UG9saWN5JyxcbiAgICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgICAnQnVja2V0Jzoge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ2JhcjpiYXonLFxuICAgICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJ2ZvbycsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZvckJ1Y2tldCByZXR1cm5zIGEgcGVybWlzc2lvbiBzdGF0ZW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSBidWNrZXRcXCdzIEFSTicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQgfSk7XG5cbiAgICAgIGNvbnN0IHggPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogW2J1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHgudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgICAgQWN0aW9uOiAnczM6TGlzdEJ1Y2tldCcsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0sXG4gICAgICAgIFJlc291cmNlOiB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FybkZvck9iamVjdHMgcmV0dXJucyBhIHBlcm1pc3Npb24gc3RhdGVtZW50IGFzc29jaWF0ZWQgd2l0aCBvYmplY3RzIGluIHRoZSBidWNrZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEIH0pO1xuXG4gICAgICBjb25zdCBwID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFtidWNrZXQuYXJuRm9yT2JqZWN0cygnaGVsbG8vd29ybGQnKV0sXG4gICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICAgIEFjdGlvbjogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0sXG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LCAnL2hlbGxvL3dvcmxkJ10sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXJuRm9yT2JqZWN0cyBhY2NlcHRzIG11bHRpcGxlIGFyZ3VtZW50cyBhbmQgRm5Db25jYXRzIHRoZW0nLCAoKSA9PiB7XG5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQgfSk7XG5cbiAgICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICAgIGNvbnN0IHRlYW0gPSBuZXcgaWFtLkdyb3VwKHN0YWNrLCAnTXlUZWFtJyk7XG5cbiAgICAgIGNvbnN0IHJlc291cmNlID0gYnVja2V0LmFybkZvck9iamVjdHMoYGhvbWUvJHt0ZWFtLmdyb3VwTmFtZX0vJHt1c2VyLnVzZXJOYW1lfS8qYCk7XG4gICAgICBjb25zdCBwID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFtyZXNvdXJjZV0sXG4gICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICAgIEFjdGlvbjogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0sXG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgJy9ob21lLycsXG4gICAgICAgICAgICAgIHsgUmVmOiAnTXlUZWFtMDFERDY2ODUnIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdNeVVzZXJEQzQ1MDI4QicgfSxcbiAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZW1vdmFsIHBvbGljeSBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGJlaGF2aW9yIHVwb24gZGVsZXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlCdWNrZXRGNjhGM0ZGMDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbXBvcnQvZXhwb3J0JywgKCkgPT4ge1xuICAgIHRlc3QoJ3N0YXRpYyBpbXBvcnQocmVmKSBhbGxvd3MgaW1wb3J0aW5nIGFuIGV4dGVybmFsL2V4aXN0aW5nIGJ1Y2tldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCBidWNrZXRBcm4gPSAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldCc7XG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHsgYnVja2V0QXJuIH0pO1xuXG4gICAgICAvLyB0aGlzIGlzIGEgbm8tb3Agc2luY2UgdGhlIGJ1Y2tldCBpcyBleHRlcm5hbFxuICAgICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnZm9vJ10sXG4gICAgICAgIGFjdGlvbnM6IFsnYmFyOmJheiddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IHAgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogW2J1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIGl0IGlzIHBvc3NpYmxlIHRvIG9idGFpbiBhIHBlcm1pc3Npb24gc3RhdGVtZW50IGZvciBhIHJlZlxuICAgICAgZXhwZWN0KHAudG9TdGF0ZW1lbnRKc29uKCkpLnRvRXF1YWwoe1xuICAgICAgICBBY3Rpb246ICdzMzpMaXN0QnVja2V0JyxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOnMzOjo6bXktYnVja2V0JyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmJ1Y2tldEFybikudG9FcXVhbChidWNrZXRBcm4pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldE5hbWUpKS50b0VxdWFsKCdteS1idWNrZXQnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe30pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0IGRvZXMgbm90IGNyZWF0ZSBhbnkgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHsgYnVja2V0QXJuOiAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldCcgfSk7XG4gICAgICBidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIGF0IHRoaXMgcG9pbnQgd2UgdGVjaG5pY2FsbHkgZGlkbid0IGNyZWF0ZSBhbnkgcmVzb3VyY2VzIGluIHRoZSBjb25zdW1pbmcgc3RhY2suXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7fSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbXBvcnQgY2FuIGFsc28gYmUgdXNlZCB0byBpbXBvcnQgYXJiaXRyYXJ5IEFSTnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQnVja2V0JywgeyBidWNrZXRBcm46ICdhcm46YXdzOnMzOjo6bXktYnVja2V0JyB9KTtcbiAgICAgIGJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWycqJ10gfSkpO1xuXG4gICAgICAvLyBidXQgbm93IHdlIGNhbiByZWZlcmVuY2UgdGhlIGJ1Y2tldFxuICAgICAgLy8geW91IGNhbiBldmVuIHVzZSB0aGUgYnVja2V0IG5hbWUsIHdoaWNoIHdpbGwgYmUgZXh0cmFjdGVkIGZyb20gdGhlIGFybiBwcm92aWRlZC5cbiAgICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICAgIHVzZXIuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFtidWNrZXQuYXJuRm9yT2JqZWN0cyhgbXkvZm9sZGVyLyR7YnVja2V0LmJ1Y2tldE5hbWV9YCldLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOionXSxcbiAgICAgIH0pKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICdNeVVzZXJEQzQ1MDI4Qic6IHtcbiAgICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjYnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzoqJyxcbiAgICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6ICdhcm46YXdzOnMzOjo6bXktYnVja2V0L215L2ZvbGRlci9teS1idWNrZXQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUG9saWN5TmFtZSc6ICdNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjYnLFxuICAgICAgICAgICAgICAnVXNlcnMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVVzZXJEQzQ1MDI4QicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0IGNhbiBleHBsaWNpdGx5IHNldCBidWNrZXQgcmVnaW9uIHdpdGggZGlmZmVyZW50IHN1ZmZpeCB0aGFuIHN0YWNrJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGVudjogeyByZWdpb246ICdjbi1ub3J0aC0xJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQnVja2V0Jywge1xuICAgICAgICBidWNrZXROYW1lOiAnbXlidWNrZXQnLFxuICAgICAgICByZWdpb246ICdldS13ZXN0LTEnLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChidWNrZXQuYnVja2V0UmVnaW9uYWxEb21haW5OYW1lKS50b0VxdWFsKCdteWJ1Y2tldC5zMy5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbScpO1xuICAgICAgZXhwZWN0KGJ1Y2tldC5idWNrZXRXZWJzaXRlRG9tYWluTmFtZSkudG9FcXVhbCgnbXlidWNrZXQuczMtd2Vic2l0ZS1ldS13ZXN0LTEuYW1hem9uYXdzLmNvbScpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbmV3IGJ1Y2tldFdlYnNpdGVVcmwgZm9ybWF0IGZvciBzcGVjaWZpYyByZWdpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMicgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215YnVja2V0JyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmJ1Y2tldFdlYnNpdGVVcmwpLnRvRXF1YWwoJ2h0dHA6Ly9teWJ1Y2tldC5zMy13ZWJzaXRlLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduZXcgYnVja2V0V2Vic2l0ZVVybCBmb3JtYXQgZm9yIHNwZWNpZmljIHJlZ2lvbiB3aXRoIGNuIHN1ZmZpeCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgcmVnaW9uOiAnY24tbm9ydGgtMScgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215YnVja2V0JyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmJ1Y2tldFdlYnNpdGVVcmwpLnRvRXF1YWwoJ2h0dHA6Ly9teWJ1Y2tldC5zMy13ZWJzaXRlLmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbicpO1xuICAgIH0pO1xuXG5cbiAgICB0ZXN0RGVwcmVjYXRlZCgnbmV3IGJ1Y2tldFdlYnNpdGVVcmwgZm9ybWF0IHdpdGggZXhwbGljaXQgYnVja2V0V2Vic2l0ZU5ld1VybEZvcm1hdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQnVja2V0Jywge1xuICAgICAgICBidWNrZXROYW1lOiAnbXlidWNrZXQnLFxuICAgICAgICBidWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0OiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChidWNrZXQuYnVja2V0V2Vic2l0ZVVybCkudG9FcXVhbCgnaHR0cDovL215YnVja2V0LnMzLXdlYnNpdGUudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20nKTtcbiAgICB9KTtcblxuICAgIHRlc3REZXByZWNhdGVkKCdvbGQgYnVja2V0V2Vic2l0ZVVybCBmb3JtYXQgd2l0aCBleHBsaWNpdCBidWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGVudjogeyByZWdpb246ICd1cy1lYXN0LTInIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteWJ1Y2tldCcsXG4gICAgICAgIGJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXQ6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChidWNrZXQuYnVja2V0V2Vic2l0ZVVybCkudG9FcXVhbCgnaHR0cDovL215YnVja2V0LnMzLXdlYnNpdGUtdXMtZWFzdC0yLmFtYXpvbmF3cy5jb20nKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ltcG9ydCBuZWVkcyB0byBzcGVjaWZ5IGEgdmFsaWQgYnVja2V0IG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnTXlCdWNrZXQzJywge1xuICAgICAgICBidWNrZXROYW1lOiAnYXJuOmF3czpzMzo6OmV4YW1wbGUtY29tJyxcbiAgICAgIH0pKS50b1Rocm93KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmcm9tQ2ZuQnVja2V0KCknLCAoKSA9PiB7XG4gICAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG4gICAgbGV0IGNmbkJ1Y2tldDogczMuQ2ZuQnVja2V0O1xuICAgIGxldCBidWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY2ZuQnVja2V0ID0gbmV3IHMzLkNmbkJ1Y2tldChzdGFjaywgJ0NmbkJ1Y2tldCcpO1xuICAgICAgYnVja2V0ID0gczMuQnVja2V0LmZyb21DZm5CdWNrZXQoY2ZuQnVja2V0KTtcbiAgICB9KTtcblxuICAgIHRlc3QoXCJjb3JyZWN0bHkgcmVzb2x2ZXMgdGhlICdidWNrZXROYW1lJyBwcm9wZXJ0eVwiLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0TmFtZSkpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgICBSZWY6ICdDZm5CdWNrZXQnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwiY29ycmVjdGx5IHJlc29sdmVzIHRoZSAnYnVja2V0QXJuJyBwcm9wZXJ0eVwiLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0QXJuKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydDZm5CdWNrZXQnLCAnQXJuJ10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBzZXR0aW5nIHRoZSBSZW1vdmFsUG9saWN5IG9mIHRoZSB1bmRlcmx5aW5nIHJlc291cmNlJywgKCkgPT4ge1xuICAgICAgYnVja2V0LmFwcGx5UmVtb3ZhbFBvbGljeShjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBzZXRzIHRoZSBkZWZhdWx0IGNoaWxkIG9mIHRoZSByZXR1cm5lZCBMMicsICgpID0+IHtcbiAgICAgIGV4cGVjdChidWNrZXQubm9kZS5kZWZhdWx0Q2hpbGQpLnRvQmUoY2ZuQnVja2V0KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBncmFudGluZyBwZXJtaXNzaW9ucyB0byBQcmluY2lwYWxzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgICAgfSk7XG4gICAgICBidWNrZXQuZ3JhbnRSZWFkKHJvbGUpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbe1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDZm5CdWNrZXQnLCAnQXJuJ10sXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NmbkJ1Y2tldCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoXCJzZXRzIHRoZSBpc1dlYnNpdGUgcHJvcGVydHkgdG8gJ2ZhbHNlJyBpZiAnd2Vic2l0ZUNvbmZpZ3VyYXRpb24nIGlzICd1bmRlZmluZWQnXCIsICgpID0+IHtcbiAgICAgIGV4cGVjdChidWNrZXQuaXNXZWJzaXRlKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIHRlc3QoXCJzZXRzIHRoZSBpc1dlYnNpdGUgcHJvcGVydHkgdG8gJ3RydWUnIGlmICd3ZWJzaXRlQ29uZmlndXJhdGlvbicgaXMgbm90ICd1bmRlZmluZWQnXCIsICgpID0+IHtcbiAgICAgIGNmbkJ1Y2tldCA9IG5ldyBzMy5DZm5CdWNrZXQoc3RhY2ssICdXZWJzaXRlQ2ZuQnVja2V0Jywge1xuICAgICAgICB3ZWJzaXRlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIGluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYnVja2V0ID0gczMuQnVja2V0LmZyb21DZm5CdWNrZXQoY2ZuQnVja2V0KTtcblxuICAgICAgZXhwZWN0KGJ1Y2tldC5pc1dlYnNpdGUpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FsbG93cyBncmFudGluZyBwdWJsaWMgYWNjZXNzIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBidWNrZXQuZ3JhbnRQdWJsaWNBY2Nlc3MoKTtcbiAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBhbGxvdyBncmFudGluZyBwdWJsaWMgYWNjZXNzIGZvciBhIEJ1Y2tldCB0aGF0IGJsb2NrcyBpdCcsICgpID0+IHtcbiAgICAgIGNmbkJ1Y2tldCA9IG5ldyBzMy5DZm5CdWNrZXQoc3RhY2ssICdCbG9ja2VkUHVibGljQWNjZXNzQ2ZuQnVja2V0Jywge1xuICAgICAgICBwdWJsaWNBY2Nlc3NCbG9ja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBibG9ja1B1YmxpY1BvbGljeTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYnVja2V0ID0gczMuQnVja2V0LmZyb21DZm5CdWNrZXQoY2ZuQnVja2V0KTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCk7XG4gICAgICB9KS50b1Rocm93KC9DYW5ub3QgZ3JhbnQgcHVibGljIGFjY2VzcyB3aGVuICdibG9ja1B1YmxpY1BvbGljeScgaXMgZW5hYmxlZC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IGZpbGxzIHRoZSBlbmNyeXB0aW9uIGtleSBpZiB0aGUgTDEgcmVmZXJlbmNlcyBvbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjZm5LZXkgPSBuZXcga21zLkNmbktleShzdGFjaywgJ0NmbktleScsIHtcbiAgICAgICAga2V5UG9saWN5OiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAna21zOionLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAnQVdTJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjZm5CdWNrZXQgPSBuZXcgczMuQ2ZuQnVja2V0KHN0YWNrLCAnS21zRW5jcnlwdGVkQ2ZuQnVja2V0Jywge1xuICAgICAgICBidWNrZXRFbmNyeXB0aW9uOiB7XG4gICAgICAgICAgc2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAga21zTWFzdGVyS2V5SWQ6IGNmbktleS5hdHRyQXJuLFxuICAgICAgICAgICAgICAgIHNzZUFsZ29yaXRobTogJ2F3czprbXMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUNmbkJ1Y2tldChjZm5CdWNrZXQpO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmVuY3J5cHRpb25LZXkpLm5vdC50b0JlVW5kZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3MgaW1wb3J0aW5nIGEgQnVja2V0UG9saWN5IHRoYXQgcmVmZXJlbmNlcyBhIEJ1Y2tldCcsICgpID0+IHtcbiAgICAgIG5ldyBzMy5DZm5CdWNrZXRQb2xpY3koc3RhY2ssICdDZm5CdWNrZXRQb2xpY3knLCB7XG4gICAgICAgIHBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzoqJyxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgJ0FXUyc6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogWycqJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgIGJ1Y2tldDogY2ZuQnVja2V0LnJlZixcbiAgICAgIH0pO1xuICAgICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOionXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKV0sXG4gICAgICB9KSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCAyKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnRSZWFkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1JlYWRlcicpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGJ1Y2tldC5ncmFudFJlYWQocmVhZGVyKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnUmVhZGVyRjdCRjE4OUQnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlVzZXInLFxuICAgICAgICB9LFxuICAgICAgICAnUmVhZGVyRGVmYXVsdFBvbGljeTE1MUYzODE4Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdQb2xpY3lOYW1lJzogJ1JlYWRlckRlZmF1bHRQb2xpY3kxNTFGMzgxOCcsXG4gICAgICAgICAgICAnVXNlcnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ1JlYWRlckY3QkYxODlEJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dyYW50UmVhZFdyaXRlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiBiZSB1c2VkIHRvIGdyYW50IHJlY2lwcm9jYWwgcGVybWlzc2lvbnMgdG8gYW4gaWRlbnRpdHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuICAgICAgYnVja2V0LmdyYW50UmVhZFdyaXRlKHVzZXIpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ015VXNlckRDNDUwMjhCJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlVzZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ015VXNlckRlZmF1bHRQb2xpY3k3Qjg5NzQyNic6IHtcbiAgICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdQb2xpY3lOYW1lJzogJ015VXNlckRlZmF1bHRQb2xpY3k3Qjg5NzQyNicsXG4gICAgICAgICAgICAgICdVc2Vycyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015VXNlckRDNDUwMjhCJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdncmFudCBwZXJtaXNzaW9ucyB0byBub24taWRlbnRpdHkgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgYnVja2V0LmdyYW50UmVhZChuZXcgaWFtLk9yZ2FuaXphdGlvblByaW5jaXBhbCgnby0xMjM0JykpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbJ3MzOkdldE9iamVjdConLCAnczM6R2V0QnVja2V0KicsICdzMzpMaXN0KiddLFxuICAgICAgICAgICAgICAnQ29uZGl0aW9uJzogeyAnU3RyaW5nRXF1YWxzJzogeyAnYXdzOlByaW5jaXBhbE9yZ0lEJzogJ28tMTIzNCcgfSB9LFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSwgJy8qJ11dIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICAgICdLZXlQb2xpY3knOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbJ2ttczpEZWNyeXB0JywgJ2ttczpEZXNjcmliZUtleSddLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICAnQ29uZGl0aW9uJzogeyAnU3RyaW5nRXF1YWxzJzogeyAnYXdzOlByaW5jaXBhbE9yZ0lEJzogJ28tMTIzNCcgfSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcblxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBncmFudCBQdXRPYmplY3RBY2wgd2hlbiB0aGUgUzNfR1JBTlRfV1JJVEVfV0lUSE9VVF9BQ0wgZmVhdHVyZSBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcblxuICAgICAgYnVja2V0LmdyYW50UmVhZFdyaXRlKHVzZXIpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkRlbGV0ZU9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RUYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpBYm9ydConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dyYW50V3JpdGUnLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBLTVMga2V5IGhhcyBhcHByb3ByaWF0ZSBwZXJtaXNzaW9ucyBmb3IgbXVsdGlwYXJ0IHVwbG9hZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMgfSk7XG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgICBidWNrZXQuZ3JhbnRXcml0ZSh1c2VyKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0TGVnYWxIb2xkJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0UmV0ZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFZlcnNpb25UYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAnczM6QWJvcnQqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5KicsXG4gICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEtleUMxNzEzMENGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgICdQb2xpY3lOYW1lJzogJ015VXNlckRlZmF1bHRQb2xpY3k3Qjg5NzQyNicsXG4gICAgICAgICdVc2Vycyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnUmVmJzogJ015VXNlckRDNDUwMjhCJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBncmFudCBQdXRPYmplY3RBY2wgd2hlbiB0aGUgUzNfR1JBTlRfV1JJVEVfV0lUSE9VVF9BQ0wgZmVhdHVyZSBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcblxuICAgICAgYnVja2V0LmdyYW50V3JpdGUodXNlcik7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdncmFudCBvbmx5IGFsbG93ZWRBY3Rpb25QYXR0ZXJucyB3aGVuIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG5cbiAgICAgIGJ1Y2tldC5ncmFudFdyaXRlKHVzZXIsICcqJywgWydzMzpQdXRPYmplY3QnLCAnczM6RGVsZXRlT2JqZWN0KiddKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dyYW50UHV0JywgKCkgPT4ge1xuICAgIHRlc3QoJ2RvZXMgbm90IGdyYW50IFB1dE9iamVjdEFjbCB3aGVuIHRoZSBTM19HUkFOVF9XUklURV9XSVRIT1VUX0FDTCBmZWF0dXJlIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuXG4gICAgICBidWNrZXQuZ3JhbnRQdXQodXNlcik7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0TGVnYWxIb2xkJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0UmV0ZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFZlcnNpb25UYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAnczM6QWJvcnQqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbW9yZSBncmFudHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyB9KTtcbiAgICBjb25zdCBwdXR0ZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdQdXR0ZXInKTtcbiAgICBjb25zdCB3cml0ZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdXcml0ZXInKTtcbiAgICBjb25zdCBkZWxldGVyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnRGVsZXRlcicpO1xuXG4gICAgYnVja2V0LmdyYW50UHV0KHB1dHRlcik7XG4gICAgYnVja2V0LmdyYW50V3JpdGUod3JpdGVyKTtcbiAgICBidWNrZXQuZ3JhbnREZWxldGUoZGVsZXRlcik7XG5cbiAgICBjb25zdCByZXNvdXJjZXMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRvSlNPTigpLlJlc291cmNlcztcbiAgICBjb25zdCBhY3Rpb25zID0gKGlkOiBzdHJpbmcpID0+IHJlc291cmNlc1tpZF0uUHJvcGVydGllcy5Qb2xpY3lEb2N1bWVudC5TdGF0ZW1lbnRbMF0uQWN0aW9uO1xuXG4gICAgZXhwZWN0KGFjdGlvbnMoJ1dyaXRlckRlZmF1bHRQb2xpY3lEQzU4NUJDRScpKS50b0VxdWFsKFtcbiAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAnczM6UHV0T2JqZWN0UmV0ZW50aW9uJyxcbiAgICAgICdzMzpQdXRPYmplY3RUYWdnaW5nJyxcbiAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAnczM6QWJvcnQqJyxcbiAgICBdKTtcbiAgICBleHBlY3QoYWN0aW9ucygnUHV0dGVyRGVmYXVsdFBvbGljeUFCMTM4REQzJykpLnRvRXF1YWwoW1xuICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAnczM6UHV0T2JqZWN0TGVnYWxIb2xkJyxcbiAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgJ3MzOlB1dE9iamVjdFZlcnNpb25UYWdnaW5nJyxcbiAgICAgICdzMzpBYm9ydConLFxuICAgIF0pO1xuICAgIGV4cGVjdChhY3Rpb25zKCdEZWxldGVyRGVmYXVsdFBvbGljeUNEMzNCOEEwJykpLnRvRXF1YWwoJ3MzOkRlbGV0ZU9iamVjdConKTtcblxuICB9KTtcblxuICB0ZXN0KCdncmFudERlbGV0ZSwgd2l0aCBhIEtNUyBLZXknLCAoKSA9PiB7XG4gICAgLy8gZ2l2ZW5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG4gICAgY29uc3QgZGVsZXRlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ0RlbGV0ZXInKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiAnbXktYnVja2V0LXBoeXNpY2FsLW5hbWUnLFxuICAgICAgZW5jcnlwdGlvbktleToga2V5LFxuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMsXG4gICAgfSk7XG5cbiAgICAvLyB3aGVuXG4gICAgYnVja2V0LmdyYW50RGVsZXRlKGRlbGV0ZXIpO1xuXG4gICAgLy8gdGhlblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY3Jvc3Mtc3RhY2sgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgdGVzdCgnaW4gdGhlIHNhbWUgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrQSA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2tBJyk7XG4gICAgICBjb25zdCBidWNrZXRGcm9tU3RhY2tBID0gbmV3IHMzLkJ1Y2tldChzdGFja0EsICdNeUJ1Y2tldCcpO1xuXG4gICAgICBjb25zdCBzdGFja0IgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrQicpO1xuICAgICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFja0IsICdVc2VyV2hvTmVlZHNBY2Nlc3MnKTtcbiAgICAgIGJ1Y2tldEZyb21TdGFja0EuZ3JhbnRSZWFkKHVzZXIpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tBKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnT3V0cHV0cyc6IHtcbiAgICAgICAgICAnRXhwb3J0c091dHB1dEZuR2V0QXR0TXlCdWNrZXRGNjhGM0ZGMEFybjBGN0U4RTU4Jzoge1xuICAgICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ0V4cG9ydCc6IHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnc3RhY2tBOkV4cG9ydHNPdXRwdXRGbkdldEF0dE15QnVja2V0RjY4RjNGRjBBcm4wRjdFOEU1OCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrQikudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgICAnVXNlcldob05lZWRzQWNjZXNzRjg5NTlDM0QnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6VXNlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnVXNlcldob05lZWRzQWNjZXNzRGVmYXVsdFBvbGljeTZBOUVCNTMwJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnc3RhY2tBOkV4cG9ydHNPdXRwdXRGbkdldEF0dE15QnVja2V0RjY4RjNGRjBBcm4wRjdFOEU1OCcsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdzdGFja0E6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlCdWNrZXRGNjhGM0ZGMEFybjBGN0U4RTU4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdQb2xpY3lOYW1lJzogJ1VzZXJXaG9OZWVkc0FjY2Vzc0RlZmF1bHRQb2xpY3k2QTlFQjUzMCcsXG4gICAgICAgICAgICAgICdVc2Vycyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ1VzZXJXaG9OZWVkc0FjY2Vzc0Y4OTU5QzNEJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbiBkaWZmZXJlbnQgYWNjb3VudHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2tBID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdTdGFja0EnLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyB9IH0pO1xuICAgICAgY29uc3QgYnVja2V0RnJvbVN0YWNrQSA9IG5ldyBzMy5CdWNrZXQoc3RhY2tBLCAnTXlCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteS1idWNrZXQtcGh5c2ljYWwtbmFtZScsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2tCID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdTdGFja0InLCB7IGVudjogeyBhY2NvdW50OiAnMjM0NTY3ODkwMTIzJyB9IH0pO1xuICAgICAgY29uc3Qgcm9sZUZyb21TdGFja0IgPSBuZXcgaWFtLlJvbGUoc3RhY2tCLCAnTXlSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMjM0NTY3ODkwMTIzJyksXG4gICAgICAgIHJvbGVOYW1lOiAnTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBidWNrZXRGcm9tU3RhY2tBLmdyYW50UmVhZChyb2xlRnJvbVN0YWNrQik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFja0EpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOmlhbTo6MjM0NTY3ODkwMTIzOnJvbGUvTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrQikuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6czM6OjpteS1idWNrZXQtcGh5c2ljYWwtbmFtZScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6czM6OjpteS1idWNrZXQtcGh5c2ljYWwtbmFtZS8qJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW4gZGlmZmVyZW50IGFjY291bnRzLCB3aXRoIGEgS01TIEtleScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFja0EgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrQScsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0gfSk7XG4gICAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFja0EsICdNeUtleScpO1xuICAgICAgY29uc3QgYnVja2V0RnJvbVN0YWNrQSA9IG5ldyBzMy5CdWNrZXQoc3RhY2tBLCAnTXlCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteS1idWNrZXQtcGh5c2ljYWwtbmFtZScsXG4gICAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhY2tCID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdTdGFja0InLCB7IGVudjogeyBhY2NvdW50OiAnMjM0NTY3ODkwMTIzJyB9IH0pO1xuICAgICAgY29uc3Qgcm9sZUZyb21TdGFja0IgPSBuZXcgaWFtLlJvbGUoc3RhY2tCLCAnTXlSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMjM0NTY3ODkwMTIzJyksXG4gICAgICAgIHJvbGVOYW1lOiAnTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBidWNrZXRGcm9tU3RhY2tBLmdyYW50UmVhZChyb2xlRnJvbVN0YWNrQik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFja0EpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgICAgJ0tleVBvbGljeSc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgICAgJ2ttczpEZXNjcmliZUtleScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICdBV1MnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzppYW06OjIzNDU2Nzg5MDEyMzpyb2xlL015Um9sZVBoeXNpY2FsTmFtZScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tCKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgICAgJ2ttczpEZXNjcmliZUtleScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1cmxGb3JPYmplY3QgcmV0dXJucyBhIHRva2VuIHdpdGggdGhlIFMzIFVSTCBvZiB0aGUgdG9rZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgY29uc3QgYnVja2V0V2l0aFJlZ2lvbiA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ1JlZ2lvbmFsQnVja2V0Jywge1xuICAgICAgYnVja2V0QXJuOiAnYXJuOmF3czpzMzo6OmV4cGxpY2l0LXJlZ2lvbi1idWNrZXQnLFxuICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnQnVja2V0VVJMJywgeyB2YWx1ZTogYnVja2V0LnVybEZvck9iamVjdCgpIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTXlGaWxlVVJMJywgeyB2YWx1ZTogYnVja2V0LnVybEZvck9iamVjdCgnbXkvZmlsZS50eHQnKSB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1lvdXJGaWxlVVJMJywgeyB2YWx1ZTogYnVja2V0LnVybEZvck9iamVjdCgnL3lvdXIvZmlsZS50eHQnKSB9KTsgLy8gXCIvXCIgaXMgb3B0aW9uYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1JlZ2lvbkJ1Y2tldFVSTCcsIHsgdmFsdWU6IGJ1Y2tldFdpdGhSZWdpb24udXJsRm9yT2JqZWN0KCkgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ091dHB1dHMnOiB7XG4gICAgICAgICdCdWNrZXRVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovL3MzLicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlGaWxlVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zMy4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnL215L2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1lvdXJGaWxlVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zMy4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnL3lvdXIvZmlsZS50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnUmVnaW9uQnVja2V0VVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zMy51cy13ZXN0LTIuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6VVJMU3VmZml4JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvZXhwbGljaXQtcmVnaW9uLWJ1Y2tldCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzM1VybEZvck9iamVjdCByZXR1cm5zIGEgdG9rZW4gd2l0aCB0aGUgUzMgVVJMIG9mIHRoZSB0b2tlbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnQnVja2V0UzNVUkwnLCB7IHZhbHVlOiBidWNrZXQuczNVcmxGb3JPYmplY3QoKSB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ015RmlsZVMzVVJMJywgeyB2YWx1ZTogYnVja2V0LnMzVXJsRm9yT2JqZWN0KCdteS9maWxlLnR4dCcpIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnWW91ckZpbGVTM1VSTCcsIHsgdmFsdWU6IGJ1Y2tldC5zM1VybEZvck9iamVjdCgnL3lvdXIvZmlsZS50eHQnKSB9KTsgLy8gXCIvXCIgaXMgb3B0aW9uYWxcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnT3V0cHV0cyc6IHtcbiAgICAgICAgJ0J1Y2tldFMzVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnczM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015RmlsZVMzVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnczM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnL215L2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1lvdXJGaWxlUzNVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdzMzovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcveW91ci9maWxlLnR4dCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ3JhbnRQdWJsaWNBY2Nlc3MnLCAoKSA9PiB7XG4gICAgdGVzdCgnYnkgZGVmYXVsdCwgZ3JhbnRzIHMzOkdldE9iamVjdCB0byBhbGwgb2JqZWN0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdiJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGJ1Y2tldC5ncmFudFB1YmxpY0FjY2VzcygpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzpHZXRPYmplY3QnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkpvaW4nOiBbJycsIFt7ICdGbjo6R2V0QXR0JzogWydiQzNCQkNDNjUnLCAnQXJuJ10gfSwgJy8qJ11dIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnXCJrZXlQcmVmaXhcIiBjYW4gYmUgdXNlZCB0byBvbmx5IGdyYW50IGFjY2VzcyB0byBjZXJ0YWluIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnYicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBidWNrZXQuZ3JhbnRQdWJsaWNBY2Nlc3MoJ29ubHkvYWNjZXNzL3RoZXNlLyonKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnczM6R2V0T2JqZWN0JyxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHsgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnYkMzQkJDQzY1JywgJ0FybiddIH0sICcvb25seS9hY2Nlc3MvdGhlc2UvKiddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ1wiYWxsb3dlZEFjdGlvbnNcIiBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGFjdGlvbnMgZXhwbGljaXRseScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdiJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGJ1Y2tldC5ncmFudFB1YmxpY0FjY2VzcygnKicsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0Jyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogWydzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0J10sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ2JDM0JCQ0M2NScsICdBcm4nXSB9LCAnLyonXV0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXR1cm5zIHRoZSBQb2xpY3lTdGF0ZW1lbnQgd2hpY2ggY2FuIGJlIHRoZW4gY3VzdG9taXplZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdiJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1Y2tldC5ncmFudFB1YmxpY0FjY2VzcygpO1xuICAgICAgcmVzdWx0LnJlc291cmNlU3RhdGVtZW50IS5hZGRDb25kaXRpb24oJ0lwQWRkcmVzcycsIHsgJ2F3czpTb3VyY2VJcCc6ICc1NC4yNDAuMTQzLjAvMjQnIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzpHZXRPYmplY3QnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkpvaW4nOiBbJycsIFt7ICdGbjo6R2V0QXR0JzogWydiQzNCQkNDNjUnLCAnQXJuJ10gfSwgJy8qJ11dIH0sXG4gICAgICAgICAgICAgICdDb25kaXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0lwQWRkcmVzcyc6IHsgJ2F3czpTb3VyY2VJcCc6ICc1NC4yNDAuMTQzLjAvMjQnIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gYmxvY2tQdWJsaWNQb2xpY3kgaXMgc2V0IHRvIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBuZXcgczMuQmxvY2tQdWJsaWNBY2Nlc3MoeyBibG9ja1B1YmxpY1BvbGljeTogdHJ1ZSB9KSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCkpLnRvVGhyb3coL2Jsb2NrUHVibGljUG9saWN5Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3ZWJzaXRlIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnb25seSBpbmRleCBkb2MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Mi5odG1sJyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgICAgV2Vic2l0ZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBJbmRleERvY3VtZW50OiAnaW5kZXgyLmh0bWwnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdmYWlscyBpZiBvbmx5IGVycm9yIGRvYyBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvXCJ3ZWJzaXRlSW5kZXhEb2N1bWVudFwiIGlzIHJlcXVpcmVkIGlmIFwid2Vic2l0ZUVycm9yRG9jdW1lbnRcIiBpcyBzZXQvKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2Vycm9yIGFuZCBpbmRleCBkb2NzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleDIuaHRtbCcsXG4gICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAgIFdlYnNpdGVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgSW5kZXhEb2N1bWVudDogJ2luZGV4Mi5odG1sJyxcbiAgICAgICAgICBFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2V4cG9ydHMgdGhlIFdlYnNpdGVVUkwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgfSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0V2Vic2l0ZVVybCkpLnRvRXF1YWwoeyAnRm46OkdldEF0dCc6IFsnV2Vic2l0ZTMyOTYyRDBCJywgJ1dlYnNpdGVVUkwnXSB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2V4cG9ydHMgdGhlIFdlYnNpdGVEb21haW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgfSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0V2Vic2l0ZURvbWFpbk5hbWUpKS50b0VxdWFsKHtcbiAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OlNwbGl0JzogWycvJywgeyAnRm46OkdldEF0dCc6IFsnV2Vic2l0ZTMyOTYyRDBCJywgJ1dlYnNpdGVVUkwnXSB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdleHBvcnRzIHRoZSBXZWJzaXRlVVJMIGZvciBpbXBvcnRlZCBidWNrZXRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssICdXZWJzaXRlJywgJ215LXRlc3QtYnVja2V0Jyk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0V2Vic2l0ZVVybCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2h0dHA6Ly9teS10ZXN0LWJ1Y2tldC4nLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkZpbmRJbk1hcCc6IFtcbiAgICAgICAgICAgICAgICAnUzNzdGF0aWN3ZWJzaXRlTWFwJyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICdlbmRwb2ludCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXRXZWJzaXRlRG9tYWluTmFtZSkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ215LXRlc3QtYnVja2V0LicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RmluZEluTWFwJzogW1xuICAgICAgICAgICAgICAgICdTM3N0YXRpY3dlYnNpdGVNYXAnLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJ2VuZHBvaW50JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRlc3QoJ2V4cG9ydHMgdGhlIFdlYnNpdGVVUkwgZm9yIGltcG9ydGVkIGJ1Y2tldHMgd2l0aCB1cmwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteS10ZXN0LWJ1Y2tldCcsXG4gICAgICAgIGJ1Y2tldFdlYnNpdGVVcmw6ICdodHRwOi8vbXktdGVzdC1idWNrZXQubXktdGVzdC5zdWZmaXgnLFxuICAgICAgfSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0V2Vic2l0ZVVybCkpLnRvRXF1YWwoJ2h0dHA6Ly9teS10ZXN0LWJ1Y2tldC5teS10ZXN0LnN1ZmZpeCcpO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldFdlYnNpdGVEb21haW5OYW1lKSkudG9FcXVhbCgnbXktdGVzdC1idWNrZXQubXktdGVzdC5zdWZmaXgnKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2FkZHMgUmVkaXJlY3RBbGxSZXF1ZXN0c1RvIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgd2Vic2l0ZVJlZGlyZWN0OiB7XG4gICAgICAgICAgaG9zdE5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIHByb3RvY29sOiBzMy5SZWRpcmVjdFByb3RvY29sLkhUVFBTLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgICBXZWJzaXRlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIFJlZGlyZWN0QWxsUmVxdWVzdHNUbzoge1xuICAgICAgICAgICAgSG9zdE5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgUHJvdG9jb2w6ICdodHRwcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnZmFpbHMgaWYgd2Vic2l0ZVJlZGlyZWN0IGFuZCB3ZWJzaXRlSW5kZXggYW5kIHdlYnNpdGVFcnJvciBhcmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXG4gICAgICAgICAgd2Vic2l0ZVJlZGlyZWN0OiB7XG4gICAgICAgICAgICBob3N0TmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9cIndlYnNpdGVJbmRleERvY3VtZW50XCIsIFwid2Vic2l0ZUVycm9yRG9jdW1lbnRcIiBhbmQsIFwid2Vic2l0ZVJvdXRpbmdSdWxlc1wiIGNhbm5vdCBiZSBzZXQgaWYgXCJ3ZWJzaXRlUmVkaXJlY3RcIiBpcyB1c2VkLyk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdmYWlscyBpZiB3ZWJzaXRlUmVkaXJlY3QgYW5kIHdlYnNpdGVSb3V0aW5nUnVsZXMgYXJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgICAgd2Vic2l0ZVJvdXRpbmdSdWxlczogW10sXG4gICAgICAgICAgd2Vic2l0ZVJlZGlyZWN0OiB7XG4gICAgICAgICAgICBob3N0TmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9cIndlYnNpdGVJbmRleERvY3VtZW50XCIsIFwid2Vic2l0ZUVycm9yRG9jdW1lbnRcIiBhbmQsIFwid2Vic2l0ZVJvdXRpbmdSdWxlc1wiIGNhbm5vdCBiZSBzZXQgaWYgXCJ3ZWJzaXRlUmVkaXJlY3RcIiBpcyB1c2VkLyk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdhZGRzIFJlZGlyZWN0UnVsZXMgcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICB3ZWJzaXRlUm91dGluZ1J1bGVzOiBbe1xuICAgICAgICAgIGhvc3ROYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICBodHRwUmVkaXJlY3RDb2RlOiAnMzAyJyxcbiAgICAgICAgICBwcm90b2NvbDogczMuUmVkaXJlY3RQcm90b2NvbC5IVFRQUyxcbiAgICAgICAgICByZXBsYWNlS2V5OiBzMy5SZXBsYWNlS2V5LnByZWZpeFdpdGgoJ3Rlc3QvJyksXG4gICAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgICBodHRwRXJyb3JDb2RlUmV0dXJuZWRFcXVhbHM6ICcyMDAnLFxuICAgICAgICAgICAga2V5UHJlZml4RXF1YWxzOiAncHJlZml4JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgICAgV2Vic2l0ZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBSb3V0aW5nUnVsZXM6IFt7XG4gICAgICAgICAgICBSZWRpcmVjdFJ1bGU6IHtcbiAgICAgICAgICAgICAgSG9zdE5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgICBIdHRwUmVkaXJlY3RDb2RlOiAnMzAyJyxcbiAgICAgICAgICAgICAgUHJvdG9jb2w6ICdodHRwcycsXG4gICAgICAgICAgICAgIFJlcGxhY2VLZXlQcmVmaXhXaXRoOiAndGVzdC8nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJvdXRpbmdSdWxlQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIEh0dHBFcnJvckNvZGVSZXR1cm5lZEVxdWFsczogJzIwMCcsXG4gICAgICAgICAgICAgIEtleVByZWZpeEVxdWFsczogJ3ByZWZpeCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdmYWlscyBpZiByb3V0aW5nUnVsZSBjb25kaXRpb24gb2JqZWN0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgICB3ZWJzaXRlUm91dGluZ1J1bGVzOiBbe1xuICAgICAgICAgICAgaHR0cFJlZGlyZWN0Q29kZTogJzMwMycsXG4gICAgICAgICAgICBjb25kaXRpb246IHt9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1RoZSBjb25kaXRpb24gcHJvcGVydHkgY2Fubm90IGJlIGFuIGVtcHR5IG9iamVjdC8pO1xuXG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ2lzV2Vic2l0ZSBzZXQgcHJvcGVybHkgd2l0aCcsICgpID0+IHtcbiAgICAgIHRlc3QoJ29ubHkgaW5kZXggZG9jJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleDIuaHRtbCcsXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdlcnJvciBhbmQgaW5kZXggZG9jcycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXgyLmh0bWwnLFxuICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiAnZXJyb3IuaHRtbCcsXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdyZWRpcmVjdHMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgICB3ZWJzaXRlUmVkaXJlY3Q6IHtcbiAgICAgICAgICAgIGhvc3ROYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICAgIHByb3RvY29sOiBzMy5SZWRpcmVjdFByb3RvY29sLkhUVFBTLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdubyB3ZWJzaXRlIHByb3BlcnRpZXMgc2V0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnKTtcbiAgICAgICAgZXhwZWN0KGJ1Y2tldC5pc1dlYnNpdGUpLnRvRXF1YWwoZmFsc2UpO1xuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJ2ltcG9ydGVkIHdlYnNpdGUgYnVja2V0cycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgICAgYnVja2V0QXJuOiAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldCcsXG4gICAgICAgICAgaXNXZWJzaXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgZXhwZWN0KGJ1Y2tldC5pc1dlYnNpdGUpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnaW1wb3J0ZWQgYnVja2V0cycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ05vdFdlYnNpdGUnLCB7XG4gICAgICAgICAgYnVja2V0QXJuOiAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldCcsXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9FcXVhbChmYWxzZSk7XG5cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQuZnJvbUJ1Y2tldEFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXJuKHN0YWNrLCAnbXktYnVja2V0JywgJ2Fybjphd3M6czM6OjpteS1jb3Jwb3JhdGUtYnVja2V0Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGJ1Y2tldC5idWNrZXROYW1lKS50b0VxdWFsKCdteS1jb3Jwb3JhdGUtYnVja2V0Jyk7XG4gICAgZXhwZWN0KGJ1Y2tldC5idWNrZXRBcm4pLnRvRXF1YWwoJ2Fybjphd3M6czM6OjpteS1jb3Jwb3JhdGUtYnVja2V0Jyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0LmZyb21CdWNrZXROYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnaW1wb3J0ZWQtYnVja2V0JywgJ215LWJ1Y2tldC1uYW1lJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGJ1Y2tldC5idWNrZXROYW1lKS50b0VxdWFsKCdteS1idWNrZXQtbmFtZScpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXRBcm4pKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzMzo6Om15LWJ1Y2tldC1uYW1lJ11dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZiBhIGttcyBrZXkgaXMgc3BlY2lmaWVkLCBpdCBpbXBsaWVzIGJ1Y2tldCBpcyBlbmNyeXB0ZWQgd2l0aCBrbXMgKGRhaCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ2snKTtcblxuICAgIC8vIFRIRU5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnYicsIHsgZW5jcnlwdGlvbktleToga2V5IH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBTZXJ2ZXIgQWNjZXNzIExvZ3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhY2Nlc3NMb2dCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQWNjZXNzTG9ncycpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ6IGFjY2Vzc0xvZ0J1Y2tldCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTG9nZ2luZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiB7XG4gICAgICAgICAgUmVmOiAnQWNjZXNzTG9nczhCNjIwRUNBJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldCB3aXRoIFNlcnZlciBBY2Nlc3MgTG9ncyB3aXRoIFByZWZpeCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFjY2Vzc0xvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdBY2Nlc3NMb2dzJyk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogYWNjZXNzTG9nQnVja2V0LFxuICAgICAgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ2hlbGxvJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTG9nZ2luZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiB7XG4gICAgICAgICAgUmVmOiAnQWNjZXNzTG9nczhCNjIwRUNBJyxcbiAgICAgICAgfSxcbiAgICAgICAgTG9nRmlsZVByZWZpeDogJ2hlbGxvJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FjY2VzcyBsb2cgcHJlZml4IGdpdmVuIHdpdGhvdXQgYnVja2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAnaGVsbG8nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMb2dnaW5nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBMb2dGaWxlUHJlZml4OiAnaGVsbG8nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IEFsbG93IExvZyBkZWxpdmVyeSBjaGFuZ2VzIGJ1Y2tldCBBY2Nlc3MgQ29udHJvbCBzaG91bGQgZmFpbCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFjY2Vzc0xvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdBY2Nlc3NMb2dzJywge1xuICAgICAgYWNjZXNzQ29udHJvbDogczMuQnVja2V0QWNjZXNzQ29udHJvbC5BVVRIRU5USUNBVEVEX1JFQUQsXG4gICAgfSk7XG4gICAgZXhwZWN0KCgpID0+XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICAgIHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ6IGFjY2Vzc0xvZ0J1Y2tldCxcbiAgICAgICAgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ2hlbGxvJyxcbiAgICAgICAgYWNjZXNzQ29udHJvbDogczMuQnVja2V0QWNjZXNzQ29udHJvbC5BVVRIRU5USUNBVEVEX1JFQUQsXG4gICAgICB9KSxcbiAgICApLnRvVGhyb3coL0Nhbm5vdCBlbmFibGUgbG9nIGRlbGl2ZXJ5IHRvIHRoaXMgYnVja2V0IGJlY2F1c2UgdGhlIGJ1Y2tldCdzIEFDTCBoYXMgYmVlbiBzZXQgYW5kIGNhbid0IGJlIGNoYW5nZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHNraXBzIHNldHRpbmcgdXAgYWNjZXNzIGxvZyBBQ0wgYnV0IGNvbmZpZ3VyZXMgZGVsaXZlcnkgZm9yIGFuIGltcG9ydGVkIHRhcmdldCBidWNrZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhY2Nlc3NMb2dCdWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssICdUYXJnZXRCdWNrZXQnLCAndGFyZ2V0LWxvZ3MtYnVja2V0Jyk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1Rlc3RCdWNrZXQnLCB7XG4gICAgICBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBhY2Nlc3NMb2dCdWNrZXQsXG4gICAgICBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAndGVzdC8nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIExvZ2dpbmdDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIERlc3RpbmF0aW9uQnVja2V0TmFtZTogc3RhY2sucmVzb2x2ZShhY2Nlc3NMb2dCdWNrZXQuYnVja2V0TmFtZSksXG4gICAgICAgIExvZ0ZpbGVQcmVmaXg6ICd0ZXN0LycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRlbXBsYXRlLmFsbFJlc291cmNlc1Byb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIEFjY2Vzc0NvbnRyb2w6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnKicsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ1VuYWJsZSB0byBhZGQgbmVjZXNzYXJ5IGxvZ2dpbmcgcGVybWlzc2lvbnMgdG8gaW1wb3J0ZWQgdGFyZ2V0IGJ1Y2tldCcpKTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IEFsbG93IExvZyBkZWxpdmVyeSBzaG91bGQgdXNlIHRoZSByZWNvbW1lbmRlZCBwb2xpY3kgd2hlbiBmbGFnIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2F3cy1zMzpzZXJ2ZXJBY2Nlc3NMb2dzVXNlQnVja2V0UG9saWN5JywgdHJ1ZSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1Rlc3RCdWNrZXQnLCB7IHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg6ICd0ZXN0JyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBBY2Nlc3NDb250cm9sOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgIEJ1Y2tldDogc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0TmFtZSksXG4gICAgICBQb2xpY3lEb2N1bWVudDogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdsb2dnaW5nLnMzLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICBSZXNvdXJjZTogc3RhY2sucmVzb2x2ZShgJHtidWNrZXQuYnVja2V0QXJufS90ZXN0KmApLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldEFybiksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHsgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSldKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdMb2cgRGVsaXZlcnkgYnVja2V0IHBvbGljeSBzaG91bGQgcHJvcGVybHkgc2V0IHNvdXJjZSBidWNrZXQgQVJOL0FjY291bnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2F3cy1zMzpzZXJ2ZXJBY2Nlc3NMb2dzVXNlQnVja2V0UG9saWN5JywgdHJ1ZSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGFyZ2V0QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1RhcmdldEJ1Y2tldCcpO1xuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdTb3VyY2VCdWNrZXQnLCB7IHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ6IHRhcmdldEJ1Y2tldCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgQnVja2V0OiBzdGFjay5yZXNvbHZlKHRhcmdldEJ1Y2tldC5idWNrZXROYW1lKSxcbiAgICAgIFBvbGljeURvY3VtZW50OiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xvZ2dpbmcuczMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgIFJlc291cmNlOiBzdGFjay5yZXNvbHZlKGAke3RhcmdldEJ1Y2tldC5idWNrZXRBcm59LypgKSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiBzdGFjay5yZXNvbHZlKHNvdXJjZUJ1Y2tldC5idWNrZXRBcm4pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiBzdGFjay5yZXNvbHZlKHNvdXJjZUJ1Y2tldC5lbnYuYWNjb3VudCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXSksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRGVmYXVsdHMgZm9yIGFuIGludmVudG9yeSBidWNrZXQnLCAoKSA9PiB7XG4gICAgLy8gR2l2ZW5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGludmVudG9yeUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdJbnZlbnRvcnlCdWNrZXQnKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBpbnZlbnRvcmllczogW1xuICAgICAgICB7XG4gICAgICAgICAgZGVzdGluYXRpb246IHtcbiAgICAgICAgICAgIGJ1Y2tldDogaW52ZW50b3J5QnVja2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIEludmVudG9yeUNvbmZpZ3VyYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIEluY2x1ZGVkT2JqZWN0VmVyc2lvbnM6ICdBbGwnLFxuICAgICAgICAgIFNjaGVkdWxlRnJlcXVlbmN5OiAnV2Vla2x5JyxcbiAgICAgICAgICBEZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgRm9ybWF0OiAnQ1NWJyxcbiAgICAgICAgICAgIEJ1Y2tldEFybjogeyAnRm46OkdldEF0dCc6IFsnSW52ZW50b3J5QnVja2V0QTg2OUI4Q0InLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIElkOiAnTXlCdWNrZXRJbnZlbnRvcnkwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgQnVja2V0OiB7IFJlZjogJ0ludmVudG9yeUJ1Y2tldEE4NjlCOENCJyB9LFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzMy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydJbnZlbnRvcnlCdWNrZXRBODY5QjhDQicsICdBcm4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ0ludmVudG9yeUJ1Y2tldEE4NjlCOENCJywgJ0FybiddIH0sICcvKiddXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSldKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldCB3aXRoIG9iamVjdE93bmVyc2hpcCBzZXQgdG8gQlVDS0VUX09XTkVSX0VORk9SQ0VEJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIG9iamVjdE93bmVyc2hpcDogczMuT2JqZWN0T3duZXJzaGlwLkJVQ0tFVF9PV05FUl9FTkZPUkNFRCxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ093bmVyc2hpcENvbnRyb2xzJzoge1xuICAgICAgICAgICAgICAnUnVsZXMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ09iamVjdE93bmVyc2hpcCc6ICdCdWNrZXRPd25lckVuZm9yY2VkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBvYmplY3RPd25lcnNoaXAgc2V0IHRvIEJVQ0tFVF9PV05FUl9QUkVGRVJSRUQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgb2JqZWN0T3duZXJzaGlwOiBzMy5PYmplY3RPd25lcnNoaXAuQlVDS0VUX09XTkVSX1BSRUZFUlJFRCxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ093bmVyc2hpcENvbnRyb2xzJzoge1xuICAgICAgICAgICAgICAnUnVsZXMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ09iamVjdE93bmVyc2hpcCc6ICdCdWNrZXRPd25lclByZWZlcnJlZCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggb2JqZWN0T3duZXJzaGlwIHNldCB0byBPQkpFQ1RfV1JJVEVSJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIG9iamVjdE93bmVyc2hpcDogczMuT2JqZWN0T3duZXJzaGlwLk9CSkVDVF9XUklURVIsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdPd25lcnNoaXBDb250cm9scyc6IHtcbiAgICAgICAgICAgICAgJ1J1bGVzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdPYmplY3RPd25lcnNoaXAnOiAnT2JqZWN0V3JpdGVyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBvYmplY3RPd25lcnNoaXBzIHNldCB0byB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgb2JqZWN0T3duZXJzaGlwOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBhdXRvRGVsZXRlT2JqZWN0cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgIEJ1Y2tldDoge1xuICAgICAgICBSZWY6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgIH0sXG4gICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAnQVdTJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0N1c3RvbVMzQXV0b0RlbGV0ZU9iamVjdHNDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZTNCMUJEMDkyJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0N1c3RvbTo6UzNBdXRvRGVsZXRlT2JqZWN0cycsIHtcbiAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAnU2VydmljZVRva2VuJzoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0N1c3RvbVMzQXV0b0RlbGV0ZU9iamVjdHNDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjlEOTAxODRGJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgICdCdWNrZXROYW1lJzoge1xuICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ0RlcGVuZHNPbic6IFtcbiAgICAgICAgJ015QnVja2V0UG9saWN5RTdGQkFDN0InLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBhdXRvRGVsZXRlT2JqZWN0cyBvbiBtdWx0aXBsZSBidWNrZXRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldDEnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0MicsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCAxKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXV0b0RlbGV0ZU9iamVjdHMgdGhyb3dzIGlmIFJlbW92YWxQb2xpY3kgaXMgbm90IERFU1RST1knLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgfSkpLnRvVGhyb3coL0Nhbm5vdCB1c2UgXFwnYXV0b0RlbGV0ZU9iamVjdHNcXCcgcHJvcGVydHkgb24gYSBidWNrZXQgd2l0aG91dCBzZXR0aW5nIHJlbW92YWwgcG9saWN5IHRvIFxcJ0RFU1RST1lcXCcvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggdHJhbnNmZXIgYWNjZWxlcmF0aW9uIHR1cm5lZCBvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICB0cmFuc2ZlckFjY2VsZXJhdGlvbjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQWNjZWxlcmF0ZUNvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICdBY2NlbGVyYXRpb25TdGF0dXMnOiAnRW5hYmxlZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0IHJldHVybnMgYSB0b2tlbiB3aXRoIHRoZSBTMyBVUkwgb2YgdGhlIHRva2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGNvbnN0IGJ1Y2tldFdpdGhSZWdpb24gPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdSZWdpb25hbEJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldEFybjogJ2Fybjphd3M6czM6OjpleHBsaWNpdC1yZWdpb24tYnVja2V0JyxcbiAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0J1Y2tldFVSTCcsIHsgdmFsdWU6IGJ1Y2tldC50cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdCgpIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTXlGaWxlVVJMJywgeyB2YWx1ZTogYnVja2V0LnRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0KCdteS9maWxlLnR4dCcpIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnWW91ckZpbGVVUkwnLCB7IHZhbHVlOiBidWNrZXQudHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3QoJy95b3VyL2ZpbGUudHh0JykgfSk7IC8vIFwiL1wiIGlzIG9wdGlvbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdSZWdpb25CdWNrZXRVUkwnLCB7IHZhbHVlOiBidWNrZXRXaXRoUmVnaW9uLnRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0KCkgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ091dHB1dHMnOiB7XG4gICAgICAgICdCdWNrZXRVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuczMtYWNjZWxlcmF0ZS5hbWF6b25hd3MuY29tLycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeUZpbGVVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuczMtYWNjZWxlcmF0ZS5hbWF6b25hd3MuY29tL215L2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1lvdXJGaWxlVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLnMzLWFjY2VsZXJhdGUuYW1hem9uYXdzLmNvbS95b3VyL2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1JlZ2lvbkJ1Y2tldFVSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiAnaHR0cHM6Ly9leHBsaWNpdC1yZWdpb24tYnVja2V0LnMzLWFjY2VsZXJhdGUuYW1hem9uYXdzLmNvbS8nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3Qgd2l0aCBkdWFsIHN0YWNrIG9wdGlvbiByZXR1cm5zIGEgdG9rZW4gd2l0aCB0aGUgUzMgVVJMIG9mIHRoZSB0b2tlbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBjb25zdCBidWNrZXRXaXRoUmVnaW9uID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnUmVnaW9uYWxCdWNrZXQnLCB7XG4gICAgICBidWNrZXRBcm46ICdhcm46YXdzOnMzOjo6ZXhwbGljaXQtcmVnaW9uLWJ1Y2tldCcsXG4gICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdCdWNrZXRVUkwnLCB7IHZhbHVlOiBidWNrZXQudHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3QodW5kZWZpbmVkLCB7IGR1YWxTdGFjazogdHJ1ZSB9KSB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ015RmlsZVVSTCcsIHsgdmFsdWU6IGJ1Y2tldC50cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdCgnbXkvZmlsZS50eHQnLCB7IGR1YWxTdGFjazogdHJ1ZSB9KSB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1lvdXJGaWxlVVJMJywgeyB2YWx1ZTogYnVja2V0LnRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0KCcveW91ci9maWxlLnR4dCcsIHsgZHVhbFN0YWNrOiB0cnVlIH0pIH0pOyAvLyBcIi9cIiBpcyBvcHRpb25hbFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnUmVnaW9uQnVja2V0VVJMJywgeyB2YWx1ZTogYnVja2V0V2l0aFJlZ2lvbi50cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdCh1bmRlZmluZWQsIHsgZHVhbFN0YWNrOiB0cnVlIH0pIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdPdXRwdXRzJzoge1xuICAgICAgICAnQnVja2V0VVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLnMzLWFjY2VsZXJhdGUuZHVhbHN0YWNrLmFtYXpvbmF3cy5jb20vJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015RmlsZVVSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy5zMy1hY2NlbGVyYXRlLmR1YWxzdGFjay5hbWF6b25hd3MuY29tL215L2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1lvdXJGaWxlVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLnMzLWFjY2VsZXJhdGUuZHVhbHN0YWNrLmFtYXpvbmF3cy5jb20veW91ci9maWxlLnR4dCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdSZWdpb25CdWNrZXRVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzogJ2h0dHBzOi8vZXhwbGljaXQtcmVnaW9uLWJ1Y2tldC5zMy1hY2NlbGVyYXRlLmR1YWxzdGFjay5hbWF6b25hd3MuY29tLycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBpbnRlbGxpZ2VudCB0aWVyaW5nIHR1cm5lZCBvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uczogW3tcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnSW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnSWQnOiAnZm9vJyxcbiAgICAgICAgICAgICAgICAnU3RhdHVzJzogJ0VuYWJsZWQnLFxuICAgICAgICAgICAgICAgICdUaWVyaW5ncyc6IFtdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBpbnRlbGxpZ2VudCB0aWVyaW5nIHR1cm5lZCBvbiB3aXRoIGFyY2hpdmUgYWNjZXNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zOiBbe1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgYXJjaGl2ZUFjY2Vzc1RpZXJUaW1lOiBjZGsuRHVyYXRpb24uZGF5cyg5MCksXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnSW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnSWQnOiAnZm9vJyxcbiAgICAgICAgICAgICAgICAnU3RhdHVzJzogJ0VuYWJsZWQnLFxuICAgICAgICAgICAgICAgICdUaWVyaW5ncyc6IFt7XG4gICAgICAgICAgICAgICAgICAnQWNjZXNzVGllcic6ICdBUkNISVZFX0FDQ0VTUycsXG4gICAgICAgICAgICAgICAgICAnRGF5cyc6IDkwLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBpbnRlbGxpZ2VudCB0aWVyaW5nIHR1cm5lZCBvbiB3aXRoIGRlZXAgYXJjaGl2ZSBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgaW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnM6IFt7XG4gICAgICAgIG5hbWU6ICdmb28nLFxuICAgICAgICBkZWVwQXJjaGl2ZUFjY2Vzc1RpZXJUaW1lOiBjZGsuRHVyYXRpb24uZGF5cygxODApLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0ludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0lkJzogJ2ZvbycsXG4gICAgICAgICAgICAgICAgJ1N0YXR1cyc6ICdFbmFibGVkJyxcbiAgICAgICAgICAgICAgICAnVGllcmluZ3MnOiBbe1xuICAgICAgICAgICAgICAgICAgJ0FjY2Vzc1RpZXInOiAnREVFUF9BUkNISVZFX0FDQ0VTUycsXG4gICAgICAgICAgICAgICAgICAnRGF5cyc6IDE4MCxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggaW50ZWxsaWdlbnQgdGllcmluZyB0dXJuZWQgb24gd2l0aCBhbGwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uczogW3tcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHByZWZpeDogJ2JhcicsXG4gICAgICAgIGFyY2hpdmVBY2Nlc3NUaWVyVGltZTogY2RrLkR1cmF0aW9uLmRheXMoOTApLFxuICAgICAgICBkZWVwQXJjaGl2ZUFjY2Vzc1RpZXJUaW1lOiBjZGsuRHVyYXRpb24uZGF5cygxODApLFxuICAgICAgICB0YWdzOiBbeyBrZXk6ICd0ZXN0JywgdmFsdWU6ICdiYXp6JyB9XSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdJbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdJZCc6ICdmb28nLFxuICAgICAgICAgICAgICAgICdQcmVmaXgnOiAnYmFyJyxcbiAgICAgICAgICAgICAgICAnU3RhdHVzJzogJ0VuYWJsZWQnLFxuICAgICAgICAgICAgICAgICdUYWdGaWx0ZXJzJzogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnS2V5JzogJ3Rlc3QnLFxuICAgICAgICAgICAgICAgICAgICAnVmFsdWUnOiAnYmF6eicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ1RpZXJpbmdzJzogW3tcbiAgICAgICAgICAgICAgICAgICdBY2Nlc3NUaWVyJzogJ0FSQ0hJVkVfQUNDRVNTJyxcbiAgICAgICAgICAgICAgICAgICdEYXlzJzogOTAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWNjZXNzVGllcic6ICdERUVQX0FSQ0hJVkVfQUNDRVNTJyxcbiAgICAgICAgICAgICAgICAgICdEYXlzJzogMTgwLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFdmVudCBCcmlkZ2Ugbm90aWZpY2F0aW9uIGNhbiBiZSBlbmFibGVkIGFmdGVyIHRoZSBidWNrZXQgaXMgY3JlYXRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBidWNrZXQuZW5hYmxlRXZlbnRCcmlkZ2VOb3RpZmljYXRpb24oKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OlMzQnVja2V0Tm90aWZpY2F0aW9ucycsIHtcbiAgICAgIE5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRXZlbnRCcmlkZ2VDb25maWd1cmF0aW9uOiB7fSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=