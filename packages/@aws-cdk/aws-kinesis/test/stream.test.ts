import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Stream, StreamEncryption } from '../lib';

// tslint:disable:object-literal-key-quotes

describe('Kinesis data streams', () => {

  test('default stream', () => {
    const stack = new Stack();

    new Stream(stack, 'MyStream');

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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
    const stack = new Stack();

    new Stream(stack, 'MyStream');
    new Stream(stack, 'MyOtherStream');

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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
    const stack = new Stack();

    const s = Stream.fromStreamAttributes(stack, 'MyStream', {
      streamArn: 'arn:aws:kinesis:region:account-id:stream/stream-name',
    });

    expect(s.streamArn).toEqual('arn:aws:kinesis:region:account-id:stream/stream-name');
  }),

  test('uses explicit shard count', () => {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      shardCount: 2,
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 2,
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
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      retentionPeriod: Duration.hours(168),
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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

  test('retention period must be between 24 and 168 hours', () => {
    expect(() => {
      new Stream(new Stack(), 'MyStream', {
        retentionPeriod: Duration.hours(169),
      });
    }).toThrow(/retentionPeriod must be between 24 and 168 hours. Received 169/);

    expect(() => {
      new Stream(new Stack(), 'MyStream', {
        retentionPeriod: Duration.hours(23),
      });
    }).toThrow(/retentionPeriod must be between 24 and 168 hours. Received 23/);
  }),

  test('uses Kinesis master key if MANAGED encryption type is provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.MANAGED,
    });

    // THEN
    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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
    const stack = new Stack();
    const key = new kms.Key(stack, 'myKey');

    expect(() => {
      new Stream(stack, 'MyStream', {
        encryptionKey: key,
        encryption: StreamEncryption.UNENCRYPTED,
      });
    }).toThrow(/encryptionKey is specified, so 'encryption' must be set to KMS/);
  }),

  test('if a KMS key is supplied, infers KMS as the encryption type', () => {
    // GIVEN
    const stack = new Stack();
    const key = new kms.Key(stack, 'myKey');

    // WHEN
    new Stream(stack, 'myStream', {
      encryptionKey: key,
    });

    // THEN
    expect(stack).toHaveResource('AWS::Kinesis::Stream', {
      ShardCount: 1,
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
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyStreamKey76F3300E: {
          Type: 'AWS::KMS::Key',
          Properties: {
            Description: 'Created by MyStream',
            KeyPolicy: {
              Statement: [
                {
                  Action: [
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
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            ShardCount: 1,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
              },
            },
          },
        },
      },
    });
  }),

  test('uses explicit KMS key if encryption type is KMS and a key is provided', () => {
    const stack = new Stack();

    const explicitKey = new kms.Key(stack, 'ExplicitKey', {
      description: 'Explicit Key',
    });

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
      encryptionKey: explicitKey,
    });

    expect(stack).toMatchTemplate({
      Resources: {
        ExplicitKey7DF42F37: {
          Type: 'AWS::KMS::Key',
          Properties: {
            Description: 'Explicit Key',
            KeyPolicy: {
              Statement: [
                {
                  Action: [
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
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            ShardCount: 1,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['ExplicitKey7DF42F37', 'Arn'],
              },
            },
          },
        },
      },
    });
  }),

  test('grantRead creates and attaches a policy with read only access to Stream and EncryptionKey', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const user = new iam.User(stack, 'MyUser');
    stream.grantRead(user);

    expect(stack).toMatchTemplate({
      Resources: {
        MyStreamKey76F3300E: {
          Type: 'AWS::KMS::Key',
          Properties: {
            KeyPolicy: {
              Statement: [
                {
                  Action: [
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
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                  Resource: '*',
                },
                {
                  Action: 'kms:Decrypt',
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::GetAtt': ['MyUserDC45028B', 'Arn'],
                    },
                  },
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
            Description: 'Created by MyStream',
          },
          UpdateReplacePolicy: 'Retain',
          DeletionPolicy: 'Retain',
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            RetentionPeriodHours: 24,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
              },
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
                    'kinesis:DescribeStream',
                    'kinesis:DescribeStreamSummary',
                    'kinesis:GetRecords',
                    'kinesis:GetShardIterator',
                    'kinesis:ListShards',
                    'kinesis:SubscribeToShard',
                  ],
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                  },
                },
                {
                  Action: 'kms:Decrypt',
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
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
    });
  }),

  test('grantWrite creates and attaches a policy with write only access to Stream and EncryptionKey', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const user = new iam.User(stack, 'MyUser');
    stream.grantWrite(user);

    expect(stack).toMatchTemplate({
      Resources: {
        MyStreamKey76F3300E: {
          Type: 'AWS::KMS::Key',
          Properties: {
            KeyPolicy: {
              Statement: [
                {
                  Action: [
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
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                  Resource: '*',
                },
                {
                  Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::GetAtt': ['MyUserDC45028B', 'Arn'],
                    },
                  },
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
            Description: 'Created by MyStream',
          },
          UpdateReplacePolicy: 'Retain',
          DeletionPolicy: 'Retain',
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            RetentionPeriodHours: 24,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
              },
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
                {
                  Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
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
    });
  }),

  test('grantReadWrite creates and attaches a policy with access to Stream and EncryptionKey', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const user = new iam.User(stack, 'MyUser');
    stream.grantReadWrite(user);

    expect(stack).toMatchTemplate({
      Resources: {
        MyStreamKey76F3300E: {
          Type: 'AWS::KMS::Key',
          Properties: {
            Description: 'Created by MyStream',
            KeyPolicy: {
              Statement: [
                {
                  Action: [
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
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition',
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId',
                          },
                          ':root',
                        ],
                      ],
                    },
                  },
                  Resource: '*',
                },
                {
                  Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::GetAtt': ['MyUserDC45028B', 'Arn'],
                    },
                  },
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            ShardCount: 1,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
              },
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
                    'kinesis:DescribeStream',
                    'kinesis:DescribeStreamSummary',
                    'kinesis:GetRecords',
                    'kinesis:GetShardIterator',
                    'kinesis:ListShards',
                    'kinesis:SubscribeToShard',
                    'kinesis:PutRecord',
                    'kinesis:PutRecords',
                  ],
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': ['MyStream5C050E93', 'Arn'],
                  },
                },
                {
                  Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn'],
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
    });
  }),

  test('grantRead creates and associates a policy with read only access to Stream', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream');

    const user = new iam.User(stack, 'MyUser');
    stream.grantRead(user);

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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
                    'kinesis:DescribeStream',
                    'kinesis:DescribeStreamSummary',
                    'kinesis:GetRecords',
                    'kinesis:GetShardIterator',
                    'kinesis:ListShards',
                    'kinesis:SubscribeToShard',
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
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream');

    const user = new iam.User(stack, 'MyUser');
    stream.grantWrite(user);

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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

  test('greatReadWrite creates and attaches a policy with write only access to Stream', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream');

    const user = new iam.User(stack, 'MyUser');
    stream.grantReadWrite(user);

    expect(stack).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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
                    'kinesis:DescribeStream',
                    'kinesis:DescribeStreamSummary',
                    'kinesis:GetRecords',
                    'kinesis:GetShardIterator',
                    'kinesis:ListShards',
                    'kinesis:SubscribeToShard',
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

  test('cross-stack permissions - no encryption', () => {
    const app = new App();
    const stackA = new Stack(app, 'stackA');
    const streamFromStackA = new Stream(stackA, 'MyStream');

    const stackB = new Stack(app, 'stackB');
    const user = new iam.User(stackB, 'UserWhoNeedsAccess');
    streamFromStackA.grantRead(user);

    expect(stackA).toMatchTemplate({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
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

  test('fails with encryption due to cyclic dependency', () => {
    const app = new App();
    const stackA = new Stack(app, 'stackA');
    const streamFromStackA = new Stream(stackA, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const stackB = new Stack(app, 'stackB');
    const user = new iam.User(stackB, 'UserWhoNeedsAccess');
    streamFromStackA.grantRead(user);
    expect(() => {
      app.synth();
    }).toThrow(/'stack.' depends on 'stack.'/);
  });
});
