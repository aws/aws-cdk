import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { testFutureBehavior } from '@aws-cdk/cdk-build-tools';
import { App, Duration, Stack, CfnParameter } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Stream, StreamEncryption, StreamMode } from '../lib';

/* eslint-disable quote-props */

describe('Kinesis data streams', () => {

  test('default stream', () => {
    const stack = new Stack();

    new Stream(stack, 'MyStream');

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();

    new Stream(stack, 'MyStream');
    new Stream(stack, 'MyOtherStream');

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
              StreamMode: StreamMode.PROVISIONED,
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

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 2,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      retentionPeriod: Duration.hours(168),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
      new Stream(new Stack(), 'MyStream', {
        retentionPeriod: Duration.hours(8761),
      });
    }).toThrow(/retentionPeriod must be between 24 and 8760 hours. Received 8761/);

    expect(() => {
      new Stream(new Stack(), 'MyStream', {
        retentionPeriod: Duration.hours(23),
      });
    }).toThrow(/retentionPeriod must be between 24 and 8760 hours. Received 23/);
  }),

  test('uses Kinesis master key if MANAGED encryption type is provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.MANAGED,
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
      ShardCount: 1,
      StreamModeDetails: {
        StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();

    const stream = new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      Description: 'Created by Default/MyStream',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
      StreamEncryption: {
        EncryptionType: 'KMS',
        KeyId: stack.resolve(stream.encryptionKey?.keyArn),
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

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      Description: 'Explicit Key',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
      ShardCount: 1,
      StreamModeDetails: {
        StreamMode: StreamMode.PROVISIONED,
      },
      RetentionPeriodHours: 24,
      StreamEncryption: {
        EncryptionType: 'KMS',
        KeyId: stack.resolve(explicitKey.keyArn),
      },
    });
  }),

  test('uses explicit provisioned streamMode', () => {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      streamMode: StreamMode.PROVISIONED,
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      streamMode: StreamMode.ON_DEMAND,
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            StreamModeDetails: {
              StreamMode: StreamMode.ON_DEMAND,
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
    const stack = new Stack();

    expect(() => {
      new Stream(stack, 'MyStream', {
        shardCount: 2,
        streamMode: StreamMode.ON_DEMAND,
      });
    }).toThrow(`streamMode must be set to ${StreamMode.PROVISIONED} (default) when specifying shardCount`);
  });

  test('grantRead creates and attaches a policy with read only access to the principal', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const user = new iam.User(stack, 'MyUser');
    stream.grantRead(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
          Action: 'kms:Decrypt',
          Effect: 'Allow',
          Resource: stack.resolve(stream.encryptionKey?.keyArn),
        }]),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
      StreamEncryption: {
        KeyId: stack.resolve(stream.encryptionKey?.keyArn),
      },
    });
  });

  test('grantReadWrite creates and attaches a policy to the principal', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const user = new iam.User(stack, 'MyUser');
    stream.grantReadWrite(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
          Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
          Effect: 'Allow',
          Resource: stack.resolve(stream.encryptionKey?.keyArn),
        }]),
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::Stream', {
      StreamEncryption: {
        KeyId: stack.resolve(stream.encryptionKey?.keyArn),
      },
    });
  });

  test('grantRead creates and associates a policy with read only access to Stream', () => {
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream');

    const user = new iam.User(stack, 'MyUser');
    stream.grantRead(user);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream');

    const user = new iam.User(stack, 'MyUser');
    stream.grantReadWrite(user);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();
    const stream = new Stream(stack, 'MyStream');

    const user = new iam.User(stack, 'MyUser');
    stream.grant(user, 'kinesis:DescribeStream');

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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
    const app = new App();
    const stackA = new Stack(app, 'stackA');
    const streamFromStackA = new Stream(stackA, 'MyStream');

    const stackB = new Stack(app, 'stackB');
    const user = new iam.User(stackB, 'UserWhoNeedsAccess');
    streamFromStackA.grantRead(user);

    Template.fromStack(stackA).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            StreamModeDetails: {
              StreamMode: StreamMode.PROVISIONED,
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

  testFutureBehavior('cross stack permissions - with encryption', { [cxapi.KMS_DEFAULT_KEY_POLICIES]: true }, App, (app) => {
    const stackA = new Stack(app, 'stackA');
    const streamFromStackA = new Stream(stackA, 'MyStream', {
      encryption: StreamEncryption.KMS,
    });

    const stackB = new Stack(app, 'stackB');
    const user = new iam.User(stackB, 'UserWhoNeedsAccess');
    streamFromStackA.grantRead(user);

    Template.fromStack(stackB).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([{
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
    const stack = new Stack();

    const parameter = new CfnParameter(stack, 'my-retention-period', {
      type: 'Number',
      default: 48,
      minValue: 24,
      maxValue: 8760,
    });

    new Stream(stack, 'MyStream', {
      retentionPeriod: Duration.hours(parameter.valueAsNumber),
    });

    Template.fromStack(stack).templateMatches({
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
              StreamMode: StreamMode.PROVISIONED,
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
    const stack = new Stack();

    const fiveMinutes = {
      amount: 5,
      unit: {
        label: 'minutes',
        isoLabel: 'M',
        inMillis: 60000,
      },
    };

    // WHEN
    const stream = new Stream(stack, 'MyStream');

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
    const stack = new Stack();

    const fiveMinutes = {
      amount: 5,
      unit: {
        label: 'minutes',
        isoLabel: 'M',
        inMillis: 60000,
      },
    };

    // WHEN
    const stream = new Stream(stack, 'MyStream');

    // THEN
    expect(stack.resolve(stream.metricGetRecordsBytes())).toEqual({
      dimensions: { StreamName: { Ref: 'MyStream5C050E93' } },
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Bytes',
      period: fiveMinutes,
      statistic: 'Average',
    });

    expect(stack.resolve(stream.metricGetRecordsBytes({
      period: Duration.minutes(1),
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
      period: Duration.minutes(1),
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
