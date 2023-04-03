"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Kinesis data streams', () => {
    test('default stream', () => {
        const stack = new core_1.Stack();
        new lib_1.Stream(stack, 'MyStream');
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyStream5C050E93: {
                    Type: 'AWS::Kinesis::Stream',
                    Properties: {
                        ShardCount: 1,
                        StreamModeDetails: {
                            StreamMode: lib_1.StreamMode.PROVISIONED,
                        },
                        RetentionPeriodHours: 24,
                        StreamEncryption: {
                            'Fn::If': [
                                'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                {
                                    Ref: 'AWS::NoValue',
                                },
                                {
                                    EncryptionType: 'KMS',
                                    KeyId: 'alias/aws/kinesis',
                                },
                            ],
                        },
                    },
                },
            },
            Conditions: {
                AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                    'Fn::Or': [
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-north-1',
                            ],
                        },
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-northwest-1',
                            ],
                        },
                    ],
                },
            },
        });
    }),
        test('multiple default streams only have one condition for encryption', () => {
            const stack = new core_1.Stack();
            new lib_1.Stream(stack, 'MyStream');
            new lib_1.Stream(stack, 'MyOtherStream');
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                    MyOtherStream86FCC9CE: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        }),
        test('stream from attributes', () => {
            const stack = new core_1.Stack();
            const s = lib_1.Stream.fromStreamAttributes(stack, 'MyStream', {
                streamArn: 'arn:aws:kinesis:region:account-id:stream/stream-name',
            });
            expect(s.streamArn).toEqual('arn:aws:kinesis:region:account-id:stream/stream-name');
        }),
        test('uses explicit shard count', () => {
            const stack = new core_1.Stack();
            new lib_1.Stream(stack, 'MyStream', {
                shardCount: 2,
            });
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 2,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        }),
        test('uses explicit retention period', () => {
            const stack = new core_1.Stack();
            new lib_1.Stream(stack, 'MyStream', {
                retentionPeriod: core_1.Duration.hours(168),
            });
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 168,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        }),
        test('retention period must be between 24 and 8760 hours', () => {
            expect(() => {
                new lib_1.Stream(new core_1.Stack(), 'MyStream', {
                    retentionPeriod: core_1.Duration.hours(8761),
                });
            }).toThrow(/retentionPeriod must be between 24 and 8760 hours. Received 8761/);
            expect(() => {
                new lib_1.Stream(new core_1.Stack(), 'MyStream', {
                    retentionPeriod: core_1.Duration.hours(23),
                });
            }).toThrow(/retentionPeriod must be between 24 and 8760 hours. Received 23/);
        }),
        test('uses Kinesis master key if MANAGED encryption type is provided', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.Stream(stack, 'MyStream', {
                encryption: lib_1.StreamEncryption.MANAGED,
            });
            // THEN
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                EncryptionType: 'KMS',
                                KeyId: 'alias/aws/kinesis',
                            },
                        },
                    },
                },
            });
        }),
        test('encryption key cannot be supplied with UNENCRYPTED as the encryption type', () => {
            const stack = new core_1.Stack();
            const key = new kms.Key(stack, 'myKey');
            expect(() => {
                new lib_1.Stream(stack, 'MyStream', {
                    encryptionKey: key,
                    encryption: lib_1.StreamEncryption.UNENCRYPTED,
                });
            }).toThrow(/encryptionKey is specified, so 'encryption' must be set to KMS/);
        }),
        test('if a KMS key is supplied, infers KMS as the encryption type', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const key = new kms.Key(stack, 'myKey');
            // WHEN
            new lib_1.Stream(stack, 'myStream', {
                encryptionKey: key,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
                ShardCount: 1,
                StreamModeDetails: {
                    StreamMode: lib_1.StreamMode.PROVISIONED,
                },
                RetentionPeriodHours: 24,
                StreamEncryption: {
                    EncryptionType: 'KMS',
                    KeyId: {
                        'Fn::GetAtt': ['myKey441A1E73', 'Arn'],
                    },
                },
            });
        }),
        test('auto-creates KMS key if encryption type is KMS but no key is provided', () => {
            const stack = new core_1.Stack();
            const stream = new lib_1.Stream(stack, 'MyStream', {
                encryption: lib_1.StreamEncryption.KMS,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                Description: 'Created by Default/MyStream',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
                StreamEncryption: {
                    EncryptionType: 'KMS',
                    KeyId: stack.resolve(stream.encryptionKey?.keyArn),
                },
            });
        }),
        test('uses explicit KMS key if encryption type is KMS and a key is provided', () => {
            const stack = new core_1.Stack();
            const explicitKey = new kms.Key(stack, 'ExplicitKey', {
                description: 'Explicit Key',
            });
            new lib_1.Stream(stack, 'MyStream', {
                encryption: lib_1.StreamEncryption.KMS,
                encryptionKey: explicitKey,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                Description: 'Explicit Key',
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
                ShardCount: 1,
                StreamModeDetails: {
                    StreamMode: lib_1.StreamMode.PROVISIONED,
                },
                RetentionPeriodHours: 24,
                StreamEncryption: {
                    EncryptionType: 'KMS',
                    KeyId: stack.resolve(explicitKey.keyArn),
                },
            });
        }),
        test('uses explicit provisioned streamMode', () => {
            const stack = new core_1.Stack();
            new lib_1.Stream(stack, 'MyStream', {
                streamMode: lib_1.StreamMode.PROVISIONED,
            });
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            RetentionPeriodHours: 24,
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        });
    test('uses explicit on-demand streamMode', () => {
        const stack = new core_1.Stack();
        new lib_1.Stream(stack, 'MyStream', {
            streamMode: lib_1.StreamMode.ON_DEMAND,
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyStream5C050E93: {
                    Type: 'AWS::Kinesis::Stream',
                    Properties: {
                        RetentionPeriodHours: 24,
                        StreamModeDetails: {
                            StreamMode: lib_1.StreamMode.ON_DEMAND,
                        },
                        StreamEncryption: {
                            'Fn::If': [
                                'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                {
                                    Ref: 'AWS::NoValue',
                                },
                                {
                                    EncryptionType: 'KMS',
                                    KeyId: 'alias/aws/kinesis',
                                },
                            ],
                        },
                    },
                },
            },
            Conditions: {
                AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                    'Fn::Or': [
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-north-1',
                            ],
                        },
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-northwest-1',
                            ],
                        },
                    ],
                },
            },
        });
    });
    test('throws when using shardCount with on-demand streamMode', () => {
        const stack = new core_1.Stack();
        expect(() => {
            new lib_1.Stream(stack, 'MyStream', {
                shardCount: 2,
                streamMode: lib_1.StreamMode.ON_DEMAND,
            });
        }).toThrow(`streamMode must be set to ${lib_1.StreamMode.PROVISIONED} (default) when specifying shardCount`);
    });
    test('grantRead creates and attaches a policy with read only access to the principal', () => {
        const stack = new core_1.Stack();
        const stream = new lib_1.Stream(stack, 'MyStream', {
            encryption: lib_1.StreamEncryption.KMS,
        });
        const user = new iam.User(stack, 'MyUser');
        stream.grantRead(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: 'kms:Decrypt',
                        Effect: 'Allow',
                        Resource: stack.resolve(stream.encryptionKey?.keyArn),
                    }]),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
            StreamEncryption: {
                KeyId: stack.resolve(stream.encryptionKey?.keyArn),
            },
        });
    });
    test('grantReadWrite creates and attaches a policy to the principal', () => {
        const stack = new core_1.Stack();
        const stream = new lib_1.Stream(stack, 'MyStream', {
            encryption: lib_1.StreamEncryption.KMS,
        });
        const user = new iam.User(stack, 'MyUser');
        stream.grantReadWrite(user);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                        Effect: 'Allow',
                        Resource: stack.resolve(stream.encryptionKey?.keyArn),
                    }]),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
            StreamEncryption: {
                KeyId: stack.resolve(stream.encryptionKey?.keyArn),
            },
        });
    });
    test('grantRead creates and associates a policy with read only access to Stream', () => {
        const stack = new core_1.Stack();
        const stream = new lib_1.Stream(stack, 'MyStream');
        const user = new iam.User(stack, 'MyUser');
        stream.grantRead(user);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyStream5C050E93: {
                    Type: 'AWS::Kinesis::Stream',
                    Properties: {
                        ShardCount: 1,
                        StreamModeDetails: {
                            StreamMode: lib_1.StreamMode.PROVISIONED,
                        },
                        RetentionPeriodHours: 24,
                        StreamEncryption: {
                            'Fn::If': [
                                'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                {
                                    Ref: 'AWS::NoValue',
                                },
                                {
                                    EncryptionType: 'KMS',
                                    KeyId: 'alias/aws/kinesis',
                                },
                            ],
                        },
                    },
                },
                MyUserDC45028B: {
                    Type: 'AWS::IAM::User',
                },
                MyUserDefaultPolicy7B897426: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: [
                                        'kinesis:DescribeStreamSummary',
                                        'kinesis:GetRecords',
                                        'kinesis:GetShardIterator',
                                        'kinesis:ListShards',
                                        'kinesis:SubscribeToShard',
                                        'kinesis:DescribeStream',
                                        'kinesis:ListStreams',
                                        'kinesis:DescribeStreamConsumer',
                                    ],
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                                    },
                                },
                            ],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'MyUserDefaultPolicy7B897426',
                        Users: [
                            {
                                Ref: 'MyUserDC45028B',
                            },
                        ],
                    },
                },
            },
            Conditions: {
                AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                    'Fn::Or': [
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-north-1',
                            ],
                        },
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-northwest-1',
                            ],
                        },
                    ],
                },
            },
        });
    }),
        test('grantWrite creates and attaches a policy with write only access to Stream', () => {
            const stack = new core_1.Stack();
            const stream = new lib_1.Stream(stack, 'MyStream');
            const user = new iam.User(stack, 'MyUser');
            stream.grantWrite(user);
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                    MyUserDC45028B: {
                        Type: 'AWS::IAM::User',
                    },
                    MyUserDefaultPolicy7B897426: {
                        Type: 'AWS::IAM::Policy',
                        Properties: {
                            PolicyDocument: {
                                Statement: [
                                    {
                                        Action: ['kinesis:ListShards', 'kinesis:PutRecord', 'kinesis:PutRecords'],
                                        Effect: 'Allow',
                                        Resource: {
                                            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                                        },
                                    },
                                ],
                                Version: '2012-10-17',
                            },
                            PolicyName: 'MyUserDefaultPolicy7B897426',
                            Users: [
                                {
                                    Ref: 'MyUserDC45028B',
                                },
                            ],
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        }),
        test('grantReadWrite creates and attaches a policy with write only access to Stream', () => {
            const stack = new core_1.Stack();
            const stream = new lib_1.Stream(stack, 'MyStream');
            const user = new iam.User(stack, 'MyUser');
            stream.grantReadWrite(user);
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                    MyUserDC45028B: {
                        Type: 'AWS::IAM::User',
                    },
                    MyUserDefaultPolicy7B897426: {
                        Type: 'AWS::IAM::Policy',
                        Properties: {
                            PolicyDocument: {
                                Statement: [
                                    {
                                        Action: [
                                            'kinesis:DescribeStreamSummary',
                                            'kinesis:GetRecords',
                                            'kinesis:GetShardIterator',
                                            'kinesis:ListShards',
                                            'kinesis:SubscribeToShard',
                                            'kinesis:DescribeStream',
                                            'kinesis:ListStreams',
                                            'kinesis:DescribeStreamConsumer',
                                            'kinesis:PutRecord',
                                            'kinesis:PutRecords',
                                        ],
                                        Effect: 'Allow',
                                        Resource: {
                                            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                                        },
                                    },
                                ],
                                Version: '2012-10-17',
                            },
                            PolicyName: 'MyUserDefaultPolicy7B897426',
                            Users: [
                                {
                                    Ref: 'MyUserDC45028B',
                                },
                            ],
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        }),
        test('grant creates and attaches a policy to Stream which includes supplied permissions', () => {
            const stack = new core_1.Stack();
            const stream = new lib_1.Stream(stack, 'MyStream');
            const user = new iam.User(stack, 'MyUser');
            stream.grant(user, 'kinesis:DescribeStream');
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                    MyUserDC45028B: {
                        Type: 'AWS::IAM::User',
                    },
                    MyUserDefaultPolicy7B897426: {
                        Type: 'AWS::IAM::Policy',
                        Properties: {
                            PolicyDocument: {
                                Statement: [
                                    {
                                        Action: 'kinesis:DescribeStream',
                                        Effect: 'Allow',
                                        Resource: {
                                            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                                        },
                                    },
                                ],
                                Version: '2012-10-17',
                            },
                            PolicyName: 'MyUserDefaultPolicy7B897426',
                            Users: [
                                {
                                    Ref: 'MyUserDC45028B',
                                },
                            ],
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
            });
        }),
        test('cross-stack permissions - no encryption', () => {
            const app = new core_1.App();
            const stackA = new core_1.Stack(app, 'stackA');
            const streamFromStackA = new lib_1.Stream(stackA, 'MyStream');
            const stackB = new core_1.Stack(app, 'stackB');
            const user = new iam.User(stackB, 'UserWhoNeedsAccess');
            streamFromStackA.grantRead(user);
            assertions_1.Template.fromStack(stackA).templateMatches({
                Resources: {
                    MyStream5C050E93: {
                        Type: 'AWS::Kinesis::Stream',
                        Properties: {
                            ShardCount: 1,
                            StreamModeDetails: {
                                StreamMode: lib_1.StreamMode.PROVISIONED,
                            },
                            RetentionPeriodHours: 24,
                            StreamEncryption: {
                                'Fn::If': [
                                    'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                    {
                                        Ref: 'AWS::NoValue',
                                    },
                                    {
                                        EncryptionType: 'KMS',
                                        KeyId: 'alias/aws/kinesis',
                                    },
                                ],
                            },
                        },
                    },
                },
                Conditions: {
                    AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                        'Fn::Or': [
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-north-1',
                                ],
                            },
                            {
                                'Fn::Equals': [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'cn-northwest-1',
                                ],
                            },
                        ],
                    },
                },
                Outputs: {
                    ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD: {
                        Value: {
                            'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                        },
                        Export: {
                            Name: 'stackA:ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD',
                        },
                    },
                },
            });
        }),
        test('cross stack permissions - with encryption', () => {
            const app = new core_1.App();
            const stackA = new core_1.Stack(app, 'stackA');
            const streamFromStackA = new lib_1.Stream(stackA, 'MyStream', {
                encryption: lib_1.StreamEncryption.KMS,
            });
            const stackB = new core_1.Stack(app, 'stackB');
            const user = new iam.User(stackB, 'UserWhoNeedsAccess');
            streamFromStackA.grantRead(user);
            assertions_1.Template.fromStack(stackB).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([{
                            Action: 'kms:Decrypt',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::ImportValue': 'stackA:ExportsOutputFnGetAttMyStreamKey76F3300EArn190947B4',
                            },
                        }]),
                },
            });
        });
    test('accepts if retentionPeriodHours is a Token', () => {
        const stack = new core_1.Stack();
        const parameter = new core_1.CfnParameter(stack, 'my-retention-period', {
            type: 'Number',
            default: 48,
            minValue: 24,
            maxValue: 8760,
        });
        new lib_1.Stream(stack, 'MyStream', {
            retentionPeriod: core_1.Duration.hours(parameter.valueAsNumber),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Parameters: {
                myretentionperiod: {
                    Type: 'Number',
                    Default: 48,
                    MaxValue: 8760,
                    MinValue: 24,
                },
            },
            Resources: {
                MyStream5C050E93: {
                    Type: 'AWS::Kinesis::Stream',
                    Properties: {
                        ShardCount: 1,
                        StreamModeDetails: {
                            StreamMode: lib_1.StreamMode.PROVISIONED,
                        },
                        RetentionPeriodHours: {
                            Ref: 'myretentionperiod',
                        },
                        StreamEncryption: {
                            'Fn::If': [
                                'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                                {
                                    Ref: 'AWS::NoValue',
                                },
                                {
                                    EncryptionType: 'KMS',
                                    KeyId: 'alias/aws/kinesis',
                                },
                            ],
                        },
                    },
                },
            },
            Conditions: {
                AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
                    'Fn::Or': [
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-north-1',
                            ],
                        },
                        {
                            'Fn::Equals': [
                                {
                                    Ref: 'AWS::Region',
                                },
                                'cn-northwest-1',
                            ],
                        },
                    ],
                },
            },
        });
    });
    test('basic stream-level metrics (StreamName dimension only)', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fiveMinutes = {
            amount: 5,
            unit: {
                label: 'minutes',
                isoLabel: 'M',
                inMillis: 60000,
            },
        };
        // WHEN
        const stream = new lib_1.Stream(stack, 'MyStream');
        // THEN
        // should resolve the basic metrics (source https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html#kinesis-metrics-stream)
        expect(stack.resolve(stream.metricGetRecordsBytes())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Bytes',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricGetRecordsIteratorAgeMilliseconds())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.IteratorAgeMilliseconds',
            period: fiveMinutes,
            statistic: 'Maximum',
        });
        expect(stack.resolve(stream.metricGetRecordsLatency())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Latency',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricGetRecords())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Records',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricGetRecordsSuccess())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Success',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricIncomingBytes())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'IncomingBytes',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricIncomingRecords())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'IncomingRecords',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsBytes())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Bytes',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsLatency())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Latency',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsSuccess())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.Success',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsTotalRecords())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.TotalRecords',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsSuccessfulRecords())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.SuccessfulRecords',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsFailedRecords())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.FailedRecords',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricPutRecordsThrottledRecords())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'PutRecords.ThrottledRecords',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricReadProvisionedThroughputExceeded())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'ReadProvisionedThroughputExceeded',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricWriteProvisionedThroughputExceeded())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'WriteProvisionedThroughputExceeded',
            period: fiveMinutes,
            statistic: 'Average',
        });
    });
    test('allow to overide metric options', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fiveMinutes = {
            amount: 5,
            unit: {
                label: 'minutes',
                isoLabel: 'M',
                inMillis: 60000,
            },
        };
        // WHEN
        const stream = new lib_1.Stream(stack, 'MyStream');
        // THEN
        expect(stack.resolve(stream.metricGetRecordsBytes())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Bytes',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricGetRecordsBytes({
            period: core_1.Duration.minutes(1),
            statistic: 'Maximum',
        }))).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'GetRecords.Bytes',
            period: { ...fiveMinutes, amount: 1 },
            statistic: 'Maximum',
        });
        expect(stack.resolve(stream.metricIncomingBytes())).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'IncomingBytes',
            period: fiveMinutes,
            statistic: 'Average',
        });
        expect(stack.resolve(stream.metricIncomingBytes({
            period: core_1.Duration.minutes(1),
            statistic: 'Sum',
        }))).toEqual({
            dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
            namespace: 'AWS/Kinesis',
            metricName: 'IncomingBytes',
            period: { ...fiveMinutes, amount: 1 },
            statistic: 'Sum',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJlYW0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUFtRTtBQUNuRSxnQ0FBOEQ7QUFFOUQsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTlCLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQUU7Z0JBQ1QsZ0JBQWdCLEVBQUU7b0JBQ2hCLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLFVBQVUsRUFBRTt3QkFDVixVQUFVLEVBQUUsQ0FBQzt3QkFDYixpQkFBaUIsRUFBRTs0QkFDakIsVUFBVSxFQUFFLGdCQUFVLENBQUMsV0FBVzt5QkFDbkM7d0JBQ0Qsb0JBQW9CLEVBQUUsRUFBRTt3QkFDeEIsZ0JBQWdCLEVBQUU7NEJBQ2hCLFFBQVEsRUFBRTtnQ0FDUixpREFBaUQ7Z0NBQ2pEO29DQUNFLEdBQUcsRUFBRSxjQUFjO2lDQUNwQjtnQ0FDRDtvQ0FDRSxjQUFjLEVBQUUsS0FBSztvQ0FDckIsS0FBSyxFQUFFLG1CQUFtQjtpQ0FDM0I7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELFVBQVUsRUFBRTtnQkFDViwrQ0FBK0MsRUFBRTtvQkFDL0MsUUFBUSxFQUFFO3dCQUNSOzRCQUNFLFlBQVksRUFBRTtnQ0FDWjtvQ0FDRSxHQUFHLEVBQUUsYUFBYTtpQ0FDbkI7Z0NBQ0QsWUFBWTs2QkFDYjt5QkFDRjt3QkFDRDs0QkFDRSxZQUFZLEVBQUU7Z0NBQ1o7b0NBQ0UsR0FB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RSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsTUFBTSxFQUFFLEVBQUUsR0FBRyxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUNyQyxTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzFELFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFFO1lBQ3ZELFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFVBQVUsRUFBRSxlQUFlO1lBQzNCLE1BQU0sRUFBRSxXQUFXO1lBQ25CLFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztZQUM5QyxNQUFNLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDM0IsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDWCxVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsRUFBRTtZQUN2RCxTQUFTLEVBQUUsYUFBYTtZQUN4QixVQUFVLEVBQUUsZUFBZTtZQUMzQixNQUFNLEVBQUUsRUFBRSxHQUFHLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQ3JDLFNBQVMsRUFBRSxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFN0YWNrLCBDZm5QYXJhbWV0ZXIgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFN0cmVhbSwgU3RyZWFtRW5jcnlwdGlvbiwgU3RyZWFtTW9kZSB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdLaW5lc2lzIGRhdGEgc3RyZWFtcycsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBzdHJlYW0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVN0cmVhbTVDMDUwRTkzOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6S2luZXNpczo6U3RyZWFtJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTaGFyZENvdW50OiAxLFxuICAgICAgICAgICAgU3RyZWFtTW9kZURldGFpbHM6IHtcbiAgICAgICAgICAgICAgU3RyZWFtTW9kZTogU3RyZWFtTW9kZS5QUk9WSVNJT05FRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXRlbnRpb25QZXJpb2RIb3VyczogMjQsXG4gICAgICAgICAgICBTdHJlYW1FbmNyeXB0aW9uOiB7XG4gICAgICAgICAgICAgICdGbjo6SWYnOiBbXG4gICAgICAgICAgICAgICAgJ0F3c0Nka0tpbmVzaXNFbmNyeXB0ZWRTdHJlYW1zVW5zdXBwb3J0ZWRSZWdpb25zJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6Ok5vVmFsdWUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgRW5jcnlwdGlvblR5cGU6ICdLTVMnLFxuICAgICAgICAgICAgICAgICAgS2V5SWQ6ICdhbGlhcy9hd3Mva2luZXNpcycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBDb25kaXRpb25zOiB7XG4gICAgICAgIEF3c0Nka0tpbmVzaXNFbmNyeXB0ZWRTdHJlYW1zVW5zdXBwb3J0ZWRSZWdpb25zOiB7XG4gICAgICAgICAgJ0ZuOjpPcic6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpFcXVhbHMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2NuLW5vcnRoLTEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpFcXVhbHMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2NuLW5vcnRod2VzdC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ211bHRpcGxlIGRlZmF1bHQgc3RyZWFtcyBvbmx5IGhhdmUgb25lIGNvbmRpdGlvbiBmb3IgZW5jcnlwdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScpO1xuICAgIG5ldyBTdHJlYW0oc3RhY2ssICdNeU90aGVyU3RyZWFtJyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15T3RoZXJTdHJlYW04NkZDQzlDRToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aHdlc3QtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdzdHJlYW0gZnJvbSBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcyA9IFN0cmVhbS5mcm9tU3RyZWFtQXR0cmlidXRlcyhzdGFjaywgJ015U3RyZWFtJywge1xuICAgICAgc3RyZWFtQXJuOiAnYXJuOmF3czpraW5lc2lzOnJlZ2lvbjphY2NvdW50LWlkOnN0cmVhbS9zdHJlYW0tbmFtZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qocy5zdHJlYW1Bcm4pLnRvRXF1YWwoJ2Fybjphd3M6a2luZXNpczpyZWdpb246YWNjb3VudC1pZDpzdHJlYW0vc3RyZWFtLW5hbWUnKTtcbiAgfSksXG5cbiAgdGVzdCgndXNlcyBleHBsaWNpdCBzaGFyZCBjb3VudCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScsIHtcbiAgICAgIHNoYXJkQ291bnQ6IDIsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMixcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aHdlc3QtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCd1c2VzIGV4cGxpY2l0IHJldGVudGlvbiBwZXJpb2QnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nLCB7XG4gICAgICByZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLmhvdXJzKDE2OCksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDE2OCxcbiAgICAgICAgICAgIFN0cmVhbUVuY3J5cHRpb246IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJZic6IFtcbiAgICAgICAgICAgICAgICAnQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnMnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6Tm9WYWx1ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBFbmNyeXB0aW9uVHlwZTogJ0tNUycsXG4gICAgICAgICAgICAgICAgICBLZXlJZDogJ2FsaWFzL2F3cy9raW5lc2lzJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIENvbmRpdGlvbnM6IHtcbiAgICAgICAgQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnM6IHtcbiAgICAgICAgICAnRm46Ok9yJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGgtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGh3ZXN0LTEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgncmV0ZW50aW9uIHBlcmlvZCBtdXN0IGJlIGJldHdlZW4gMjQgYW5kIDg3NjAgaG91cnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBTdHJlYW0obmV3IFN0YWNrKCksICdNeVN0cmVhbScsIHtcbiAgICAgICAgcmV0ZW50aW9uUGVyaW9kOiBEdXJhdGlvbi5ob3Vycyg4NzYxKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL3JldGVudGlvblBlcmlvZCBtdXN0IGJlIGJldHdlZW4gMjQgYW5kIDg3NjAgaG91cnMuIFJlY2VpdmVkIDg3NjEvKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgU3RyZWFtKG5ldyBTdGFjaygpLCAnTXlTdHJlYW0nLCB7XG4gICAgICAgIHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uaG91cnMoMjMpLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvcmV0ZW50aW9uUGVyaW9kIG11c3QgYmUgYmV0d2VlbiAyNCBhbmQgODc2MCBob3Vycy4gUmVjZWl2ZWQgMjMvKTtcbiAgfSksXG5cbiAgdGVzdCgndXNlcyBLaW5lc2lzIG1hc3RlciBrZXkgaWYgTUFOQUdFRCBlbmNyeXB0aW9uIHR5cGUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScsIHtcbiAgICAgIGVuY3J5cHRpb246IFN0cmVhbUVuY3J5cHRpb24uTUFOQUdFRCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICBFbmNyeXB0aW9uVHlwZTogJ0tNUycsXG4gICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnZW5jcnlwdGlvbiBrZXkgY2Fubm90IGJlIHN1cHBsaWVkIHdpdGggVU5FTkNSWVBURUQgYXMgdGhlIGVuY3J5cHRpb24gdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnbXlLZXknKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nLCB7XG4gICAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgICAgZW5jcnlwdGlvbjogU3RyZWFtRW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL2VuY3J5cHRpb25LZXkgaXMgc3BlY2lmaWVkLCBzbyAnZW5jcnlwdGlvbicgbXVzdCBiZSBzZXQgdG8gS01TLyk7XG4gIH0pLFxuXG4gIHRlc3QoJ2lmIGEgS01TIGtleSBpcyBzdXBwbGllZCwgaW5mZXJzIEtNUyBhcyB0aGUgZW5jcnlwdGlvbiB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ215S2V5Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFN0cmVhbShzdGFjaywgJ215U3RyZWFtJywge1xuICAgICAgZW5jcnlwdGlvbktleToga2V5LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktpbmVzaXM6OlN0cmVhbScsIHtcbiAgICAgIFNoYXJkQ291bnQ6IDEsXG4gICAgICBTdHJlYW1Nb2RlRGV0YWlsczoge1xuICAgICAgICBTdHJlYW1Nb2RlOiBTdHJlYW1Nb2RlLlBST1ZJU0lPTkVELFxuICAgICAgfSxcbiAgICAgIFJldGVudGlvblBlcmlvZEhvdXJzOiAyNCxcbiAgICAgIFN0cmVhbUVuY3J5cHRpb246IHtcbiAgICAgICAgRW5jcnlwdGlvblR5cGU6ICdLTVMnLFxuICAgICAgICBLZXlJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteUtleTQ0MUExRTczJywgJ0FybiddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnYXV0by1jcmVhdGVzIEtNUyBrZXkgaWYgZW5jcnlwdGlvbiB0eXBlIGlzIEtNUyBidXQgbm8ga2V5IGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShzdGFjaywgJ015U3RyZWFtJywge1xuICAgICAgZW5jcnlwdGlvbjogU3RyZWFtRW5jcnlwdGlvbi5LTVMsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIERlc2NyaXB0aW9uOiAnQ3JlYXRlZCBieSBEZWZhdWx0L015U3RyZWFtJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktpbmVzaXM6OlN0cmVhbScsIHtcbiAgICAgIFN0cmVhbUVuY3J5cHRpb246IHtcbiAgICAgICAgRW5jcnlwdGlvblR5cGU6ICdLTVMnLFxuICAgICAgICBLZXlJZDogc3RhY2sucmVzb2x2ZShzdHJlYW0uZW5jcnlwdGlvbktleT8ua2V5QXJuKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ3VzZXMgZXhwbGljaXQgS01TIGtleSBpZiBlbmNyeXB0aW9uIHR5cGUgaXMgS01TIGFuZCBhIGtleSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGV4cGxpY2l0S2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdFeHBsaWNpdEtleScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnRXhwbGljaXQgS2V5JyxcbiAgICB9KTtcbiAgICBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nLCB7XG4gICAgICBlbmNyeXB0aW9uOiBTdHJlYW1FbmNyeXB0aW9uLktNUyxcbiAgICAgIGVuY3J5cHRpb25LZXk6IGV4cGxpY2l0S2V5LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBEZXNjcmlwdGlvbjogJ0V4cGxpY2l0IEtleScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLaW5lc2lzOjpTdHJlYW0nLCB7XG4gICAgICBTaGFyZENvdW50OiAxLFxuICAgICAgU3RyZWFtTW9kZURldGFpbHM6IHtcbiAgICAgICAgU3RyZWFtTW9kZTogU3RyZWFtTW9kZS5QUk9WSVNJT05FRCxcbiAgICAgIH0sXG4gICAgICBSZXRlbnRpb25QZXJpb2RIb3VyczogMjQsXG4gICAgICBTdHJlYW1FbmNyeXB0aW9uOiB7XG4gICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgS2V5SWQ6IHN0YWNrLnJlc29sdmUoZXhwbGljaXRLZXkua2V5QXJuKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ3VzZXMgZXhwbGljaXQgcHJvdmlzaW9uZWQgc3RyZWFtTW9kZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScsIHtcbiAgICAgIHN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aHdlc3QtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1c2VzIGV4cGxpY2l0IG9uLWRlbWFuZCBzdHJlYW1Nb2RlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IFN0cmVhbShzdGFjaywgJ015U3RyZWFtJywge1xuICAgICAgc3RyZWFtTW9kZTogU3RyZWFtTW9kZS5PTl9ERU1BTkQsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtTW9kZURldGFpbHM6IHtcbiAgICAgICAgICAgICAgU3RyZWFtTW9kZTogU3RyZWFtTW9kZS5PTl9ERU1BTkQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aHdlc3QtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiB1c2luZyBzaGFyZENvdW50IHdpdGggb24tZGVtYW5kIHN0cmVhbU1vZGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nLCB7XG4gICAgICAgIHNoYXJkQ291bnQ6IDIsXG4gICAgICAgIHN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuT05fREVNQU5ELFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdyhgc3RyZWFtTW9kZSBtdXN0IGJlIHNldCB0byAke1N0cmVhbU1vZGUuUFJPVklTSU9ORUR9IChkZWZhdWx0KSB3aGVuIHNwZWNpZnlpbmcgc2hhcmRDb3VudGApO1xuICB9KTtcblxuICB0ZXN0KCdncmFudFJlYWQgY3JlYXRlcyBhbmQgYXR0YWNoZXMgYSBwb2xpY3kgd2l0aCByZWFkIG9ubHkgYWNjZXNzIHRvIHRoZSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nLCB7XG4gICAgICBlbmNyeXB0aW9uOiBTdHJlYW1FbmNyeXB0aW9uLktNUyxcbiAgICB9KTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgc3RyZWFtLmdyYW50UmVhZCh1c2VyKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICBBY3Rpb246ICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiBzdGFjay5yZXNvbHZlKHN0cmVhbS5lbmNyeXB0aW9uS2V5Py5rZXlBcm4pLFxuICAgICAgICB9XSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S2luZXNpczo6U3RyZWFtJywge1xuICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICBLZXlJZDogc3RhY2sucmVzb2x2ZShzdHJlYW0uZW5jcnlwdGlvbktleT8ua2V5QXJuKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50UmVhZFdyaXRlIGNyZWF0ZXMgYW5kIGF0dGFjaGVzIGEgcG9saWN5IHRvIHRoZSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nLCB7XG4gICAgICBlbmNyeXB0aW9uOiBTdHJlYW1FbmNyeXB0aW9uLktNUyxcbiAgICB9KTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgc3RyZWFtLmdyYW50UmVhZFdyaXRlKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgIEFjdGlvbjogWydrbXM6RGVjcnlwdCcsICdrbXM6RW5jcnlwdCcsICdrbXM6UmVFbmNyeXB0KicsICdrbXM6R2VuZXJhdGVEYXRhS2V5KiddLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogc3RhY2sucmVzb2x2ZShzdHJlYW0uZW5jcnlwdGlvbktleT8ua2V5QXJuKSxcbiAgICAgICAgfV0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktpbmVzaXM6OlN0cmVhbScsIHtcbiAgICAgIFN0cmVhbUVuY3J5cHRpb246IHtcbiAgICAgICAgS2V5SWQ6IHN0YWNrLnJlc29sdmUoc3RyZWFtLmVuY3J5cHRpb25LZXk/LmtleUFybiksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudFJlYWQgY3JlYXRlcyBhbmQgYXNzb2NpYXRlcyBhIHBvbGljeSB3aXRoIHJlYWQgb25seSBhY2Nlc3MgdG8gU3RyZWFtJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShzdGFjaywgJ015U3RyZWFtJyk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuICAgIHN0cmVhbS5ncmFudFJlYWQodXNlcik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15VXNlckRDNDUwMjhCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgfSxcbiAgICAgICAgTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgICAna2luZXNpczpEZXNjcmliZVN0cmVhbVN1bW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAna2luZXNpczpHZXRSZWNvcmRzJyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6R2V0U2hhcmRJdGVyYXRvcicsXG4gICAgICAgICAgICAgICAgICAgICdraW5lc2lzOkxpc3RTaGFyZHMnLFxuICAgICAgICAgICAgICAgICAgICAna2luZXNpczpTdWJzY3JpYmVUb1NoYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6RGVzY3JpYmVTdHJlYW0nLFxuICAgICAgICAgICAgICAgICAgICAna2luZXNpczpMaXN0U3RyZWFtcycsXG4gICAgICAgICAgICAgICAgICAgICdraW5lc2lzOkRlc2NyaWJlU3RyZWFtQ29uc3VtZXInLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydNeVN0cmVhbTVDMDUwRTkzJywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5TmFtZTogJ015VXNlckRlZmF1bHRQb2xpY3k3Qjg5NzQyNicsXG4gICAgICAgICAgICBVc2VyczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlVc2VyREM0NTAyOEInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIENvbmRpdGlvbnM6IHtcbiAgICAgICAgQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnM6IHtcbiAgICAgICAgICAnRm46Ok9yJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGgtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGh3ZXN0LTEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnZ3JhbnRXcml0ZSBjcmVhdGVzIGFuZCBhdHRhY2hlcyBhIHBvbGljeSB3aXRoIHdyaXRlIG9ubHkgYWNjZXNzIHRvIFN0cmVhbScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICBzdHJlYW0uZ3JhbnRXcml0ZSh1c2VyKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVN0cmVhbTVDMDUwRTkzOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6S2luZXNpczo6U3RyZWFtJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTaGFyZENvdW50OiAxLFxuICAgICAgICAgICAgU3RyZWFtTW9kZURldGFpbHM6IHtcbiAgICAgICAgICAgICAgU3RyZWFtTW9kZTogU3RyZWFtTW9kZS5QUk9WSVNJT05FRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXRlbnRpb25QZXJpb2RIb3VyczogMjQsXG4gICAgICAgICAgICBTdHJlYW1FbmNyeXB0aW9uOiB7XG4gICAgICAgICAgICAgICdGbjo6SWYnOiBbXG4gICAgICAgICAgICAgICAgJ0F3c0Nka0tpbmVzaXNFbmNyeXB0ZWRTdHJlYW1zVW5zdXBwb3J0ZWRSZWdpb25zJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6Ok5vVmFsdWUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgRW5jcnlwdGlvblR5cGU6ICdLTVMnLFxuICAgICAgICAgICAgICAgICAgS2V5SWQ6ICdhbGlhcy9hd3Mva2luZXNpcycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgTXlVc2VyREM0NTAyOEI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlVzZXInLFxuICAgICAgICB9LFxuICAgICAgICBNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjY6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiBbJ2tpbmVzaXM6TGlzdFNoYXJkcycsICdraW5lc2lzOlB1dFJlY29yZCcsICdraW5lc2lzOlB1dFJlY29yZHMnXSxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydNeVN0cmVhbTVDMDUwRTkzJywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5TmFtZTogJ015VXNlckRlZmF1bHRQb2xpY3k3Qjg5NzQyNicsXG4gICAgICAgICAgICBVc2VyczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnTXlVc2VyREM0NTAyOEInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIENvbmRpdGlvbnM6IHtcbiAgICAgICAgQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnM6IHtcbiAgICAgICAgICAnRm46Ok9yJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGgtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGh3ZXN0LTEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnZ3JhbnRSZWFkV3JpdGUgY3JlYXRlcyBhbmQgYXR0YWNoZXMgYSBwb2xpY3kgd2l0aCB3cml0ZSBvbmx5IGFjY2VzcyB0byBTdHJlYW0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgc3RyZWFtLmdyYW50UmVhZFdyaXRlKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15U3RyZWFtNUMwNTBFOTM6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpLaW5lc2lzOjpTdHJlYW0nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFNoYXJkQ291bnQ6IDEsXG4gICAgICAgICAgICBTdHJlYW1Nb2RlRGV0YWlsczoge1xuICAgICAgICAgICAgICBTdHJlYW1Nb2RlOiBTdHJlYW1Nb2RlLlBST1ZJU0lPTkVELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJldGVudGlvblBlcmlvZEhvdXJzOiAyNCxcbiAgICAgICAgICAgIFN0cmVhbUVuY3J5cHRpb246IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJZic6IFtcbiAgICAgICAgICAgICAgICAnQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnMnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6Tm9WYWx1ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBFbmNyeXB0aW9uVHlwZTogJ0tNUycsXG4gICAgICAgICAgICAgICAgICBLZXlJZDogJ2FsaWFzL2F3cy9raW5lc2lzJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeVVzZXJEQzQ1MDI4Qjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6VXNlcicsXG4gICAgICAgIH0sXG4gICAgICAgIE15VXNlckRlZmF1bHRQb2xpY3k3Qjg5NzQyNjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6RGVzY3JpYmVTdHJlYW1TdW1tYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6R2V0UmVjb3JkcycsXG4gICAgICAgICAgICAgICAgICAgICdraW5lc2lzOkdldFNoYXJkSXRlcmF0b3InLFxuICAgICAgICAgICAgICAgICAgICAna2luZXNpczpMaXN0U2hhcmRzJyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6U3Vic2NyaWJlVG9TaGFyZCcsXG4gICAgICAgICAgICAgICAgICAgICdraW5lc2lzOkRlc2NyaWJlU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6TGlzdFN0cmVhbXMnLFxuICAgICAgICAgICAgICAgICAgICAna2luZXNpczpEZXNjcmliZVN0cmVhbUNvbnN1bWVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6UHV0UmVjb3JkJyxcbiAgICAgICAgICAgICAgICAgICAgJ2tpbmVzaXM6UHV0UmVjb3JkcycsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015U3RyZWFtNUMwNTBFOTMnLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQb2xpY3lOYW1lOiAnTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2JyxcbiAgICAgICAgICAgIFVzZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeVVzZXJEQzQ1MDI4QicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aHdlc3QtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdncmFudCBjcmVhdGVzIGFuZCBhdHRhY2hlcyBhIHBvbGljeSB0byBTdHJlYW0gd2hpY2ggaW5jbHVkZXMgc3VwcGxpZWQgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzdHJlYW0gPSBuZXcgU3RyZWFtKHN0YWNrLCAnTXlTdHJlYW0nKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgc3RyZWFtLmdyYW50KHVzZXIsICdraW5lc2lzOkRlc2NyaWJlU3RyZWFtJyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlTdHJlYW01QzA1MEU5Mzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OktpbmVzaXM6OlN0cmVhbScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2hhcmRDb3VudDogMSxcbiAgICAgICAgICAgIFN0cmVhbU1vZGVEZXRhaWxzOiB7XG4gICAgICAgICAgICAgIFN0cmVhbU1vZGU6IFN0cmVhbU1vZGUuUFJPVklTSU9ORUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0ZW50aW9uUGVyaW9kSG91cnM6IDI0LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15VXNlckRDNDUwMjhCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgfSxcbiAgICAgICAgTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ2tpbmVzaXM6RGVzY3JpYmVTdHJlYW0nLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ015U3RyZWFtNUMwNTBFOTMnLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQb2xpY3lOYW1lOiAnTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2JyxcbiAgICAgICAgICAgIFVzZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdNeVVzZXJEQzQ1MDI4QicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aC0xJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6RXF1YWxzJzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdjbi1ub3J0aHdlc3QtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdjcm9zcy1zdGFjayBwZXJtaXNzaW9ucyAtIG5vIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrQSA9IG5ldyBTdGFjayhhcHAsICdzdGFja0EnKTtcbiAgICBjb25zdCBzdHJlYW1Gcm9tU3RhY2tBID0gbmV3IFN0cmVhbShzdGFja0EsICdNeVN0cmVhbScpO1xuXG4gICAgY29uc3Qgc3RhY2tCID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrQicpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2tCLCAnVXNlcldob05lZWRzQWNjZXNzJyk7XG4gICAgc3RyZWFtRnJvbVN0YWNrQS5ncmFudFJlYWQodXNlcik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2tBKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15U3RyZWFtNUMwNTBFOTM6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpLaW5lc2lzOjpTdHJlYW0nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFNoYXJkQ291bnQ6IDEsXG4gICAgICAgICAgICBTdHJlYW1Nb2RlRGV0YWlsczoge1xuICAgICAgICAgICAgICBTdHJlYW1Nb2RlOiBTdHJlYW1Nb2RlLlBST1ZJU0lPTkVELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJldGVudGlvblBlcmlvZEhvdXJzOiAyNCxcbiAgICAgICAgICAgIFN0cmVhbUVuY3J5cHRpb246IHtcbiAgICAgICAgICAgICAgJ0ZuOjpJZic6IFtcbiAgICAgICAgICAgICAgICAnQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnMnLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6Tm9WYWx1ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBFbmNyeXB0aW9uVHlwZTogJ0tNUycsXG4gICAgICAgICAgICAgICAgICBLZXlJZDogJ2FsaWFzL2F3cy9raW5lc2lzJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIENvbmRpdGlvbnM6IHtcbiAgICAgICAgQXdzQ2RrS2luZXNpc0VuY3J5cHRlZFN0cmVhbXNVbnN1cHBvcnRlZFJlZ2lvbnM6IHtcbiAgICAgICAgICAnRm46Ok9yJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGgtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGh3ZXN0LTEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dEZuR2V0QXR0TXlTdHJlYW01QzA1MEU5M0FybjRBQkYzMENEOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydNeVN0cmVhbTVDMDUwRTkzJywgJ0FybiddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRXhwb3J0OiB7XG4gICAgICAgICAgICBOYW1lOiAnc3RhY2tBOkV4cG9ydHNPdXRwdXRGbkdldEF0dE15U3RyZWFtNUMwNTBFOTNBcm40QUJGMzBDRCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLFxuXG4gIHRlc3QoJ2Nyb3NzIHN0YWNrIHBlcm1pc3Npb25zIC0gd2l0aCBlbmNyeXB0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFja0EgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2tBJyk7XG4gICAgY29uc3Qgc3RyZWFtRnJvbVN0YWNrQSA9IG5ldyBTdHJlYW0oc3RhY2tBLCAnTXlTdHJlYW0nLCB7XG4gICAgICBlbmNyeXB0aW9uOiBTdHJlYW1FbmNyeXB0aW9uLktNUyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YWNrQiA9IG5ldyBTdGFjayhhcHAsICdzdGFja0InKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrQiwgJ1VzZXJXaG9OZWVkc0FjY2VzcycpO1xuICAgIHN0cmVhbUZyb21TdGFja0EuZ3JhbnRSZWFkKHVzZXIpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrQikuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICBBY3Rpb246ICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAnRm46OkltcG9ydFZhbHVlJzogJ3N0YWNrQTpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRNeVN0cmVhbUtleTc2RjMzMDBFQXJuMTkwOTQ3QjQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH1dKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FjY2VwdHMgaWYgcmV0ZW50aW9uUGVyaW9kSG91cnMgaXMgYSBUb2tlbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBhcmFtZXRlciA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdteS1yZXRlbnRpb24tcGVyaW9kJywge1xuICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICBkZWZhdWx0OiA0OCxcbiAgICAgIG1pblZhbHVlOiAyNCxcbiAgICAgIG1heFZhbHVlOiA4NzYwLFxuICAgIH0pO1xuXG4gICAgbmV3IFN0cmVhbShzdGFjaywgJ015U3RyZWFtJywge1xuICAgICAgcmV0ZW50aW9uUGVyaW9kOiBEdXJhdGlvbi5ob3VycyhwYXJhbWV0ZXIudmFsdWVBc051bWJlciksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIG15cmV0ZW50aW9ucGVyaW9kOiB7XG4gICAgICAgICAgVHlwZTogJ051bWJlcicsXG4gICAgICAgICAgRGVmYXVsdDogNDgsXG4gICAgICAgICAgTWF4VmFsdWU6IDg3NjAsXG4gICAgICAgICAgTWluVmFsdWU6IDI0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVN0cmVhbTVDMDUwRTkzOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6S2luZXNpczo6U3RyZWFtJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTaGFyZENvdW50OiAxLFxuICAgICAgICAgICAgU3RyZWFtTW9kZURldGFpbHM6IHtcbiAgICAgICAgICAgICAgU3RyZWFtTW9kZTogU3RyZWFtTW9kZS5QUk9WSVNJT05FRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXRlbnRpb25QZXJpb2RIb3Vyczoge1xuICAgICAgICAgICAgICBSZWY6ICdteXJldGVudGlvbnBlcmlvZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RyZWFtRW5jcnlwdGlvbjoge1xuICAgICAgICAgICAgICAnRm46OklmJzogW1xuICAgICAgICAgICAgICAgICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucycsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpOb1ZhbHVlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAgICAgICAgICAgIEtleUlkOiAnYWxpYXMvYXdzL2tpbmVzaXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9uczoge1xuICAgICAgICAgICdGbjo6T3InOiBbXG4gICAgICAgICAgICB7XG5cblxuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGgtMScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkVxdWFscyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY24tbm9ydGh3ZXN0LTEnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYmFzaWMgc3RyZWFtLWxldmVsIG1ldHJpY3MgKFN0cmVhbU5hbWUgZGltZW5zaW9uIG9ubHkpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmaXZlTWludXRlcyA9IHtcbiAgICAgIGFtb3VudDogNSxcbiAgICAgIHVuaXQ6IHtcbiAgICAgICAgbGFiZWw6ICdtaW51dGVzJyxcbiAgICAgICAgaXNvTGFiZWw6ICdNJyxcbiAgICAgICAgaW5NaWxsaXM6IDYwMDAwLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW0oc3RhY2ssICdNeVN0cmVhbScpO1xuXG4gICAgLy8gVEhFTlxuICAgIC8vIHNob3VsZCByZXNvbHZlIHRoZSBiYXNpYyBtZXRyaWNzIChzb3VyY2UgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0cmVhbXMvbGF0ZXN0L2Rldi9tb25pdG9yaW5nLXdpdGgtY2xvdWR3YXRjaC5odG1sI2tpbmVzaXMtbWV0cmljcy1zdHJlYW0pXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY0dldFJlY29yZHNCeXRlcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuQnl0ZXMnLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY0dldFJlY29yZHNJdGVyYXRvckFnZU1pbGxpc2Vjb25kcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuSXRlcmF0b3JBZ2VNaWxsaXNlY29uZHMnLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ01heGltdW0nLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY0dldFJlY29yZHNMYXRlbmN5KCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnR2V0UmVjb3Jkcy5MYXRlbmN5JyxcbiAgICAgIHBlcmlvZDogZml2ZU1pbnV0ZXMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0cmVhbS5tZXRyaWNHZXRSZWNvcmRzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnR2V0UmVjb3Jkcy5SZWNvcmRzJyxcbiAgICAgIHBlcmlvZDogZml2ZU1pbnV0ZXMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0cmVhbS5tZXRyaWNHZXRSZWNvcmRzU3VjY2VzcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuU3VjY2VzcycsXG4gICAgICBwZXJpb2Q6IGZpdmVNaW51dGVzLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdHJlYW0ubWV0cmljSW5jb21pbmdCeXRlcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0luY29taW5nQnl0ZXMnLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY0luY29taW5nUmVjb3JkcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0luY29taW5nUmVjb3JkcycsXG4gICAgICBwZXJpb2Q6IGZpdmVNaW51dGVzLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdHJlYW0ubWV0cmljUHV0UmVjb3Jkc0J5dGVzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5CeXRlcycsXG4gICAgICBwZXJpb2Q6IGZpdmVNaW51dGVzLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdHJlYW0ubWV0cmljUHV0UmVjb3Jkc0xhdGVuY3koKSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiB7IFJlZjogJ015U3RyZWFtNUMwNTBFOTMnIH0gfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdQdXRSZWNvcmRzLkxhdGVuY3knLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY1B1dFJlY29yZHNTdWNjZXNzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5TdWNjZXNzJyxcbiAgICAgIHBlcmlvZDogZml2ZU1pbnV0ZXMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0cmVhbS5tZXRyaWNQdXRSZWNvcmRzVG90YWxSZWNvcmRzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5Ub3RhbFJlY29yZHMnLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY1B1dFJlY29yZHNTdWNjZXNzZnVsUmVjb3JkcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dFJlY29yZHMuU3VjY2Vzc2Z1bFJlY29yZHMnLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY1B1dFJlY29yZHNGYWlsZWRSZWNvcmRzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUHV0UmVjb3Jkcy5GYWlsZWRSZWNvcmRzJyxcbiAgICAgIHBlcmlvZDogZml2ZU1pbnV0ZXMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0cmVhbS5tZXRyaWNQdXRSZWNvcmRzVGhyb3R0bGVkUmVjb3JkcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ1B1dFJlY29yZHMuVGhyb3R0bGVkUmVjb3JkcycsXG4gICAgICBwZXJpb2Q6IGZpdmVNaW51dGVzLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdHJlYW0ubWV0cmljUmVhZFByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnUmVhZFByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkJyxcbiAgICAgIHBlcmlvZDogZml2ZU1pbnV0ZXMsXG4gICAgICBzdGF0aXN0aWM6ICdBdmVyYWdlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0cmVhbS5tZXRyaWNXcml0ZVByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnV3JpdGVQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZCcsXG4gICAgICBwZXJpb2Q6IGZpdmVNaW51dGVzLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IHRvIG92ZXJpZGUgbWV0cmljIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZpdmVNaW51dGVzID0ge1xuICAgICAgYW1vdW50OiA1LFxuICAgICAgdW5pdDoge1xuICAgICAgICBsYWJlbDogJ21pbnV0ZXMnLFxuICAgICAgICBpc29MYWJlbDogJ00nLFxuICAgICAgICBpbk1pbGxpczogNjAwMDAsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbShzdGFjaywgJ015U3RyZWFtJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY0dldFJlY29yZHNCeXRlcygpKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0dldFJlY29yZHMuQnl0ZXMnLFxuICAgICAgcGVyaW9kOiBmaXZlTWludXRlcyxcbiAgICAgIHN0YXRpc3RpYzogJ0F2ZXJhZ2UnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RyZWFtLm1ldHJpY0dldFJlY29yZHNCeXRlcyh7XG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICBzdGF0aXN0aWM6ICdNYXhpbXVtJyxcbiAgICB9KSkpLnRvRXF1YWwoe1xuICAgICAgZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiB7IFJlZjogJ015U3RyZWFtNUMwNTBFOTMnIH0gfSxcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9LaW5lc2lzJyxcbiAgICAgIG1ldHJpY05hbWU6ICdHZXRSZWNvcmRzLkJ5dGVzJyxcbiAgICAgIHBlcmlvZDogeyAuLi5maXZlTWludXRlcywgYW1vdW50OiAxIH0sXG4gICAgICBzdGF0aXN0aWM6ICdNYXhpbXVtJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0cmVhbS5tZXRyaWNJbmNvbWluZ0J5dGVzKCkpKS50b0VxdWFsKHtcbiAgICAgIGRpbWVuc2lvbnM6IHsgU3RyZWFtTmFtZTogeyBSZWY6ICdNeVN0cmVhbTVDMDUwRTkzJyB9IH0sXG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lOiAnSW5jb21pbmdCeXRlcycsXG4gICAgICBwZXJpb2Q6IGZpdmVNaW51dGVzLFxuICAgICAgc3RhdGlzdGljOiAnQXZlcmFnZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdHJlYW0ubWV0cmljSW5jb21pbmdCeXRlcyh7XG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICBzdGF0aXN0aWM6ICdTdW0nLFxuICAgIH0pKSkudG9FcXVhbCh7XG4gICAgICBkaW1lbnNpb25zOiB7IFN0cmVhbU5hbWU6IHsgUmVmOiAnTXlTdHJlYW01QzA1MEU5MycgfSB9LFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0tpbmVzaXMnLFxuICAgICAgbWV0cmljTmFtZTogJ0luY29taW5nQnl0ZXMnLFxuICAgICAgcGVyaW9kOiB7IC4uLmZpdmVNaW51dGVzLCBhbW91bnQ6IDEgfSxcbiAgICAgIHN0YXRpc3RpYzogJ1N1bScsXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=