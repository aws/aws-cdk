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
            bucketName: cdk.Token.asString(5),
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
        cdk_build_tools_1.testDeprecated('new bucketWebsiteUrl format with explicit bucketWebsiteNewUrlFormat', () => {
            const stack = new cdk.Stack(undefined, undefined, {
                env: { region: 'us-east-1' },
            });
            const bucket = s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
                bucketName: 'mybucket',
                bucketWebsiteNewUrlFormat: true,
            });
            expect(bucket.bucketWebsiteUrl).toEqual('http://mybucket.s3-website.us-east-1.amazonaws.com');
        });
        cdk_build_tools_1.testDeprecated('old bucketWebsiteUrl format with explicit bucketWebsiteNewUrlFormat', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidWNrZXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUF5QjtBQUN6QixvREFBbUU7QUFDbkUsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLDZCQUE2QjtBQUU3QiwrQ0FBK0M7QUFDL0MsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsV0FBVyxFQUFFO2dCQUNYLGtCQUFrQixFQUFFO29CQUNsQixNQUFNLEVBQUUsaUJBQWlCO29CQUN6QixnQkFBZ0IsRUFBRSxRQUFRO29CQUMxQixxQkFBcUIsRUFBRSxRQUFRO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQy9ELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQy9CLFVBQVUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFD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LGdCQUFnQjt3Q0FDOUIsTUFBTSxFQUFFLEVBQUU7cUNBQ1g7b0NBQ0Q7d0NBQ0UsWUFBWSxFQUFFLHFCQUFxQjt3Q0FDbkMsTUFBTSxFQUFFLEdBQUc7cUNBQ1osQ0FBQzs2QkFDSDt5QkFDRjtxQkFDRjtvQkFDRCxnQkFBZ0IsRUFBRSxRQUFRO29CQUMxQixxQkFBcUIsRUFBRSxRQUFRO2lCQUNoQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQ2hGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLDZCQUE2QixFQUFFLENBQUM7UUFFdkMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsK0JBQStCLEVBQUU7WUFDL0UseUJBQXlCLEVBQUU7Z0JBQ3pCLHdCQUF3QixFQUFFLEVBQUU7YUFDN0I7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRU9MIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnLi4vbGliJztcblxuLy8gdG8gbWFrZSBpdCBlYXN5IHRvIGNvcHkgJiBwYXN0ZSBmcm9tIG91dHB1dDpcbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdidWNrZXQnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgYnVja2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDRk4gcHJvcGVydGllcyBhcmUgdHlwZS12YWxpZGF0ZWQgZHVyaW5nIHJlc29sdXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogY2RrLlRva2VuLmFzU3RyaW5nKDUpLCAvLyBPaCBub1xuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCk7XG4gICAgfSkudG9UaHJvdygvYnVja2V0TmFtZTogNSBzaG91bGQgYmUgYSBzdHJpbmcvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGhvdXQgZW5jcnlwdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVELFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggbWFuYWdlZCBlbmNyeXB0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TX01BTkFHRUQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0J1Y2tldEVuY3J5cHRpb24nOiB7XG4gICAgICAgICAgICAgICdTZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24nOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0Jzoge1xuICAgICAgICAgICAgICAgICAgICAnU1NFQWxnb3JpdGhtJzogJ2F3czprbXMnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZCBidWNrZXQgbmFtZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdhYmMueHl6LTM0YWInLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDInLCB7XG4gICAgICBidWNrZXROYW1lOiAnMTI0LnBwLS0zMycsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB2YWxpZGF0aW9uIHNraXBzIHRva2VuaXplZCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogY2RrLkxhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ19CVUNLRVQnIH0pLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aXRoIG1lc3NhZ2Ugb24gaW52YWxpZCBidWNrZXQgbmFtZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gYC1idWNrRXQuLSR7bmV3IEFycmF5KDY1KS5qb2luKCckJyl9YDtcbiAgICBjb25zdCBleHBlY3RlZEVycm9ycyA9IFtcbiAgICAgIGBJbnZhbGlkIFMzIGJ1Y2tldCBuYW1lICh2YWx1ZTogJHtidWNrZXR9KWAsXG4gICAgICAnQnVja2V0IG5hbWUgbXVzdCBiZSBhdCBsZWFzdCAzIGFuZCBubyBtb3JlIHRoYW4gNjMgY2hhcmFjdGVycycsXG4gICAgICAnQnVja2V0IG5hbWUgbXVzdCBvbmx5IGNvbnRhaW4gbG93ZXJjYXNlIGNoYXJhY3RlcnMgYW5kIHRoZSBzeW1ib2xzLCBwZXJpb2QgKC4pIGFuZCBkYXNoICgtKSAob2Zmc2V0OiA1KScsXG4gICAgICAnQnVja2V0IG5hbWUgbXVzdCBzdGFydCBhbmQgZW5kIHdpdGggYSBsb3dlcmNhc2UgY2hhcmFjdGVyIG9yIG51bWJlciAob2Zmc2V0OiAwKScsXG4gICAgICBgQnVja2V0IG5hbWUgbXVzdCBzdGFydCBhbmQgZW5kIHdpdGggYSBsb3dlcmNhc2UgY2hhcmFjdGVyIG9yIG51bWJlciAob2Zmc2V0OiAke2J1Y2tldC5sZW5ndGggLSAxfSlgLFxuICAgICAgJ0J1Y2tldCBuYW1lIG11c3Qgbm90IGhhdmUgZGFzaCBuZXh0IHRvIHBlcmlvZCwgb3IgcGVyaW9kIG5leHQgdG8gZGFzaCwgb3IgY29uc2VjdXRpdmUgcGVyaW9kcyAob2Zmc2V0OiA3KScsXG4gICAgXS5qb2luKEVPTCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogYnVja2V0LFxuICAgIH0pKS50b1Rocm93KGV4cGVjdGVkRXJyb3JzKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgYnVja2V0IG5hbWUgaGFzIGxlc3MgdGhhbiAzIG9yIG1vcmUgdGhhbiA2MyBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDEnLCB7XG4gICAgICBidWNrZXROYW1lOiAnYScsXG4gICAgfSkpLnRvVGhyb3coL2F0IGxlYXN0IDMvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQyJywge1xuICAgICAgYnVja2V0TmFtZTogbmV3IEFycmF5KDY1KS5qb2luKCd4JyksXG4gICAgfSkpLnRvVGhyb3coL25vIG1vcmUgdGhhbiA2My8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBidWNrZXQgbmFtZSBoYXMgaW52YWxpZCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDEnLCB7XG4gICAgICBidWNrZXROYW1lOiAnYkBja2V0JyxcbiAgICB9KSkudG9UaHJvdygvb2Zmc2V0OiAxLyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MicsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdidWNLZXQnLFxuICAgIH0pKS50b1Rocm93KC9vZmZzZXQ6IDMvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQzJywge1xuICAgICAgYnVja2V0TmFtZTogJ2J1xI1rZXQnLFxuICAgIH0pKS50b1Rocm93KC9vZmZzZXQ6IDIvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgYnVja2V0IG5hbWUgZG9lcyBub3Qgc3RhcnQgb3IgZW5kIHdpdGggbG93ZXJjYXNlIGNoYXJhY3RlciBvciBudW1iZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MScsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICctdWNrZXQnLFxuICAgIH0pKS50b1Rocm93KC9vZmZzZXQ6IDAvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQyJywge1xuICAgICAgYnVja2V0TmFtZTogJ2J1Y2tlLicsXG4gICAgfSkpLnRvVGhyb3coL29mZnNldDogNS8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBvbmx5IGlmIGJ1Y2tldCBuYW1lIGhhcyB0aGUgY29uc2VjdXRpdmUgc3ltYm9scyAoLi4pLCAoLi0pLCAoLS4pJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDEnLCB7XG4gICAgICBidWNrZXROYW1lOiAnYnVjLi5rZXQnLFxuICAgIH0pKS50b1Rocm93KC9vZmZzZXQ6IDMvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQyJywge1xuICAgICAgYnVja2V0TmFtZTogJ2J1Y2suLWV0JyxcbiAgICB9KSkudG9UaHJvdygvb2Zmc2V0OiA0Lyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0MycsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdiLS51Y2tldCcsXG4gICAgfSkpLnRvVGhyb3coL29mZnNldDogMS8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDQnLCB7XG4gICAgICBidWNrZXROYW1lOiAnYnUtLWNrZXQnLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBvbmx5IGlmIGJ1Y2tldCBuYW1lIHJlc2VtYmxlcyBJUCBhZGRyZXNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDEnLCB7XG4gICAgICBidWNrZXROYW1lOiAnMS4yLjMuNCcsXG4gICAgfSkpLnRvVGhyb3coL211c3Qgbm90IHJlc2VtYmxlIGFuIElQIGFkZHJlc3MvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQyJywge1xuICAgICAgYnVja2V0TmFtZTogJzEuMi4zJyxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQzJywge1xuICAgICAgYnVja2V0TmFtZTogJzEuMi4zLmEnLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldDQnLCB7XG4gICAgICBidWNrZXROYW1lOiAnMTAwMC4yLjMuNCcsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGVuY3J5cHRpb24ga2V5IGlzIHVzZWQgd2l0aCBtYW5hZ2VkIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbXlLZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRCxcbiAgICAgIGVuY3J5cHRpb25LZXk6IG15S2V5LFxuICAgIH0pKS50b1Rocm93KC9lbmNyeXB0aW9uS2V5IGlzIHNwZWNpZmllZCwgc28gJ2VuY3J5cHRpb24nIG11c3QgYmUgc2V0IHRvIEtNUy8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBlbmNyeXB0aW9uIGtleSBpcyB1c2VkIHdpdGggZW5jcnlwdGlvbiBzZXQgdG8gdW5lbmNyeXB0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbXlLZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCxcbiAgICAgIGVuY3J5cHRpb25LZXk6IG15S2V5LFxuICAgIH0pKS50b1Rocm93KC9lbmNyeXB0aW9uS2V5IGlzIHNwZWNpZmllZCwgc28gJ2VuY3J5cHRpb24nIG11c3QgYmUgc2V0IHRvIEtNUy8pO1xuICB9KTtcblxuICB0ZXN0KCdlbmNyeXB0aW9uS2V5IGNhbiBzcGVjaWZ5IGttcyBrZXknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHsgZGVzY3JpcHRpb246ICdoZWxsbywgd29ybGQnIH0pO1xuXG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uS2V5LCBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OktNUzo6S2V5JywgMSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgJ0J1Y2tldEVuY3J5cHRpb24nOiB7XG4gICAgICAgICdTZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0Jzoge1xuICAgICAgICAgICAgICAnS01TTWFzdGVyS2V5SUQnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlLZXk2QUIyOUZBNicsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnU1NFQWxnb3JpdGhtJzogJ2F3czprbXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5mb3JjZVNzbCBjYW4gYmUgZW5hYmxlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuZm9yY2VTU0w6IHRydWUgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICAgICdNeUJ1Y2tldFBvbGljeUU3RkJBQzdCJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQnVja2V0Jzoge1xuICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3MzOionLFxuICAgICAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0Jvb2wnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ2F3czpTZWN1cmVUcmFuc3BvcnQnOiAnZmFsc2UnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnRGVueScsXG4gICAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdC5lYWNoKFtzMy5CdWNrZXRFbmNyeXB0aW9uLktNUywgczMuQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRF0pKCdidWNrZXRLZXlFbmFibGVkIGNhbiBiZSBlbmFibGVkIHdpdGggJXAgZW5jcnlwdGlvbicsIChlbmNyeXB0aW9uKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGJ1Y2tldEtleUVuYWJsZWQ6IHRydWUsIGVuY3J5cHRpb24gfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgJ0J1Y2tldEVuY3J5cHRpb24nOiB7XG4gICAgICAgICdTZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0J1Y2tldEtleUVuYWJsZWQnOiB0cnVlLFxuICAgICAgICAgICAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uQnlEZWZhdWx0JzogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICdTU0VBbGdvcml0aG0nOiAnYXdzOmttcycsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGVycm9yIGlmIGJ1Y2tldEtleUVuYWJsZWQgaXMgc2V0LCBidXQgZW5jcnlwdGlvbiBpcyBub3QgS01TJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgYnVja2V0S2V5RW5hYmxlZDogdHJ1ZSwgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5TM19NQU5BR0VEIH0pO1xuICAgIH0pLnRvVGhyb3coXCJidWNrZXRLZXlFbmFibGVkIGlzIHNwZWNpZmllZCwgc28gJ2VuY3J5cHRpb24nIG11c3QgYmUgc2V0IHRvIEtNUyAodmFsdWU6IFMzX01BTkFHRUQpXCIpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQzJywgeyBidWNrZXRLZXlFbmFibGVkOiB0cnVlIH0pO1xuICAgIH0pLnRvVGhyb3coXCJidWNrZXRLZXlFbmFibGVkIGlzIHNwZWNpZmllZCwgc28gJ2VuY3J5cHRpb24nIG11c3QgYmUgc2V0IHRvIEtNUyAodmFsdWU6IFVORU5DUllQVEVEKVwiKTtcblxuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlbGYsIG5vIGVuY3J5cHRpb24gZG9lcyBub3QgdGhyb3cgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCwgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ3Rlc3QnIH0pO1xuICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZWxmLCBTMyBlbmNyeXB0aW9uIGRvZXMgbm90IHRocm93IGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCwgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ3Rlc3QnIH0pO1xuICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZWxmLCBLTVNfTUFOQUdFRCBlbmNyeXB0aW9uIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNU19NQU5BR0VELCBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAndGVzdCcgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZWxmLCBLTVMgZW5jcnlwdGlvbiB3aXRob3V0IGtleSB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMsIHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg6ICd0ZXN0JyB9KTtcbiAgICB9KS50b1Rocm93KC9TU0UtUzMgaXMgdGhlIG9ubHkgc3VwcG9ydGVkIGRlZmF1bHQgYnVja2V0IGVuY3J5cHRpb24gZm9yIFNlcnZlciBBY2Nlc3MgTG9nZ2luZyB0YXJnZXQgYnVja2V0cy8pO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIHRvIHNlbGYsIEtNUyBlbmNyeXB0aW9uIHdpdGgga2V5IHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ1Rlc3RLZXknKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uS2V5OiBrZXksIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TLCBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAndGVzdCcgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZWxmLCBLTVMga2V5IHdpdGggbm8gc3BlY2lmaWMgZW5jcnlwdGlvbiBzcGVjaWZpZWQgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnVGVzdEtleScpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb25LZXk6IGtleSwgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ3Rlc3QnIH0pO1xuICAgIH0pLnRvVGhyb3coL1NTRS1TMyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgZGVmYXVsdCBidWNrZXQgZW5jcnlwdGlvbiBmb3IgU2VydmVyIEFjY2VzcyBMb2dnaW5nIHRhcmdldCBidWNrZXRzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgdG8gc2VwYXJhdGUgYnVja2V0LCBubyBlbmNyeXB0aW9uIGRvZXMgbm90IHRocm93IGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGxvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICd0ZXN0TG9nQnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ6IGxvZ0J1Y2tldCB9KTtcbiAgICB9KS5ub3QudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgdG8gc2VwYXJhdGUgYnVja2V0LCBTMyBlbmNyeXB0aW9uIGRvZXMgbm90IHRocm93IGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGxvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICd0ZXN0TG9nQnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlMzX01BTkFHRUQgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogbG9nQnVja2V0IH0pO1xuICAgIH0pLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgLy8gV2hlbiBwcm92aWRlZCBhbiBleHRlcm5hbCBidWNrZXQgKGFzIGFuIElCdWNrZXQpLCB3ZSBjYW5ub3QgZGV0ZWN0IEtNU19NQU5BR0VEIGVuY3J5cHRpb24uIFNpbmNlIHRoaXNcbiAgLy8gY2hlY2sgaXMgaW1wb3NzaWJsZSwgd2Ugc2tpcCB0aGlzdCB0ZXN0LlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC9uby1kaXNhYmxlZC10ZXN0c1xuICB0ZXN0LnNraXAoJ2xvZ3MgdG8gc2VwYXJhdGUgYnVja2V0LCBLTVNfTUFOQUdFRCBlbmNyeXB0aW9uIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBsb2dCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAndGVzdExvZ0J1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVNfTUFOQUdFRCB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBsb2dCdWNrZXQgfSk7XG4gICAgfSkudG9UaHJvdygvU1NFLVMzIGlzIHRoZSBvbmx5IHN1cHBvcnRlZCBkZWZhdWx0IGJ1Y2tldCBlbmNyeXB0aW9uIGZvciBTZXJ2ZXIgQWNjZXNzIExvZ2dpbmcgdGFyZ2V0IGJ1Y2tldHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyB0byBzZXBhcmF0ZSBidWNrZXQsIEtNUyBlbmNyeXB0aW9uIHdpdGhvdXQga2V5IHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBsb2dCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAndGVzdExvZ0J1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogbG9nQnVja2V0IH0pO1xuICAgIH0pLnRvVGhyb3coL1NTRS1TMyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgZGVmYXVsdCBidWNrZXQgZW5jcnlwdGlvbiBmb3IgU2VydmVyIEFjY2VzcyBMb2dnaW5nIHRhcmdldCBidWNrZXRzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgdG8gc2VwYXJhdGUgYnVja2V0LCBLTVMgZW5jcnlwdGlvbiB3aXRoIGtleSB0aHJvd3MgZXJyb3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdUZXN0S2V5Jyk7XG4gICAgY29uc3QgbG9nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ3Rlc3RMb2dCdWNrZXQnLCB7IGVuY3J5cHRpb25LZXk6IGtleSwgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogbG9nQnVja2V0IH0pO1xuICAgIH0pLnRvVGhyb3coL1NTRS1TMyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgZGVmYXVsdCBidWNrZXQgZW5jcnlwdGlvbiBmb3IgU2VydmVyIEFjY2VzcyBMb2dnaW5nIHRhcmdldCBidWNrZXRzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgdG8gc2VwYXJhdGUgYnVja2V0LCBLTVMga2V5IHdpdGggbm8gc3BlY2lmaWMgZW5jcnlwdGlvbiBzcGVjaWZpZWQgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnVGVzdEtleScpO1xuICAgIGNvbnN0IGxvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICd0ZXN0TG9nQnVja2V0JywgeyBlbmNyeXB0aW9uS2V5OiBrZXkgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogbG9nQnVja2V0IH0pO1xuICAgIH0pLnRvVGhyb3coL1NTRS1TMyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgZGVmYXVsdCBidWNrZXQgZW5jcnlwdGlvbiBmb3IgU2VydmVyIEFjY2VzcyBMb2dnaW5nIHRhcmdldCBidWNrZXRzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIHZlcnNpb25pbmcgdHVybmVkIG9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIHZlcnNpb25lZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnVmVyc2lvbmluZ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICdTdGF0dXMnOiAnRW5hYmxlZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIG9iamVjdCBsb2NrIGVuYWJsZWQgYnV0IG5vIHJldGVudGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgb2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgT2JqZWN0TG9ja0NvbmZpZ3VyYXRpb246IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdvYmplY3QgbG9jayBkZWZhdWx0cyB0byBkaXNhYmxlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE9iamVjdExvY2tFbmFibGVkOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnb2JqZWN0IGxvY2sgZGVmYXVsdHMgdG8gZW5hYmxlZCB3aGVuIGRlZmF1bHQgcmV0ZW50aW9uIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb246IHMzLk9iamVjdExvY2tSZXRlbnRpb24uZ292ZXJuYW5jZShjZGsuRHVyYXRpb24uZGF5cyg3ICogMzY1KSksXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgT2JqZWN0TG9ja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6ICdFbmFibGVkJyxcbiAgICAgICAgUnVsZToge1xuICAgICAgICAgIERlZmF1bHRSZXRlbnRpb246IHtcbiAgICAgICAgICAgIE1vZGU6ICdHT1ZFUk5BTkNFJyxcbiAgICAgICAgICAgIERheXM6IDcgKiAzNjUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIG9iamVjdCBsb2NrIGVuYWJsZWQgd2l0aCBnb3Zlcm5hbmNlIHJldGVudGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgb2JqZWN0TG9ja0VuYWJsZWQ6IHRydWUsXG4gICAgICBvYmplY3RMb2NrRGVmYXVsdFJldGVudGlvbjogczMuT2JqZWN0TG9ja1JldGVudGlvbi5nb3Zlcm5hbmNlKGNkay5EdXJhdGlvbi5kYXlzKDEpKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBPYmplY3RMb2NrRW5hYmxlZDogdHJ1ZSxcbiAgICAgIE9iamVjdExvY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIE9iamVjdExvY2tFbmFibGVkOiAnRW5hYmxlZCcsXG4gICAgICAgIFJ1bGU6IHtcbiAgICAgICAgICBEZWZhdWx0UmV0ZW50aW9uOiB7XG4gICAgICAgICAgICBNb2RlOiAnR09WRVJOQU5DRScsXG4gICAgICAgICAgICBEYXlzOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBvYmplY3QgbG9jayBlbmFibGVkIHdpdGggY29tcGxpYW5jZSByZXRlbnRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgIG9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb246IHMzLk9iamVjdExvY2tSZXRlbnRpb24uY29tcGxpYW5jZShjZGsuRHVyYXRpb24uZGF5cygxKSksXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIE9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgT2JqZWN0TG9ja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgT2JqZWN0TG9ja0VuYWJsZWQ6ICdFbmFibGVkJyxcbiAgICAgICAgUnVsZToge1xuICAgICAgICAgIERlZmF1bHRSZXRlbnRpb246IHtcbiAgICAgICAgICAgIE1vZGU6ICdDT01QTElBTkNFJyxcbiAgICAgICAgICAgIERheXM6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIG9iamVjdCBsb2NrIGRpc2FibGVkIHRocm93cyBlcnJvciB3aXRoIHJldGVudGlvbiBzZXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBvYmplY3RMb2NrRW5hYmxlZDogZmFsc2UsXG4gICAgICBvYmplY3RMb2NrRGVmYXVsdFJldGVudGlvbjogczMuT2JqZWN0TG9ja1JldGVudGlvbi5nb3Zlcm5hbmNlKGNkay5EdXJhdGlvbi5kYXlzKDEpKSxcbiAgICB9KSkudG9UaHJvdygnT2JqZWN0IExvY2sgbXVzdCBiZSBlbmFibGVkIHRvIGNvbmZpZ3VyZSBkZWZhdWx0IHJldGVudGlvbiBzZXR0aW5ncycpO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBvYmplY3QgbG9jayByZXF1aXJlcyBkdXJhdGlvbiB0aGFuIG9uZSBkYXknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBvYmplY3RMb2NrRW5hYmxlZDogdHJ1ZSxcbiAgICAgIG9iamVjdExvY2tEZWZhdWx0UmV0ZW50aW9uOiBzMy5PYmplY3RMb2NrUmV0ZW50aW9uLmdvdmVybmFuY2UoY2RrLkR1cmF0aW9uLmRheXMoMCkpLFxuICAgIH0pKS50b1Rocm93KCdPYmplY3QgTG9jayByZXRlbnRpb24gZHVyYXRpb24gbXVzdCBiZSBhdCBsZWFzdCAxIGRheScpO1xuICB9KTtcblxuICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9vYmplY3QtbG9jay1tYW5hZ2luZy5odG1sI29iamVjdC1sb2NrLW1hbmFnaW5nLXJldGVudGlvbi1saW1pdHNcbiAgdGVzdCgnYnVja2V0IHdpdGggb2JqZWN0IGxvY2sgcmVxdWlyZXMgZHVyYXRpb24gbGVzcyB0aGFuIDEwMCB5ZWFycycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgIG9iamVjdExvY2tFbmFibGVkOiB0cnVlLFxuICAgICAgb2JqZWN0TG9ja0RlZmF1bHRSZXRlbnRpb246IHMzLk9iamVjdExvY2tSZXRlbnRpb24uZ292ZXJuYW5jZShjZGsuRHVyYXRpb24uZGF5cygzNjUgKiAxMDEpKSxcbiAgICB9KSkudG9UaHJvdygnT2JqZWN0IExvY2sgcmV0ZW50aW9uIGR1cmF0aW9uIG11c3QgYmUgbGVzcyB0aGFuIDEwMCB5ZWFycycpO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBibG9jayBwdWJsaWMgYWNjZXNzIHNldCB0byBCbG9ja0FsbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdQdWJsaWNBY2Nlc3NCbG9ja0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICdCbG9ja1B1YmxpY0FjbHMnOiB0cnVlLFxuICAgICAgICAgICAgICAnQmxvY2tQdWJsaWNQb2xpY3knOiB0cnVlLFxuICAgICAgICAgICAgICAnSWdub3JlUHVibGljQWNscyc6IHRydWUsXG4gICAgICAgICAgICAgICdSZXN0cmljdFB1YmxpY0J1Y2tldHMnOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBibG9jayBwdWJsaWMgYWNjZXNzIHNldCB0byBCbG9ja0FjbHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FDTFMsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1B1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgJ0Jsb2NrUHVibGljQWNscyc6IHRydWUsXG4gICAgICAgICAgICAgICdJZ25vcmVQdWJsaWNBY2xzJzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVja2V0IHdpdGggY3VzdG9tIGJsb2NrIHB1YmxpYyBhY2Nlc3Mgc2V0dGluZycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogbmV3IHMzLkJsb2NrUHVibGljQWNjZXNzKHsgcmVzdHJpY3RQdWJsaWNCdWNrZXRzOiB0cnVlIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdQdWJsaWNBY2Nlc3NCbG9ja0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICdSZXN0cmljdFB1YmxpY0J1Y2tldHMnOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBjdXN0b20gY2FubmVkIGFjY2VzcyBjb250cm9sJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGFjY2Vzc0NvbnRyb2w6IHMzLkJ1Y2tldEFjY2Vzc0NvbnRyb2wuTE9HX0RFTElWRVJZX1dSSVRFLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdBY2Nlc3NDb250cm9sJzogJ0xvZ0RlbGl2ZXJ5V3JpdGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwZXJtaXNzaW9ucycsICgpID0+IHtcblxuICAgIHRlc3QoJ2FkZFBlcm1pc3Npb24gY3JlYXRlcyBhIGJ1Y2tldCBwb2xpY3knLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCB9KTtcblxuICAgICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnZm9vJ10sXG4gICAgICAgIGFjdGlvbnM6IFsnYmFyOmJheiddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnTXlCdWNrZXRQb2xpY3lFN0ZCQUM3Qic6IHtcbiAgICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsXG4gICAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICAgJ0J1Y2tldCc6IHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdiYXI6YmF6JyxcbiAgICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6ICdmb28nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmb3JCdWNrZXQgcmV0dXJucyBhIHBlcm1pc3Npb24gc3RhdGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgYnVja2V0XFwncyBBUk4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEIH0pO1xuXG4gICAgICBjb25zdCB4ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFtidWNrZXQuYnVja2V0QXJuXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QnVja2V0J10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh4LnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICAgIEFjdGlvbjogJ3MzOkxpc3RCdWNrZXQnLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9LFxuICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhcm5Gb3JPYmplY3RzIHJldHVybnMgYSBwZXJtaXNzaW9uIHN0YXRlbWVudCBhc3NvY2lhdGVkIHdpdGggb2JqZWN0cyBpbiB0aGUgYnVja2V0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCB9KTtcblxuICAgICAgY29uc3QgcCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbYnVja2V0LmFybkZvck9iamVjdHMoJ2hlbGxvL3dvcmxkJyldLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBBY3Rpb246ICdzMzpHZXRPYmplY3QnLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9LFxuICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW3sgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSwgJy9oZWxsby93b3JsZCddLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FybkZvck9iamVjdHMgYWNjZXB0cyBtdWx0aXBsZSBhcmd1bWVudHMgYW5kIEZuQ29uY2F0cyB0aGVtJywgKCkgPT4ge1xuXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JywgeyBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVEIH0pO1xuXG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgICBjb25zdCB0ZWFtID0gbmV3IGlhbS5Hcm91cChzdGFjaywgJ015VGVhbScpO1xuXG4gICAgICBjb25zdCByZXNvdXJjZSA9IGJ1Y2tldC5hcm5Gb3JPYmplY3RzKGBob21lLyR7dGVhbS5ncm91cE5hbWV9LyR7dXNlci51c2VyTmFtZX0vKmApO1xuICAgICAgY29uc3QgcCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbcmVzb3VyY2VdLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOkdldE9iamVjdCddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBBY3Rpb246ICdzMzpHZXRPYmplY3QnLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9LFxuICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICcvaG9tZS8nLFxuICAgICAgICAgICAgICB7IFJlZjogJ015VGVhbTAxREQ2Njg1JyB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHsgUmVmOiAnTXlVc2VyREM0NTAyOEInIH0sXG4gICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVtb3ZhbCBwb2xpY3kgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBiZWhhdmlvciB1cG9uIGRlbGV0ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVELFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15QnVja2V0RjY4RjNGRjA6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW1wb3J0L2V4cG9ydCcsICgpID0+IHtcbiAgICB0ZXN0KCdzdGF0aWMgaW1wb3J0KHJlZikgYWxsb3dzIGltcG9ydGluZyBhbiBleHRlcm5hbC9leGlzdGluZyBidWNrZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgYnVja2V0QXJuID0gJ2Fybjphd3M6czM6OjpteS1idWNrZXQnO1xuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRCdWNrZXQnLCB7IGJ1Y2tldEFybiB9KTtcblxuICAgICAgLy8gdGhpcyBpcyBhIG5vLW9wIHNpbmNlIHRoZSBidWNrZXQgaXMgZXh0ZXJuYWxcbiAgICAgIGJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbJ2ZvbyddLFxuICAgICAgICBhY3Rpb25zOiBbJ2JhcjpiYXonXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgfSkpO1xuXG4gICAgICBjb25zdCBwID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFtidWNrZXQuYnVja2V0QXJuXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QnVja2V0J10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBpdCBpcyBwb3NzaWJsZSB0byBvYnRhaW4gYSBwZXJtaXNzaW9uIHN0YXRlbWVudCBmb3IgYSByZWZcbiAgICAgIGV4cGVjdChwLnRvU3RhdGVtZW50SnNvbigpKS50b0VxdWFsKHtcbiAgICAgICAgQWN0aW9uOiAnczM6TGlzdEJ1Y2tldCcsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0sXG4gICAgICAgIFJlc291cmNlOiAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldCcsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGJ1Y2tldC5idWNrZXRBcm4pLnRvRXF1YWwoYnVja2V0QXJuKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXROYW1lKSkudG9FcXVhbCgnbXktYnVja2V0Jyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHt9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ltcG9ydCBkb2VzIG5vdCBjcmVhdGUgYW55IHJlc291cmNlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRCdWNrZXQnLCB7IGJ1Y2tldEFybjogJ2Fybjphd3M6czM6OjpteS1idWNrZXQnIH0pO1xuICAgICAgYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgICAgfSkpO1xuXG4gICAgICAvLyBhdCB0aGlzIHBvaW50IHdlIHRlY2huaWNhbGx5IGRpZG4ndCBjcmVhdGUgYW55IHJlc291cmNlcyBpbiB0aGUgY29uc3VtaW5nIHN0YWNrLlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe30pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaW1wb3J0IGNhbiBhbHNvIGJlIHVzZWQgdG8gaW1wb3J0IGFyYml0cmFyeSBBUk5zJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHsgYnVja2V0QXJuOiAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldCcgfSk7XG4gICAgICBidWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWycqJ10sIGFjdGlvbnM6IFsnKiddIH0pKTtcblxuICAgICAgLy8gYnV0IG5vdyB3ZSBjYW4gcmVmZXJlbmNlIHRoZSBidWNrZXRcbiAgICAgIC8vIHlvdSBjYW4gZXZlbiB1c2UgdGhlIGJ1Y2tldCBuYW1lLCB3aGljaCB3aWxsIGJlIGV4dHJhY3RlZCBmcm9tIHRoZSBhcm4gcHJvdmlkZWQuXG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgICB1c2VyLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbYnVja2V0LmFybkZvck9iamVjdHMoYG15L2ZvbGRlci8ke2J1Y2tldC5idWNrZXROYW1lfWApXSxcbiAgICAgICAgYWN0aW9uczogWydzMzoqJ10sXG4gICAgICB9KSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgICAnTXlVc2VyREM0NTAyOEInOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6VXNlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2Jzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnczM6KicsXG4gICAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnYXJuOmF3czpzMzo6Om15LWJ1Y2tldC9teS9mb2xkZXIvbXktYnVja2V0JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1BvbGljeU5hbWUnOiAnTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2JyxcbiAgICAgICAgICAgICAgJ1VzZXJzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlVc2VyREM0NTAyOEInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ltcG9ydCBjYW4gZXhwbGljaXRseSBzZXQgYnVja2V0IHJlZ2lvbiB3aXRoIGRpZmZlcmVudCBzdWZmaXggdGhhbiBzdGFjaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgcmVnaW9uOiAnY24tbm9ydGgtMScgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215YnVja2V0JyxcbiAgICAgICAgcmVnaW9uOiAnZXUtd2VzdC0xJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmJ1Y2tldFJlZ2lvbmFsRG9tYWluTmFtZSkudG9FcXVhbCgnbXlidWNrZXQuczMuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb20nKTtcbiAgICAgIGV4cGVjdChidWNrZXQuYnVja2V0V2Vic2l0ZURvbWFpbk5hbWUpLnRvRXF1YWwoJ215YnVja2V0LnMzLXdlYnNpdGUtZXUtd2VzdC0xLmFtYXpvbmF3cy5jb20nKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25ldyBidWNrZXRXZWJzaXRlVXJsIGZvcm1hdCBmb3Igc3BlY2lmaWMgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGVudjogeyByZWdpb246ICd1cy1lYXN0LTInIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteWJ1Y2tldCcsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsKS50b0VxdWFsKCdodHRwOi8vbXlidWNrZXQuczMtd2Vic2l0ZS51cy1lYXN0LTIuYW1hem9uYXdzLmNvbScpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbmV3IGJ1Y2tldFdlYnNpdGVVcmwgZm9ybWF0IGZvciBzcGVjaWZpYyByZWdpb24gd2l0aCBjbiBzdWZmaXgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IHJlZ2lvbjogJ2NuLW5vcnRoLTEnIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRCdWNrZXQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6ICdteWJ1Y2tldCcsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KGJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsKS50b0VxdWFsKCdodHRwOi8vbXlidWNrZXQuczMtd2Vic2l0ZS5jbi1ub3J0aC0xLmFtYXpvbmF3cy5jb20uY24nKTtcbiAgICB9KTtcblxuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ25ldyBidWNrZXRXZWJzaXRlVXJsIGZvcm1hdCB3aXRoIGV4cGxpY2l0IGJ1Y2tldFdlYnNpdGVOZXdVcmxGb3JtYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZEJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215YnVja2V0JyxcbiAgICAgICAgYnVja2V0V2Vic2l0ZU5ld1VybEZvcm1hdDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmJ1Y2tldFdlYnNpdGVVcmwpLnRvRXF1YWwoJ2h0dHA6Ly9teWJ1Y2tldC5zMy13ZWJzaXRlLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0RGVwcmVjYXRlZCgnb2xkIGJ1Y2tldFdlYnNpdGVVcmwgZm9ybWF0IHdpdGggZXhwbGljaXQgYnVja2V0V2Vic2l0ZU5ld1VybEZvcm1hdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgICBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0yJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQnVja2V0Jywge1xuICAgICAgICBidWNrZXROYW1lOiAnbXlidWNrZXQnLFxuICAgICAgICBidWNrZXRXZWJzaXRlTmV3VXJsRm9ybWF0OiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoYnVja2V0LmJ1Y2tldFdlYnNpdGVVcmwpLnRvRXF1YWwoJ2h0dHA6Ly9teWJ1Y2tldC5zMy13ZWJzaXRlLXVzLWVhc3QtMi5hbWF6b25hd3MuY29tJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbXBvcnQgbmVlZHMgdG8gc3BlY2lmeSBhIHZhbGlkIGJ1Y2tldCBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ015QnVja2V0MycsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ2Fybjphd3M6czM6OjpleGFtcGxlLWNvbScsXG4gICAgICB9KSkudG9UaHJvdygpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZnJvbUNmbkJ1Y2tldCgpJywgKCkgPT4ge1xuICAgIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICAgIGxldCBjZm5CdWNrZXQ6IHMzLkNmbkJ1Y2tldDtcbiAgICBsZXQgYnVja2V0OiBzMy5JQnVja2V0O1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNmbkJ1Y2tldCA9IG5ldyBzMy5DZm5CdWNrZXQoc3RhY2ssICdDZm5CdWNrZXQnKTtcbiAgICAgIGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQ2ZuQnVja2V0KGNmbkJ1Y2tldCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwiY29ycmVjdGx5IHJlc29sdmVzIHRoZSAnYnVja2V0TmFtZScgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldE5hbWUpKS50b1N0cmljdEVxdWFsKHtcbiAgICAgICAgUmVmOiAnQ2ZuQnVja2V0JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdChcImNvcnJlY3RseSByZXNvbHZlcyB0aGUgJ2J1Y2tldEFybicgcHJvcGVydHlcIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldEFybikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2ZuQnVja2V0JywgJ0FybiddLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3Mgc2V0dGluZyB0aGUgUmVtb3ZhbFBvbGljeSBvZiB0aGUgdW5kZXJseWluZyByZXNvdXJjZScsICgpID0+IHtcbiAgICAgIGJ1Y2tldC5hcHBseVJlbW92YWxQb2xpY3koY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgc2V0cyB0aGUgZGVmYXVsdCBjaGlsZCBvZiB0aGUgcmV0dXJuZWQgTDInLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYnVja2V0Lm5vZGUuZGVmYXVsdENoaWxkKS50b0JlKGNmbkJ1Y2tldCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3MgZ3JhbnRpbmcgcGVybWlzc2lvbnMgdG8gUHJpbmNpcGFscycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICAgIH0pO1xuICAgICAgYnVja2V0LmdyYW50UmVhZChyb2xlKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW3tcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2ZuQnVja2V0JywgJ0FybiddLFxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDZm5CdWNrZXQnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwic2V0cyB0aGUgaXNXZWJzaXRlIHByb3BlcnR5IHRvICdmYWxzZScgaWYgJ3dlYnNpdGVDb25maWd1cmF0aW9uJyBpcyAndW5kZWZpbmVkJ1wiLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9CZUZhbHN5KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwic2V0cyB0aGUgaXNXZWJzaXRlIHByb3BlcnR5IHRvICd0cnVlJyBpZiAnd2Vic2l0ZUNvbmZpZ3VyYXRpb24nIGlzIG5vdCAndW5kZWZpbmVkJ1wiLCAoKSA9PiB7XG4gICAgICBjZm5CdWNrZXQgPSBuZXcgczMuQ2ZuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZUNmbkJ1Y2tldCcsIHtcbiAgICAgICAgd2Vic2l0ZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBpbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQ2ZuQnVja2V0KGNmbkJ1Y2tldCk7XG5cbiAgICAgIGV4cGVjdChidWNrZXQuaXNXZWJzaXRlKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3MgZ3JhbnRpbmcgcHVibGljIGFjY2VzcyBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgYWxsb3cgZ3JhbnRpbmcgcHVibGljIGFjY2VzcyBmb3IgYSBCdWNrZXQgdGhhdCBibG9ja3MgaXQnLCAoKSA9PiB7XG4gICAgICBjZm5CdWNrZXQgPSBuZXcgczMuQ2ZuQnVja2V0KHN0YWNrLCAnQmxvY2tlZFB1YmxpY0FjY2Vzc0NmbkJ1Y2tldCcsIHtcbiAgICAgICAgcHVibGljQWNjZXNzQmxvY2tDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgYmxvY2tQdWJsaWNQb2xpY3k6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQ2ZuQnVja2V0KGNmbkJ1Y2tldCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGJ1Y2tldC5ncmFudFB1YmxpY0FjY2VzcygpO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IGdyYW50IHB1YmxpYyBhY2Nlc3Mgd2hlbiAnYmxvY2tQdWJsaWNQb2xpY3knIGlzIGVuYWJsZWQvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvcnJlY3RseSBmaWxscyB0aGUgZW5jcnlwdGlvbiBrZXkgaWYgdGhlIEwxIHJlZmVyZW5jZXMgb25lJywgKCkgPT4ge1xuICAgICAgY29uc3QgY2ZuS2V5ID0gbmV3IGttcy5DZm5LZXkoc3RhY2ssICdDZm5LZXknLCB7XG4gICAgICAgIGtleVBvbGljeToge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2ttczoqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY2ZuQnVja2V0ID0gbmV3IHMzLkNmbkJ1Y2tldChzdGFjaywgJ0ttc0VuY3J5cHRlZENmbkJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0RW5jcnlwdGlvbjoge1xuICAgICAgICAgIHNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGttc01hc3RlcktleUlkOiBjZm5LZXkuYXR0ckFybixcbiAgICAgICAgICAgICAgICBzc2VBbGdvcml0aG06ICdhd3M6a21zJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYnVja2V0ID0gczMuQnVja2V0LmZyb21DZm5CdWNrZXQoY2ZuQnVja2V0KTtcblxuICAgICAgZXhwZWN0KGJ1Y2tldC5lbmNyeXB0aW9uS2V5KS5ub3QudG9CZVVuZGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIGltcG9ydGluZyBhIEJ1Y2tldFBvbGljeSB0aGF0IHJlZmVyZW5jZXMgYSBCdWNrZXQnLCAoKSA9PiB7XG4gICAgICBuZXcgczMuQ2ZuQnVja2V0UG9saWN5KHN0YWNrLCAnQ2ZuQnVja2V0UG9saWN5Jywge1xuICAgICAgICBwb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnczM6KicsXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICdBV1MnOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IFsnKiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICBidWNrZXQ6IGNmbkJ1Y2tldC5yZWYsXG4gICAgICB9KTtcbiAgICAgIGJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgYWN0aW9uczogWydzMzoqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCldLFxuICAgICAgfSkpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0UG9saWN5JywgMik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50UmVhZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdSZWFkZXInKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBidWNrZXQuZ3JhbnRSZWFkKHJlYWRlcik7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ1JlYWRlckY3QkYxODlEJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1JlYWRlckRlZmF1bHRQb2xpY3kxNTFGMzgxOCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnUG9saWN5TmFtZSc6ICdSZWFkZXJEZWZhdWx0UG9saWN5MTUxRjM4MTgnLFxuICAgICAgICAgICAgJ1VzZXJzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdSZWFkZXJGN0JGMTg5RCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdncmFudFJlYWRXcml0ZScsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYmUgdXNlZCB0byBncmFudCByZWNpcHJvY2FsIHBlcm1pc3Npb25zIHRvIGFuIGlkZW50aXR5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICAgIGJ1Y2tldC5ncmFudFJlYWRXcml0ZSh1c2VyKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdNeVVzZXJEQzQ1MDI4Qic6IHtcbiAgICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjYnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOkRlbGV0ZU9iamVjdConLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RUYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpBYm9ydConLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUG9saWN5TmFtZSc6ICdNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjYnLFxuICAgICAgICAgICAgICAnVXNlcnMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVVzZXJEQzQ1MDI4QicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZ3JhbnQgcGVybWlzc2lvbnMgdG8gbm9uLWlkZW50aXR5IHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHsgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5LTVMgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGJ1Y2tldC5ncmFudFJlYWQobmV3IGlhbS5Pcmdhbml6YXRpb25QcmluY2lwYWwoJ28tMTIzNCcpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogWydzMzpHZXRPYmplY3QqJywgJ3MzOkdldEJ1Y2tldConLCAnczM6TGlzdConXSxcbiAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHsgJ1N0cmluZ0VxdWFscyc6IHsgJ2F3czpQcmluY2lwYWxPcmdJRCc6ICdvLTEyMzQnIH0gfSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgeyAnRm46OkpvaW4nOiBbJycsIFt7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sICcvKiddXSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgICAnS2V5UG9saWN5Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogWydrbXM6RGVjcnlwdCcsICdrbXM6RGVzY3JpYmVLZXknXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHsgJ1N0cmluZ0VxdWFscyc6IHsgJ2F3czpQcmluY2lwYWxPcmdJRCc6ICdvLTEyMzQnIH0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSksXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgZ3JhbnQgUHV0T2JqZWN0QWNsIHdoZW4gdGhlIFMzX0dSQU5UX1dSSVRFX1dJVEhPVVRfQUNMIGZlYXR1cmUgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG5cbiAgICAgIGJ1Y2tldC5ncmFudFJlYWRXcml0ZSh1c2VyKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0TGVnYWxIb2xkJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0UmV0ZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFZlcnNpb25UYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAnczM6QWJvcnQqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydNeUJ1Y2tldEY2OEYzRkYwJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdncmFudFdyaXRlJywgKCkgPT4ge1xuICAgIHRlc3QoJ3dpdGggS01TIGtleSBoYXMgYXBwcm9wcmlhdGUgcGVybWlzc2lvbnMgZm9yIG11bHRpcGFydCB1cGxvYWRzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TIH0pO1xuICAgICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuICAgICAgYnVja2V0LmdyYW50V3JpdGUodXNlcik7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6RGVsZXRlT2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdExlZ2FsSG9sZCcsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RWZXJzaW9uVGFnZ2luZycsXG4gICAgICAgICAgICAgICAgJ3MzOkFib3J0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuICAgICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlCdWNrZXRLZXlDMTcxMzBDRicsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgICAnUG9saWN5TmFtZSc6ICdNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjYnLFxuICAgICAgICAnVXNlcnMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVVzZXJEQzQ1MDI4QicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgZ3JhbnQgUHV0T2JqZWN0QWNsIHdoZW4gdGhlIFMzX0dSQU5UX1dSSVRFX1dJVEhPVVRfQUNMIGZlYXR1cmUgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG5cbiAgICAgIGJ1Y2tldC5ncmFudFdyaXRlKHVzZXIpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkRlbGV0ZU9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RUYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpBYm9ydConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015QnVja2V0RjY4RjNGRjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgICAnLyonLFxuICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ3JhbnRQdXQnLCAoKSA9PiB7XG4gICAgdGVzdCgnZG9lcyBub3QgZ3JhbnQgUHV0T2JqZWN0QWNsIHdoZW4gdGhlIFMzX0dSQU5UX1dSSVRFX1dJVEhPVVRfQUNMIGZlYXR1cmUgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG5cbiAgICAgIGJ1Y2tldC5ncmFudFB1dCh1c2VyKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3RUYWdnaW5nJyxcbiAgICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgICAgICAgICAgICdzMzpBYm9ydConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnTXlCdWNrZXRGNjhGM0ZGMCcsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtb3JlIGdyYW50cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uS01TIH0pO1xuICAgIGNvbnN0IHB1dHRlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1B1dHRlcicpO1xuICAgIGNvbnN0IHdyaXRlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1dyaXRlcicpO1xuICAgIGNvbnN0IGRlbGV0ZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdEZWxldGVyJyk7XG5cbiAgICBidWNrZXQuZ3JhbnRQdXQocHV0dGVyKTtcbiAgICBidWNrZXQuZ3JhbnRXcml0ZSh3cml0ZXIpO1xuICAgIGJ1Y2tldC5ncmFudERlbGV0ZShkZWxldGVyKTtcblxuICAgIGNvbnN0IHJlc291cmNlcyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudG9KU09OKCkuUmVzb3VyY2VzO1xuICAgIGNvbnN0IGFjdGlvbnMgPSAoaWQ6IHN0cmluZykgPT4gcmVzb3VyY2VzW2lkXS5Qcm9wZXJ0aWVzLlBvbGljeURvY3VtZW50LlN0YXRlbWVudFswXS5BY3Rpb247XG5cbiAgICBleHBlY3QoYWN0aW9ucygnV3JpdGVyRGVmYXVsdFBvbGljeURDNTg1QkNFJykpLnRvRXF1YWwoW1xuICAgICAgJ3MzOkRlbGV0ZU9iamVjdConLFxuICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAnczM6UHV0T2JqZWN0TGVnYWxIb2xkJyxcbiAgICAgICdzMzpQdXRPYmplY3RSZXRlbnRpb24nLFxuICAgICAgJ3MzOlB1dE9iamVjdFRhZ2dpbmcnLFxuICAgICAgJ3MzOlB1dE9iamVjdFZlcnNpb25UYWdnaW5nJyxcbiAgICAgICdzMzpBYm9ydConLFxuICAgIF0pO1xuICAgIGV4cGVjdChhY3Rpb25zKCdQdXR0ZXJEZWZhdWx0UG9saWN5QUIxMzhERDMnKSkudG9FcXVhbChbXG4gICAgICAnczM6UHV0T2JqZWN0JyxcbiAgICAgICdzMzpQdXRPYmplY3RMZWdhbEhvbGQnLFxuICAgICAgJ3MzOlB1dE9iamVjdFJldGVudGlvbicsXG4gICAgICAnczM6UHV0T2JqZWN0VGFnZ2luZycsXG4gICAgICAnczM6UHV0T2JqZWN0VmVyc2lvblRhZ2dpbmcnLFxuICAgICAgJ3MzOkFib3J0KicsXG4gICAgXSk7XG4gICAgZXhwZWN0KGFjdGlvbnMoJ0RlbGV0ZXJEZWZhdWx0UG9saWN5Q0QzM0I4QTAnKSkudG9FcXVhbCgnczM6RGVsZXRlT2JqZWN0KicpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50RGVsZXRlLCB3aXRoIGEgS01TIEtleScsICgpID0+IHtcbiAgICAvLyBnaXZlblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcbiAgICBjb25zdCBkZWxldGVyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnRGVsZXRlcicpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdteS1idWNrZXQtcGh5c2ljYWwtbmFtZScsXG4gICAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyxcbiAgICB9KTtcblxuICAgIC8vIHdoZW5cbiAgICBidWNrZXQuZ3JhbnREZWxldGUoZGVsZXRlcik7XG5cbiAgICAvLyB0aGVuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjcm9zcy1zdGFjayBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICB0ZXN0KCdpbiB0aGUgc2FtZSBhY2NvdW50IGFuZCByZWdpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2tBID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFja0EnKTtcbiAgICAgIGNvbnN0IGJ1Y2tldEZyb21TdGFja0EgPSBuZXcgczMuQnVja2V0KHN0YWNrQSwgJ015QnVja2V0Jyk7XG5cbiAgICAgIGNvbnN0IHN0YWNrQiA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2tCJyk7XG4gICAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrQiwgJ1VzZXJXaG9OZWVkc0FjY2VzcycpO1xuICAgICAgYnVja2V0RnJvbVN0YWNrQS5ncmFudFJlYWQodXNlcik7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFja0EpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdPdXRwdXRzJzoge1xuICAgICAgICAgICdFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeUJ1Y2tldEY2OEYzRkYwQXJuMEY3RThFNTgnOiB7XG4gICAgICAgICAgICAnVmFsdWUnOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnRXhwb3J0Jzoge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdzdGFja0E6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlCdWNrZXRGNjhGM0ZGMEFybjBGN0U4RTU4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tCKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAgICdVc2VyV2hvTmVlZHNBY2Nlc3NGODk1OUMzRCc6IHtcbiAgICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVc2VyV2hvTmVlZHNBY2Nlc3NEZWZhdWx0UG9saWN5NkE5RUI1MzAnOiB7XG4gICAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdzdGFja0E6RXhwb3J0c091dHB1dEZuR2V0QXR0TXlCdWNrZXRGNjhGM0ZGMEFybjBGN0U4RTU4JyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ3N0YWNrQTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeUJ1Y2tldEY2OEYzRkYwQXJuMEY3RThFNTgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1BvbGljeU5hbWUnOiAnVXNlcldob05lZWRzQWNjZXNzRGVmYXVsdFBvbGljeTZBOUVCNTMwJyxcbiAgICAgICAgICAgICAgJ1VzZXJzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnVXNlcldob05lZWRzQWNjZXNzRjg5NTlDM0QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2luIGRpZmZlcmVudCBhY2NvdW50cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFja0EgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrQScsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0gfSk7XG4gICAgICBjb25zdCBidWNrZXRGcm9tU3RhY2tBID0gbmV3IHMzLkJ1Y2tldChzdGFja0EsICdNeUJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215LWJ1Y2tldC1waHlzaWNhbC1uYW1lJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFja0IgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrQicsIHsgZW52OiB7IGFjY291bnQ6ICcyMzQ1Njc4OTAxMjMnIH0gfSk7XG4gICAgICBjb25zdCByb2xlRnJvbVN0YWNrQiA9IG5ldyBpYW0uUm9sZShzdGFja0IsICdNeVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcyMzQ1Njc4OTAxMjMnKSxcbiAgICAgICAgcm9sZU5hbWU6ICdNeVJvbGVQaHlzaWNhbE5hbWUnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGJ1Y2tldEZyb21TdGFja0EuZ3JhbnRSZWFkKHJvbGVGcm9tU3RhY2tCKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrQSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAnQVdTJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjoyMzQ1Njc4OTAxMjM6cm9sZS9NeVJvbGVQaHlzaWNhbE5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tCKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpzMzo6Om15LWJ1Y2tldC1waHlzaWNhbC1uYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpzMzo6Om15LWJ1Y2tldC1waHlzaWNhbC1uYW1lLyonLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpbiBkaWZmZXJlbnQgYWNjb3VudHMsIHdpdGggYSBLTVMgS2V5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrQSA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnU3RhY2tBJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSB9KTtcbiAgICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrQSwgJ015S2V5Jyk7XG4gICAgICBjb25zdCBidWNrZXRGcm9tU3RhY2tBID0gbmV3IHMzLkJ1Y2tldChzdGFja0EsICdNeUJ1Y2tldCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215LWJ1Y2tldC1waHlzaWNhbC1uYW1lJyxcbiAgICAgICAgZW5jcnlwdGlvbktleToga2V5LFxuICAgICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLktNUyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzdGFja0IgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrQicsIHsgZW52OiB7IGFjY291bnQ6ICcyMzQ1Njc4OTAxMjMnIH0gfSk7XG4gICAgICBjb25zdCByb2xlRnJvbVN0YWNrQiA9IG5ldyBpYW0uUm9sZShzdGFja0IsICdNeVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcyMzQ1Njc4OTAxMjMnKSxcbiAgICAgICAgcm9sZU5hbWU6ICdNeVJvbGVQaHlzaWNhbE5hbWUnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGJ1Y2tldEZyb21TdGFja0EuZ3JhbnRSZWFkKHJvbGVGcm9tU3RhY2tCKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrQSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgICAnS2V5UG9saWN5Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOmlhbTo6MjM0NTY3ODkwMTIzOnJvbGUvTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFja0IpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgICAna21zOkRlc2NyaWJlS2V5JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VybEZvck9iamVjdCByZXR1cm5zIGEgdG9rZW4gd2l0aCB0aGUgUzMgVVJMIG9mIHRoZSB0b2tlbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBjb25zdCBidWNrZXRXaXRoUmVnaW9uID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnUmVnaW9uYWxCdWNrZXQnLCB7XG4gICAgICBidWNrZXRBcm46ICdhcm46YXdzOnMzOjo6ZXhwbGljaXQtcmVnaW9uLWJ1Y2tldCcsXG4gICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdCdWNrZXRVUkwnLCB7IHZhbHVlOiBidWNrZXQudXJsRm9yT2JqZWN0KCkgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdNeUZpbGVVUkwnLCB7IHZhbHVlOiBidWNrZXQudXJsRm9yT2JqZWN0KCdteS9maWxlLnR4dCcpIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnWW91ckZpbGVVUkwnLCB7IHZhbHVlOiBidWNrZXQudXJsRm9yT2JqZWN0KCcveW91ci9maWxlLnR4dCcpIH0pOyAvLyBcIi9cIiBpcyBvcHRpb25hbFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnUmVnaW9uQnVja2V0VVJMJywgeyB2YWx1ZTogYnVja2V0V2l0aFJlZ2lvbi51cmxGb3JPYmplY3QoKSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnT3V0cHV0cyc6IHtcbiAgICAgICAgJ0J1Y2tldFVSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vczMuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6VVJMU3VmZml4JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeUZpbGVVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovL3MzLicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvbXkvZmlsZS50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnWW91ckZpbGVVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovL3MzLicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcveW91ci9maWxlLnR4dCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdSZWdpb25CdWNrZXRVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovL3MzLnVzLXdlc3QtMi4nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy9leHBsaWNpdC1yZWdpb24tYnVja2V0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3MzVXJsRm9yT2JqZWN0IHJldHVybnMgYSB0b2tlbiB3aXRoIHRoZSBTMyBVUkwgb2YgdGhlIHRva2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdCdWNrZXRTM1VSTCcsIHsgdmFsdWU6IGJ1Y2tldC5zM1VybEZvck9iamVjdCgpIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTXlGaWxlUzNVUkwnLCB7IHZhbHVlOiBidWNrZXQuczNVcmxGb3JPYmplY3QoJ215L2ZpbGUudHh0JykgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdZb3VyRmlsZVMzVVJMJywgeyB2YWx1ZTogYnVja2V0LnMzVXJsRm9yT2JqZWN0KCcveW91ci9maWxlLnR4dCcpIH0pOyAvLyBcIi9cIiBpcyBvcHRpb25hbFxuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdPdXRwdXRzJzoge1xuICAgICAgICAnQnVja2V0UzNVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdzMzovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlGaWxlUzNVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdzMzovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcvbXkvZmlsZS50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnWW91ckZpbGVTM1VSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ3MzOi8vJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy95b3VyL2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdncmFudFB1YmxpY0FjY2VzcycsICgpID0+IHtcbiAgICB0ZXN0KCdieSBkZWZhdWx0LCBncmFudHMgczM6R2V0T2JqZWN0IHRvIGFsbCBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ2InKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ2JDM0JCQ0M2NScsICdBcm4nXSB9LCAnLyonXV0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdcImtleVByZWZpeFwiIGNhbiBiZSB1c2VkIHRvIG9ubHkgZ3JhbnQgYWNjZXNzIHRvIGNlcnRhaW4gb2JqZWN0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdiJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGJ1Y2tldC5ncmFudFB1YmxpY0FjY2Vzcygnb25seS9hY2Nlc3MvdGhlc2UvKicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzpHZXRPYmplY3QnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkpvaW4nOiBbJycsIFt7ICdGbjo6R2V0QXR0JzogWydiQzNCQkNDNjUnLCAnQXJuJ10gfSwgJy9vbmx5L2FjY2Vzcy90aGVzZS8qJ11dIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnXCJhbGxvd2VkQWN0aW9uc1wiIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgYWN0aW9ucyBleHBsaWNpdGx5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ2InKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCcqJywgJ3MzOkdldE9iamVjdCcsICdzMzpQdXRPYmplY3QnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbJ3MzOkdldE9iamVjdCcsICdzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHsgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnYkMzQkJDQzY1JywgJ0FybiddIH0sICcvKiddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybnMgdGhlIFBvbGljeVN0YXRlbWVudCB3aGljaCBjYW4gYmUgdGhlbiBjdXN0b21pemVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ2InKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcmVzdWx0ID0gYnVja2V0LmdyYW50UHVibGljQWNjZXNzKCk7XG4gICAgICByZXN1bHQucmVzb3VyY2VTdGF0ZW1lbnQhLmFkZENvbmRpdGlvbignSXBBZGRyZXNzJywgeyAnYXdzOlNvdXJjZUlwJzogJzU0LjI0MC4xNDMuMC8yNCcgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6Sm9pbic6IFsnJywgW3sgJ0ZuOjpHZXRBdHQnOiBbJ2JDM0JCQ0M2NScsICdBcm4nXSB9LCAnLyonXV0gfSxcbiAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnSXBBZGRyZXNzJzogeyAnYXdzOlNvdXJjZUlwJzogJzU0LjI0MC4xNDMuMC8yNCcgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBibG9ja1B1YmxpY1BvbGljeSBpcyBzZXQgdG8gdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IG5ldyBzMy5CbG9ja1B1YmxpY0FjY2Vzcyh7IGJsb2NrUHVibGljUG9saWN5OiB0cnVlIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBidWNrZXQuZ3JhbnRQdWJsaWNBY2Nlc3MoKSkudG9UaHJvdygvYmxvY2tQdWJsaWNQb2xpY3kvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dlYnNpdGUgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdvbmx5IGluZGV4IGRvYycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXgyLmh0bWwnLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgICBXZWJzaXRlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEluZGV4RG9jdW1lbnQ6ICdpbmRleDIuaHRtbCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2ZhaWxzIGlmIG9ubHkgZXJyb3IgZG9jIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdlcnJvci5odG1sJyxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9cIndlYnNpdGVJbmRleERvY3VtZW50XCIgaXMgcmVxdWlyZWQgaWYgXCJ3ZWJzaXRlRXJyb3JEb2N1bWVudFwiIGlzIHNldC8pO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnZXJyb3IgYW5kIGluZGV4IGRvY3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Mi5odG1sJyxcbiAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdlcnJvci5odG1sJyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgICAgV2Vic2l0ZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBJbmRleERvY3VtZW50OiAnaW5kZXgyLmh0bWwnLFxuICAgICAgICAgIEVycm9yRG9jdW1lbnQ6ICdlcnJvci5odG1sJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnZXhwb3J0cyB0aGUgV2Vic2l0ZVVSTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsKSkudG9FcXVhbCh7ICdGbjo6R2V0QXR0JzogWydXZWJzaXRlMzI5NjJEMEInLCAnV2Vic2l0ZVVSTCddIH0pO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnZXhwb3J0cyB0aGUgV2Vic2l0ZURvbWFpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXRXZWJzaXRlRG9tYWluTmFtZSkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbJy8nLCB7ICdGbjo6R2V0QXR0JzogWydXZWJzaXRlMzI5NjJEMEInLCAnV2Vic2l0ZVVSTCddIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2V4cG9ydHMgdGhlIFdlYnNpdGVVUkwgZm9yIGltcG9ydGVkIGJ1Y2tldHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ1dlYnNpdGUnLCAnbXktdGVzdC1idWNrZXQnKTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsKSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnaHR0cDovL215LXRlc3QtYnVja2V0LicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RmluZEluTWFwJzogW1xuICAgICAgICAgICAgICAgICdTM3N0YXRpY3dlYnNpdGVNYXAnLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJ2VuZHBvaW50JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldFdlYnNpdGVEb21haW5OYW1lKSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnbXktdGVzdC1idWNrZXQuJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpGaW5kSW5NYXAnOiBbXG4gICAgICAgICAgICAgICAgJ1Mzc3RhdGljd2Vic2l0ZU1hcCcsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAnZW5kcG9pbnQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGVzdCgnZXhwb3J0cyB0aGUgV2Vic2l0ZVVSTCBmb3IgaW1wb3J0ZWQgYnVja2V0cyB3aXRoIHVybCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgYnVja2V0TmFtZTogJ215LXRlc3QtYnVja2V0JyxcbiAgICAgICAgYnVja2V0V2Vic2l0ZVVybDogJ2h0dHA6Ly9teS10ZXN0LWJ1Y2tldC5teS10ZXN0LnN1ZmZpeCcsXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXRXZWJzaXRlVXJsKSkudG9FcXVhbCgnaHR0cDovL215LXRlc3QtYnVja2V0Lm15LXRlc3Quc3VmZml4Jyk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0V2Vic2l0ZURvbWFpbk5hbWUpKS50b0VxdWFsKCdteS10ZXN0LWJ1Y2tldC5teS10ZXN0LnN1ZmZpeCcpO1xuXG4gICAgfSk7XG4gICAgdGVzdCgnYWRkcyBSZWRpcmVjdEFsbFJlcXVlc3RzVG8gcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICB3ZWJzaXRlUmVkaXJlY3Q6IHtcbiAgICAgICAgICBob3N0TmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgcHJvdG9jb2w6IHMzLlJlZGlyZWN0UHJvdG9jb2wuSFRUUFMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICAgIFdlYnNpdGVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgUmVkaXJlY3RBbGxSZXF1ZXN0c1RvOiB7XG4gICAgICAgICAgICBIb3N0TmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICBQcm90b2NvbDogJ2h0dHBzJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICB0ZXN0KCdmYWlscyBpZiB3ZWJzaXRlUmVkaXJlY3QgYW5kIHdlYnNpdGVJbmRleCBhbmQgd2Vic2l0ZUVycm9yIGFyZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdlcnJvci5odG1sJyxcbiAgICAgICAgICB3ZWJzaXRlUmVkaXJlY3Q6IHtcbiAgICAgICAgICAgIGhvc3ROYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1wid2Vic2l0ZUluZGV4RG9jdW1lbnRcIiwgXCJ3ZWJzaXRlRXJyb3JEb2N1bWVudFwiIGFuZCwgXCJ3ZWJzaXRlUm91dGluZ1J1bGVzXCIgY2Fubm90IGJlIHNldCBpZiBcIndlYnNpdGVSZWRpcmVjdFwiIGlzIHVzZWQvKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2ZhaWxzIGlmIHdlYnNpdGVSZWRpcmVjdCBhbmQgd2Vic2l0ZVJvdXRpbmdSdWxlcyBhcmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgICB3ZWJzaXRlUm91dGluZ1J1bGVzOiBbXSxcbiAgICAgICAgICB3ZWJzaXRlUmVkaXJlY3Q6IHtcbiAgICAgICAgICAgIGhvc3ROYW1lOiAnd3d3LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1wid2Vic2l0ZUluZGV4RG9jdW1lbnRcIiwgXCJ3ZWJzaXRlRXJyb3JEb2N1bWVudFwiIGFuZCwgXCJ3ZWJzaXRlUm91dGluZ1J1bGVzXCIgY2Fubm90IGJlIHNldCBpZiBcIndlYnNpdGVSZWRpcmVjdFwiIGlzIHVzZWQvKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2FkZHMgUmVkaXJlY3RSdWxlcyBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgIHdlYnNpdGVSb3V0aW5nUnVsZXM6IFt7XG4gICAgICAgICAgaG9zdE5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIGh0dHBSZWRpcmVjdENvZGU6ICczMDInLFxuICAgICAgICAgIHByb3RvY29sOiBzMy5SZWRpcmVjdFByb3RvY29sLkhUVFBTLFxuICAgICAgICAgIHJlcGxhY2VLZXk6IHMzLlJlcGxhY2VLZXkucHJlZml4V2l0aCgndGVzdC8nKSxcbiAgICAgICAgICBjb25kaXRpb246IHtcbiAgICAgICAgICAgIGh0dHBFcnJvckNvZGVSZXR1cm5lZEVxdWFsczogJzIwMCcsXG4gICAgICAgICAgICBrZXlQcmVmaXhFcXVhbHM6ICdwcmVmaXgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dLFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgICBXZWJzaXRlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIFJvdXRpbmdSdWxlczogW3tcbiAgICAgICAgICAgIFJlZGlyZWN0UnVsZToge1xuICAgICAgICAgICAgICBIb3N0TmFtZTogJ3d3dy5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICAgIEh0dHBSZWRpcmVjdENvZGU6ICczMDInLFxuICAgICAgICAgICAgICBQcm90b2NvbDogJ2h0dHBzJyxcbiAgICAgICAgICAgICAgUmVwbGFjZUtleVByZWZpeFdpdGg6ICd0ZXN0LycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUm91dGluZ1J1bGVDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgSHR0cEVycm9yQ29kZVJldHVybmVkRXF1YWxzOiAnMjAwJyxcbiAgICAgICAgICAgICAgS2V5UHJlZml4RXF1YWxzOiAncHJlZml4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2ZhaWxzIGlmIHJvdXRpbmdSdWxlIGNvbmRpdGlvbiBvYmplY3QgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICAgIHdlYnNpdGVSb3V0aW5nUnVsZXM6IFt7XG4gICAgICAgICAgICBodHRwUmVkaXJlY3RDb2RlOiAnMzAzJyxcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge30sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvVGhlIGNvbmRpdGlvbiBwcm9wZXJ0eSBjYW5ub3QgYmUgYW4gZW1wdHkgb2JqZWN0Lyk7XG5cbiAgICB9KTtcbiAgICBkZXNjcmliZSgnaXNXZWJzaXRlIHNldCBwcm9wZXJseSB3aXRoJywgKCkgPT4ge1xuICAgICAgdGVzdCgnb25seSBpbmRleCBkb2MnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Mi5odG1sJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChidWNrZXQuaXNXZWJzaXRlKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJ2Vycm9yIGFuZCBpbmRleCBkb2NzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1dlYnNpdGUnLCB7XG4gICAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleDIuaHRtbCcsXG4gICAgICAgICAgd2Vic2l0ZUVycm9yRG9jdW1lbnQ6ICdlcnJvci5odG1sJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChidWNrZXQuaXNXZWJzaXRlKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJ3JlZGlyZWN0cycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdXZWJzaXRlJywge1xuICAgICAgICAgIHdlYnNpdGVSZWRpcmVjdDoge1xuICAgICAgICAgICAgaG9zdE5hbWU6ICd3d3cuZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgcHJvdG9jb2w6IHMzLlJlZGlyZWN0UHJvdG9jb2wuSFRUUFMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChidWNrZXQuaXNXZWJzaXRlKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICB9KTtcbiAgICAgIHRlc3QoJ25vIHdlYnNpdGUgcHJvcGVydGllcyBzZXQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnV2Vic2l0ZScpO1xuICAgICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9FcXVhbChmYWxzZSk7XG5cbiAgICAgIH0pO1xuICAgICAgdGVzdCgnaW1wb3J0ZWQgd2Vic2l0ZSBidWNrZXRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnV2Vic2l0ZScsIHtcbiAgICAgICAgICBidWNrZXRBcm46ICdhcm46YXdzOnMzOjo6bXktYnVja2V0JyxcbiAgICAgICAgICBpc1dlYnNpdGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoYnVja2V0LmlzV2Vic2l0ZSkudG9FcXVhbCh0cnVlKTtcblxuICAgICAgfSk7XG4gICAgICB0ZXN0KCdpbXBvcnRlZCBidWNrZXRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKHN0YWNrLCAnTm90V2Vic2l0ZScsIHtcbiAgICAgICAgICBidWNrZXRBcm46ICdhcm46YXdzOnMzOjo6bXktYnVja2V0JyxcbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChidWNrZXQuaXNXZWJzaXRlKS50b0VxdWFsKGZhbHNlKTtcblxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldC5mcm9tQnVja2V0QXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXRBcm4oc3RhY2ssICdteS1idWNrZXQnLCAnYXJuOmF3czpzMzo6Om15LWNvcnBvcmF0ZS1idWNrZXQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYnVja2V0LmJ1Y2tldE5hbWUpLnRvRXF1YWwoJ215LWNvcnBvcmF0ZS1idWNrZXQnKTtcbiAgICBleHBlY3QoYnVja2V0LmJ1Y2tldEFybikudG9FcXVhbCgnYXJuOmF3czpzMzo6Om15LWNvcnBvcmF0ZS1idWNrZXQnKTtcblxuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQuZnJvbUJ1Y2tldE5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssICdpbXBvcnRlZC1idWNrZXQnLCAnbXktYnVja2V0LW5hbWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYnVja2V0LmJ1Y2tldE5hbWUpLnRvRXF1YWwoJ215LWJ1Y2tldC1uYW1lJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYnVja2V0LmJ1Y2tldEFybikpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnMzOjo6bXktYnVja2V0LW5hbWUnXV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIGEga21zIGtleSBpcyBzcGVjaWZpZWQsIGl0IGltcGxpZXMgYnVja2V0IGlzIGVuY3J5cHRlZCB3aXRoIGttcyAoZGFoKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnaycpO1xuXG4gICAgLy8gVEhFTlxuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdiJywgeyBlbmNyeXB0aW9uS2V5OiBrZXkgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldCB3aXRoIFNlcnZlciBBY2Nlc3MgTG9ncycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFjY2Vzc0xvZ0J1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdBY2Nlc3NMb2dzJyk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogYWNjZXNzTG9nQnVja2V0LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMb2dnaW5nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBEZXN0aW5hdGlvbkJ1Y2tldE5hbWU6IHtcbiAgICAgICAgICBSZWY6ICdBY2Nlc3NMb2dzOEI2MjBFQ0EnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggU2VydmVyIEFjY2VzcyBMb2dzIHdpdGggUHJlZml4JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYWNjZXNzTG9nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0FjY2Vzc0xvZ3MnKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBzZXJ2ZXJBY2Nlc3NMb2dzQnVja2V0OiBhY2Nlc3NMb2dCdWNrZXQsXG4gICAgICBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAnaGVsbG8nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMb2dnaW5nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBEZXN0aW5hdGlvbkJ1Y2tldE5hbWU6IHtcbiAgICAgICAgICBSZWY6ICdBY2Nlc3NMb2dzOEI2MjBFQ0EnLFxuICAgICAgICB9LFxuICAgICAgICBMb2dGaWxlUHJlZml4OiAnaGVsbG8nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQWNjZXNzIGxvZyBwcmVmaXggZ2l2ZW4gd2l0aG91dCBidWNrZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg6ICdoZWxsbycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIExvZ2dpbmdDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIExvZ0ZpbGVQcmVmaXg6ICdoZWxsbycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgQWxsb3cgTG9nIGRlbGl2ZXJ5IGNoYW5nZXMgYnVja2V0IEFjY2VzcyBDb250cm9sIHNob3VsZCBmYWlsJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYWNjZXNzTG9nQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0FjY2Vzc0xvZ3MnLCB7XG4gICAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkFVVEhFTlRJQ0FURURfUkVBRCxcbiAgICB9KTtcbiAgICBleHBlY3QoKCkgPT5cbiAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgICAgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogYWNjZXNzTG9nQnVja2V0LFxuICAgICAgICBzZXJ2ZXJBY2Nlc3NMb2dzUHJlZml4OiAnaGVsbG8nLFxuICAgICAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLkFVVEhFTlRJQ0FURURfUkVBRCxcbiAgICAgIH0pLFxuICAgICkudG9UaHJvdygvQ2Fubm90IGVuYWJsZSBsb2cgZGVsaXZlcnkgdG8gdGhpcyBidWNrZXQgYmVjYXVzZSB0aGUgYnVja2V0J3MgQUNMIGhhcyBiZWVuIHNldCBhbmQgY2FuJ3QgYmUgY2hhbmdlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgc2tpcHMgc2V0dGluZyB1cCBhY2Nlc3MgbG9nIEFDTCBidXQgY29uZmlndXJlcyBkZWxpdmVyeSBmb3IgYW4gaW1wb3J0ZWQgdGFyZ2V0IGJ1Y2tldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFjY2Vzc0xvZ0J1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ1RhcmdldEJ1Y2tldCcsICd0YXJnZXQtbG9ncy1idWNrZXQnKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnVGVzdEJ1Y2tldCcsIHtcbiAgICAgIHNlcnZlckFjY2Vzc0xvZ3NCdWNrZXQ6IGFjY2Vzc0xvZ0J1Y2tldCxcbiAgICAgIHNlcnZlckFjY2Vzc0xvZ3NQcmVmaXg6ICd0ZXN0LycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTG9nZ2luZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRGVzdGluYXRpb25CdWNrZXROYW1lOiBzdGFjay5yZXNvbHZlKGFjY2Vzc0xvZ0J1Y2tldC5idWNrZXROYW1lKSxcbiAgICAgICAgTG9nRmlsZVByZWZpeDogJ3Rlc3QvJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGVtcGxhdGUuYWxsUmVzb3VyY2VzUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgQWNjZXNzQ29udHJvbDogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNXYXJuaW5nKCcqJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnVW5hYmxlIHRvIGFkZCBuZWNlc3NhcnkgbG9nZ2luZyBwZXJtaXNzaW9ucyB0byBpbXBvcnRlZCB0YXJnZXQgYnVja2V0JykpO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgQWxsb3cgTG9nIGRlbGl2ZXJ5IHNob3VsZCB1c2UgdGhlIHJlY29tbWVuZGVkIHBvbGljeSB3aGVuIGZsYWcgZW5hYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnQGF3cy1jZGsvYXdzLXMzOnNlcnZlckFjY2Vzc0xvZ3NVc2VCdWNrZXRQb2xpY3knLCB0cnVlKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnVGVzdEJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc1ByZWZpeDogJ3Rlc3QnIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIEFjY2Vzc0NvbnRyb2w6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgQnVja2V0OiBzdGFjay5yZXNvbHZlKGJ1Y2tldC5idWNrZXROYW1lKSxcbiAgICAgIFBvbGljeURvY3VtZW50OiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xvZ2dpbmcuczMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgIFJlc291cmNlOiBzdGFjay5yZXNvbHZlKGAke2J1Y2tldC5idWNrZXRBcm59L3Rlc3QqYCksXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzogc3RhY2sucmVzb2x2ZShidWNrZXQuYnVja2V0QXJuKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgJ2F3czpTb3VyY2VBY2NvdW50JzogeyAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KV0pLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0xvZyBEZWxpdmVyeSBidWNrZXQgcG9saWN5IHNob3VsZCBwcm9wZXJseSBzZXQgc291cmNlIGJ1Y2tldCBBUk4vQWNjb3VudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnQGF3cy1jZGsvYXdzLXMzOnNlcnZlckFjY2Vzc0xvZ3NVc2VCdWNrZXRQb2xpY3knLCB0cnVlKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXJnZXRCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnVGFyZ2V0QnVja2V0Jyk7XG4gICAgY29uc3Qgc291cmNlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1NvdXJjZUJ1Y2tldCcsIHsgc2VydmVyQWNjZXNzTG9nc0J1Y2tldDogdGFyZ2V0QnVja2V0IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICBCdWNrZXQ6IHN0YWNrLnJlc29sdmUodGFyZ2V0QnVja2V0LmJ1Y2tldE5hbWUpLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnbG9nZ2luZy5zMy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgUmVzb3VyY2U6IHN0YWNrLnJlc29sdmUoYCR7dGFyZ2V0QnVja2V0LmJ1Y2tldEFybn0vKmApLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHN0YWNrLnJlc29sdmUoc291cmNlQnVja2V0LmJ1Y2tldEFybiksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHN0YWNrLnJlc29sdmUoc291cmNlQnVja2V0LmVudi5hY2NvdW50KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSldKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdEZWZhdWx0cyBmb3IgYW4gaW52ZW50b3J5IGJ1Y2tldCcsICgpID0+IHtcbiAgICAvLyBHaXZlblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaW52ZW50b3J5QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0ludmVudG9yeUJ1Y2tldCcpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGludmVudG9yaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBkZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgYnVja2V0OiBpbnZlbnRvcnlCdWNrZXQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgSW52ZW50b3J5Q29uZmlndXJhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgSW5jbHVkZWRPYmplY3RWZXJzaW9uczogJ0FsbCcsXG4gICAgICAgICAgU2NoZWR1bGVGcmVxdWVuY3k6ICdXZWVrbHknLFxuICAgICAgICAgIERlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICBGb3JtYXQ6ICdDU1YnLFxuICAgICAgICAgICAgQnVja2V0QXJuOiB7ICdGbjo6R2V0QXR0JzogWydJbnZlbnRvcnlCdWNrZXRBODY5QjhDQicsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSWQ6ICdNeUJ1Y2tldEludmVudG9yeTAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXRQb2xpY3knLCB7XG4gICAgICBCdWNrZXQ6IHsgUmVmOiAnSW52ZW50b3J5QnVja2V0QTg2OUI4Q0InIH0sXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3MzLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0ludmVudG9yeUJ1Y2tldEE4NjlCOENCJywgJ0FybiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbeyAnRm46OkdldEF0dCc6IFsnSW52ZW50b3J5QnVja2V0QTg2OUI4Q0InLCAnQXJuJ10gfSwgJy8qJ11dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KV0pLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggb2JqZWN0T3duZXJzaGlwIHNldCB0byBCVUNLRVRfT1dORVJfRU5GT1JDRUQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgb2JqZWN0T3duZXJzaGlwOiBzMy5PYmplY3RPd25lcnNoaXAuQlVDS0VUX09XTkVSX0VORk9SQ0VELFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnT3duZXJzaGlwQ29udHJvbHMnOiB7XG4gICAgICAgICAgICAgICdSdWxlcyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnT2JqZWN0T3duZXJzaGlwJzogJ0J1Y2tldE93bmVyRW5mb3JjZWQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldCB3aXRoIG9iamVjdE93bmVyc2hpcCBzZXQgdG8gQlVDS0VUX09XTkVSX1BSRUZFUlJFRCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBvYmplY3RPd25lcnNoaXA6IHMzLk9iamVjdE93bmVyc2hpcC5CVUNLRVRfT1dORVJfUFJFRkVSUkVELFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnT3duZXJzaGlwQ29udHJvbHMnOiB7XG4gICAgICAgICAgICAgICdSdWxlcyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnT2JqZWN0T3duZXJzaGlwJzogJ0J1Y2tldE93bmVyUHJlZmVycmVkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdCdWNrZXQgd2l0aCBvYmplY3RPd25lcnNoaXAgc2V0IHRvIE9CSkVDVF9XUklURVInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgb2JqZWN0T3duZXJzaGlwOiBzMy5PYmplY3RPd25lcnNoaXAuT0JKRUNUX1dSSVRFUixcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ093bmVyc2hpcENvbnRyb2xzJzoge1xuICAgICAgICAgICAgICAnUnVsZXMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ09iamVjdE93bmVyc2hpcCc6ICdPYmplY3RXcml0ZXInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldCB3aXRoIG9iamVjdE93bmVyc2hpcHMgc2V0IHRvIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBvYmplY3RPd25lcnNoaXA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGF1dG9EZWxldGVPYmplY3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgQnVja2V0OiB7XG4gICAgICAgIFJlZjogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgfSxcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgICdzMzpEZWxldGVPYmplY3QqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICdBV1MnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnQ3VzdG9tUzNBdXRvRGVsZXRlT2JqZWN0c0N1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlM0IxQkQwOTInLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQ3VzdG9tOjpTM0F1dG9EZWxldGVPYmplY3RzJywge1xuICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICdTZXJ2aWNlVG9rZW4nOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQ3VzdG9tUzNBdXRvRGVsZXRlT2JqZWN0c0N1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyOUQ5MDE4NEYnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ0J1Y2tldE5hbWUnOiB7XG4gICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnRGVwZW5kc09uJzogW1xuICAgICAgICAnTXlCdWNrZXRQb2xpY3lFN0ZCQUM3QicsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGF1dG9EZWxldGVPYmplY3RzIG9uIG11bHRpcGxlIGJ1Y2tldHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0MScsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KTtcblxuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQyJywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIDEpO1xuICB9KTtcblxuICB0ZXN0KCdhdXRvRGVsZXRlT2JqZWN0cyB0aHJvd3MgaWYgUmVtb3ZhbFBvbGljeSBpcyBub3QgREVTVFJPWScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IHVzZSBcXCdhdXRvRGVsZXRlT2JqZWN0c1xcJyBwcm9wZXJ0eSBvbiBhIGJ1Y2tldCB3aXRob3V0IHNldHRpbmcgcmVtb3ZhbCBwb2xpY3kgdG8gXFwnREVTVFJPWVxcJy8pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCB0cmFuc2ZlciBhY2NlbGVyYXRpb24gdHVybmVkIG9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIHRyYW5zZmVyQWNjZWxlcmF0aW9uOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdBY2NlbGVyYXRlQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgJ0FjY2VsZXJhdGlvblN0YXR1cyc6ICdFbmFibGVkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3QgcmV0dXJucyBhIHRva2VuIHdpdGggdGhlIFMzIFVSTCBvZiB0aGUgdG9rZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgY29uc3QgYnVja2V0V2l0aFJlZ2lvbiA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ1JlZ2lvbmFsQnVja2V0Jywge1xuICAgICAgYnVja2V0QXJuOiAnYXJuOmF3czpzMzo6OmV4cGxpY2l0LXJlZ2lvbi1idWNrZXQnLFxuICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnQnVja2V0VVJMJywgeyB2YWx1ZTogYnVja2V0LnRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0KCkgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdNeUZpbGVVUkwnLCB7IHZhbHVlOiBidWNrZXQudHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3QoJ215L2ZpbGUudHh0JykgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdZb3VyRmlsZVVSTCcsIHsgdmFsdWU6IGJ1Y2tldC50cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdCgnL3lvdXIvZmlsZS50eHQnKSB9KTsgLy8gXCIvXCIgaXMgb3B0aW9uYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1JlZ2lvbkJ1Y2tldFVSTCcsIHsgdmFsdWU6IGJ1Y2tldFdpdGhSZWdpb24udHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3QoKSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnT3V0cHV0cyc6IHtcbiAgICAgICAgJ0J1Y2tldFVSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy5zMy1hY2NlbGVyYXRlLmFtYXpvbmF3cy5jb20vJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015RmlsZVVSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJy5zMy1hY2NlbGVyYXRlLmFtYXpvbmF3cy5jb20vbXkvZmlsZS50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnWW91ckZpbGVVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuczMtYWNjZWxlcmF0ZS5hbWF6b25hd3MuY29tL3lvdXIvZmlsZS50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnUmVnaW9uQnVja2V0VVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6ICdodHRwczovL2V4cGxpY2l0LXJlZ2lvbi1idWNrZXQuczMtYWNjZWxlcmF0ZS5hbWF6b25hd3MuY29tLycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdCB3aXRoIGR1YWwgc3RhY2sgb3B0aW9uIHJldHVybnMgYSB0b2tlbiB3aXRoIHRoZSBTMyBVUkwgb2YgdGhlIHRva2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGNvbnN0IGJ1Y2tldFdpdGhSZWdpb24gPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdSZWdpb25hbEJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldEFybjogJ2Fybjphd3M6czM6OjpleHBsaWNpdC1yZWdpb24tYnVja2V0JyxcbiAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0J1Y2tldFVSTCcsIHsgdmFsdWU6IGJ1Y2tldC50cmFuc2ZlckFjY2VsZXJhdGlvblVybEZvck9iamVjdCh1bmRlZmluZWQsIHsgZHVhbFN0YWNrOiB0cnVlIH0pIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnTXlGaWxlVVJMJywgeyB2YWx1ZTogYnVja2V0LnRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0KCdteS9maWxlLnR4dCcsIHsgZHVhbFN0YWNrOiB0cnVlIH0pIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnWW91ckZpbGVVUkwnLCB7IHZhbHVlOiBidWNrZXQudHJhbnNmZXJBY2NlbGVyYXRpb25VcmxGb3JPYmplY3QoJy95b3VyL2ZpbGUudHh0JywgeyBkdWFsU3RhY2s6IHRydWUgfSkgfSk7IC8vIFwiL1wiIGlzIG9wdGlvbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdSZWdpb25CdWNrZXRVUkwnLCB7IHZhbHVlOiBidWNrZXRXaXRoUmVnaW9uLnRyYW5zZmVyQWNjZWxlcmF0aW9uVXJsRm9yT2JqZWN0KHVuZGVmaW5lZCwgeyBkdWFsU3RhY2s6IHRydWUgfSkgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ091dHB1dHMnOiB7XG4gICAgICAgICdCdWNrZXRVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuczMtYWNjZWxlcmF0ZS5kdWFsc3RhY2suYW1hem9uYXdzLmNvbS8nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlGaWxlVVJMJzoge1xuICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnLnMzLWFjY2VsZXJhdGUuZHVhbHN0YWNrLmFtYXpvbmF3cy5jb20vbXkvZmlsZS50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnWW91ckZpbGVVUkwnOiB7XG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwczovLycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICcuczMtYWNjZWxlcmF0ZS5kdWFsc3RhY2suYW1hem9uYXdzLmNvbS95b3VyL2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1JlZ2lvbkJ1Y2tldFVSTCc6IHtcbiAgICAgICAgICAnVmFsdWUnOiAnaHR0cHM6Ly9leHBsaWNpdC1yZWdpb24tYnVja2V0LnMzLWFjY2VsZXJhdGUuZHVhbHN0YWNrLmFtYXpvbmF3cy5jb20vJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIGludGVsbGlnZW50IHRpZXJpbmcgdHVybmVkIG9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zOiBbe1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdJbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdJZCc6ICdmb28nLFxuICAgICAgICAgICAgICAgICdTdGF0dXMnOiAnRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgJ1RpZXJpbmdzJzogW10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIGludGVsbGlnZW50IHRpZXJpbmcgdHVybmVkIG9uIHdpdGggYXJjaGl2ZSBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgaW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnM6IFt7XG4gICAgICAgIG5hbWU6ICdmb28nLFxuICAgICAgICBhcmNoaXZlQWNjZXNzVGllclRpbWU6IGNkay5EdXJhdGlvbi5kYXlzKDkwKSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdJbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdJZCc6ICdmb28nLFxuICAgICAgICAgICAgICAgICdTdGF0dXMnOiAnRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgJ1RpZXJpbmdzJzogW3tcbiAgICAgICAgICAgICAgICAgICdBY2Nlc3NUaWVyJzogJ0FSQ0hJVkVfQUNDRVNTJyxcbiAgICAgICAgICAgICAgICAgICdEYXlzJzogOTAsXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1Y2tldCB3aXRoIGludGVsbGlnZW50IHRpZXJpbmcgdHVybmVkIG9uIHdpdGggZGVlcCBhcmNoaXZlIGFjY2VzcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBpbnRlbGxpZ2VudFRpZXJpbmdDb25maWd1cmF0aW9uczogW3tcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIGRlZXBBcmNoaXZlQWNjZXNzVGllclRpbWU6IGNkay5EdXJhdGlvbi5kYXlzKDE4MCksXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6UzM6OkJ1Y2tldCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnSW50ZWxsaWdlbnRUaWVyaW5nQ29uZmlndXJhdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnSWQnOiAnZm9vJyxcbiAgICAgICAgICAgICAgICAnU3RhdHVzJzogJ0VuYWJsZWQnLFxuICAgICAgICAgICAgICAgICdUaWVyaW5ncyc6IFt7XG4gICAgICAgICAgICAgICAgICAnQWNjZXNzVGllcic6ICdERUVQX0FSQ0hJVkVfQUNDRVNTJyxcbiAgICAgICAgICAgICAgICAgICdEYXlzJzogMTgwLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdidWNrZXQgd2l0aCBpbnRlbGxpZ2VudCB0aWVyaW5nIHR1cm5lZCBvbiB3aXRoIGFsbCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zOiBbe1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgcHJlZml4OiAnYmFyJyxcbiAgICAgICAgYXJjaGl2ZUFjY2Vzc1RpZXJUaW1lOiBjZGsuRHVyYXRpb24uZGF5cyg5MCksXG4gICAgICAgIGRlZXBBcmNoaXZlQWNjZXNzVGllclRpbWU6IGNkay5EdXJhdGlvbi5kYXlzKDE4MCksXG4gICAgICAgIHRhZ3M6IFt7IGtleTogJ3Rlc3QnLCB2YWx1ZTogJ2JhenonIH1dLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OlMzOjpCdWNrZXQnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0ludGVsbGlnZW50VGllcmluZ0NvbmZpZ3VyYXRpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0lkJzogJ2ZvbycsXG4gICAgICAgICAgICAgICAgJ1ByZWZpeCc6ICdiYXInLFxuICAgICAgICAgICAgICAgICdTdGF0dXMnOiAnRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgJ1RhZ0ZpbHRlcnMnOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdLZXknOiAndGVzdCcsXG4gICAgICAgICAgICAgICAgICAgICdWYWx1ZSc6ICdiYXp6JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAnVGllcmluZ3MnOiBbe1xuICAgICAgICAgICAgICAgICAgJ0FjY2Vzc1RpZXInOiAnQVJDSElWRV9BQ0NFU1MnLFxuICAgICAgICAgICAgICAgICAgJ0RheXMnOiA5MCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY2Nlc3NUaWVyJzogJ0RFRVBfQVJDSElWRV9BQ0NFU1MnLFxuICAgICAgICAgICAgICAgICAgJ0RheXMnOiAxODAsXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0V2ZW50IEJyaWRnZSBub3RpZmljYXRpb24gY2FuIGJlIGVuYWJsZWQgYWZ0ZXIgdGhlIGJ1Y2tldCBpcyBjcmVhdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGJ1Y2tldC5lbmFibGVFdmVudEJyaWRnZU5vdGlmaWNhdGlvbigpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6UzNCdWNrZXROb3RpZmljYXRpb25zJywge1xuICAgICAgTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBFdmVudEJyaWRnZUNvbmZpZ3VyYXRpb246IHt9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==