import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Stream, StreamEncryption } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'default stream'(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream');

    expect(stack).toMatch({
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
                  Ref: 'AWS::NoValue'
                },
                {
                  EncryptionType: 'KMS',
                  KeyId: 'alias/aws/kinesis'
                }
              ]
            }
          }
        }
      },
      Conditions: {
        AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
          'Fn::Or': [
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-north-1'
              ]
            },
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-northwest-1'
              ]
            }
          ]
        }
      }
    });

    test.done();
  },

  'multiple default streams only have one condition for encryption'(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream');
    new Stream(stack, 'MyOtherStream');

    expect(stack).toMatch({
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
                  Ref: 'AWS::NoValue'
                },
                {
                  EncryptionType: 'KMS',
                  KeyId: 'alias/aws/kinesis'
                }
              ]
            }
          }
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
                  Ref: 'AWS::NoValue'
                },
                {
                  EncryptionType: 'KMS',
                  KeyId: 'alias/aws/kinesis'
                }
              ]
            }
          }
        }
      },
      Conditions: {
        AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
          'Fn::Or': [
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-north-1'
              ]
            },
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-northwest-1'
              ]
            }
          ]
        }
      }
    });

    test.done();
  },

  'stream from attributes'(test: Test) {
    const stack = new Stack();

    const s = Stream.fromStreamAttributes(stack, 'MyStream', {
      streamArn: 'arn:aws:kinesis:region:account-id:stream/stream-name'
    });

    test.equals(s.streamArn, 'arn:aws:kinesis:region:account-id:stream/stream-name');

    test.done();
  },

  'uses explicit shard count'(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      shardCount: 2
    });

    expect(stack).toMatch({
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
                  Ref: 'AWS::NoValue'
                },
                {
                  EncryptionType: 'KMS',
                  KeyId: 'alias/aws/kinesis'
                }
              ]
            }
          }
        }
      },
      Conditions: {
        AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
          'Fn::Or': [
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-north-1'
              ]
            },
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-northwest-1'
              ]
            }
          ]
        }
      }
    });

    test.done();
  },
  'uses explicit retention period'(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      retentionPeriod: Duration.hours(168)
    });

    expect(stack).toMatch({
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
                  Ref: 'AWS::NoValue'
                },
                {
                  EncryptionType: 'KMS',
                  KeyId: 'alias/aws/kinesis'
                }
              ]
            }
          }
        }
      },
      Conditions: {
        AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
          'Fn::Or': [
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-north-1'
              ]
            },
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region'
                },
                'cn-northwest-1'
              ]
            }
          ]
        }
      }
    });

    test.done();
  },

  'retention period must be between 24 and 168 hours'(test: Test) {
    test.throws(() => {
      new Stream(new Stack(), 'MyStream', {
        retentionPeriod: Duration.hours(169)
      });
    }, /retentionPeriod must be between 24 and 168 hours. Received 169/);

    test.throws(() => {
      new Stream(new Stack(), 'MyStream', {
        retentionPeriod: Duration.hours(23)
      });
    }, /retentionPeriod must be between 24 and 168 hours. Received 23/);

    test.done();
  },

  'uses Kinesis master key if MANAGED encryption type is provided'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.MANAGED
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            RetentionPeriodHours: 24,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: 'alias/aws/kinesis'
            }
          }
        }
      }
    });

    test.done();
  },

  'encryption key cannot be supplied with UNENCRYPTED as the encryption type'(test: Test) {
    const stack = new Stack();
    const key = new kms.Key(stack, 'myKey');

    test.throws(() => {
      new Stream(stack, 'MyStream', {
        encryptionKey: key,
        encryption: StreamEncryption.UNENCRYPTED
      });
    }, /encryptionKey is specified, so 'encryption' must be set to KMS/);

    test.done();
  },

  'if a KMS key is supplied, use KMS as the encryption type'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const key = new kms.Key(stack, 'myKey');

    // WHEN
    new Stream(stack, 'myStream', {
      encryptionKey: key
    });

    // THEN
    expect(stack).to(
      haveResource('AWS::Kinesis::Stream', {
        ShardCount: 1,
        RetentionPeriodHours: 24,
        StreamEncryption: {
          EncryptionType: 'KMS',
          KeyId: {
            'Fn::GetAtt': ['myKey441A1E73', 'Arn']
          }
        }
      })
    );

    test.done();
  },

  'auto-creates KMS key if encryption type is KMS but no key is provided'(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS
    });

    expect(stack).toMatch({
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
                    'kms:UntagResource'
                  ],
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition'
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId'
                          },
                          ':root'
                        ]
                      ]
                    }
                  },
                  Resource: '*'
                }
              ],
              Version: '2012-10-17'
            }
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain'
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            ShardCount: 1,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
              }
            }
          }
        }
      }
    });

    test.done();
  },

  'uses explicit KMS key if encryption type is KMS and a key is provided'(test: Test) {
    const stack = new Stack();

    const explicitKey = new kms.Key(stack, 'ExplicitKey', {
      description: 'Explicit Key'
    });

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
      encryptionKey: explicitKey
    });

    expect(stack).toMatch({
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
                    'kms:UntagResource'
                  ],
                  Effect: 'Allow',
                  Principal: {
                    AWS: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          {
                            Ref: 'AWS::Partition'
                          },
                          ':iam::',
                          {
                            Ref: 'AWS::AccountId'
                          },
                          ':root'
                        ]
                      ]
                    }
                  },
                  Resource: '*'
                }
              ],
              Version: '2012-10-17'
            }
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain'
        },
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            RetentionPeriodHours: 24,
            ShardCount: 1,
            StreamEncryption: {
              EncryptionType: 'KMS',
              KeyId: {
                'Fn::GetAtt': ['ExplicitKey7DF42F37', 'Arn']
              }
            }
          }
        }
      }
    });

    test.done();
  },

  permissions: {
    'with encryption': {
      'grantRead creates and attaches a policy with read only access to Stream and EncryptionKey'(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.KMS
        });

        const user = new iam.User(stack, 'MyUser');
        stream.grantRead(user);

        expect(stack).toMatch({
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
                        'kms:UntagResource'
                      ],
                      Effect: 'Allow',
                      Principal: {
                        AWS: {
                          'Fn::Join': [
                            '',
                            [
                              'arn:',
                              {
                                Ref: 'AWS::Partition'
                              },
                              ':iam::',
                              {
                                Ref: 'AWS::AccountId'
                              },
                              ':root'
                            ]
                          ]
                        }
                      },
                      Resource: '*'
                    },
                    {
                      Action: 'kms:Decrypt',
                      Effect: 'Allow',
                      Principal: {
                        AWS: {
                          'Fn::GetAtt': ['MyUserDC45028B', 'Arn']
                        }
                      },
                      Resource: '*'
                    }
                  ],
                  Version: '2012-10-17'
                },
                Description: 'Created by MyStream'
              },
              UpdateReplacePolicy: 'Retain',
              DeletionPolicy: 'Retain'
            },
            MyStream5C050E93: {
              Type: 'AWS::Kinesis::Stream',
              Properties: {
                ShardCount: 1,
                RetentionPeriodHours: 24,
                StreamEncryption: {
                  EncryptionType: 'KMS',
                  KeyId: {
                    'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
                  }
                }
              }
            },
            MyUserDC45028B: {
              Type: 'AWS::IAM::User'
            },
            MyUserDefaultPolicy7B897426: {
              Type: 'AWS::IAM::Policy',
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: ['kinesis:DescribeStream', 'kinesis:GetRecords', 'kinesis:GetShardIterator', 'kinesis:ListShards'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
                      }
                    },
                    {
                      Action: 'kms:Decrypt',
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
                      }
                    }
                  ],
                  Version: '2012-10-17'
                },
                PolicyName: 'MyUserDefaultPolicy7B897426',
                Users: [
                  {
                    Ref: 'MyUserDC45028B'
                  }
                ]
              }
            }
          }
        });

        test.done();
      },
      'grantWrite creates and attaches a policy with write only access to Stream and EncryptionKey'(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.KMS
        });

        const user = new iam.User(stack, 'MyUser');
        stream.grantWrite(user);

        expect(stack).toMatch({
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
                        'kms:UntagResource'
                      ],
                      Effect: 'Allow',
                      Principal: {
                        AWS: {
                          'Fn::Join': [
                            '',
                            [
                              'arn:',
                              {
                                Ref: 'AWS::Partition'
                              },
                              ':iam::',
                              {
                                Ref: 'AWS::AccountId'
                              },
                              ':root'
                            ]
                          ]
                        }
                      },
                      Resource: '*'
                    },
                    {
                      Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                      Effect: 'Allow',
                      Principal: {
                        AWS: {
                          'Fn::GetAtt': ['MyUserDC45028B', 'Arn']
                        }
                      },
                      Resource: '*'
                    }
                  ],
                  Version: '2012-10-17'
                },
                Description: 'Created by MyStream'
              },
              UpdateReplacePolicy: 'Retain',
              DeletionPolicy: 'Retain'
            },
            MyStream5C050E93: {
              Type: 'AWS::Kinesis::Stream',
              Properties: {
                ShardCount: 1,
                RetentionPeriodHours: 24,
                StreamEncryption: {
                  EncryptionType: 'KMS',
                  KeyId: {
                    'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
                  }
                }
              }
            },
            MyUserDC45028B: {
              Type: 'AWS::IAM::User'
            },
            MyUserDefaultPolicy7B897426: {
              Type: 'AWS::IAM::Policy',
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: ['kinesis:DescribeStream', 'kinesis:PutRecord', 'kinesis:PutRecords'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
                      }
                    },
                    {
                      Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
                      }
                    }
                  ],
                  Version: '2012-10-17'
                },
                PolicyName: 'MyUserDefaultPolicy7B897426',
                Users: [
                  {
                    Ref: 'MyUserDC45028B'
                  }
                ]
              }
            }
          }
        });

        test.done();
      },
      'grantReadWrite creates and attaches a policy with access to Stream and EncryptionKey'(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.KMS
        });

        const user = new iam.User(stack, 'MyUser');
        stream.grantReadWrite(user);

        expect(stack).toMatch({
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
                        'kms:UntagResource'
                      ],
                      Effect: 'Allow',
                      Principal: {
                        AWS: {
                          'Fn::Join': [
                            '',
                            [
                              'arn:',
                              {
                                Ref: 'AWS::Partition'
                              },
                              ':iam::',
                              {
                                Ref: 'AWS::AccountId'
                              },
                              ':root'
                            ]
                          ]
                        }
                      },
                      Resource: '*'
                    },
                    {
                      Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                      Effect: 'Allow',
                      Principal: {
                        AWS: {
                          'Fn::GetAtt': ['MyUserDC45028B', 'Arn']
                        }
                      },
                      Resource: '*'
                    }
                  ],
                  Version: '2012-10-17'
                }
              },
              DeletionPolicy: 'Retain',
              UpdateReplacePolicy: 'Retain'
            },
            MyStream5C050E93: {
              Type: 'AWS::Kinesis::Stream',
              Properties: {
                RetentionPeriodHours: 24,
                ShardCount: 1,
                StreamEncryption: {
                  EncryptionType: 'KMS',
                  KeyId: {
                    'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
                  }
                }
              }
            },
            MyUserDC45028B: {
              Type: 'AWS::IAM::User'
            },
            MyUserDefaultPolicy7B897426: {
              Type: 'AWS::IAM::Policy',
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: [
                        'kinesis:DescribeStream',
                        'kinesis:GetRecords',
                        'kinesis:GetShardIterator',
                        'kinesis:ListShards',
                        'kinesis:PutRecord',
                        'kinesis:PutRecords'
                      ],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
                      }
                    },
                    {
                      Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStreamKey76F3300E', 'Arn']
                      }
                    }
                  ],
                  Version: '2012-10-17'
                },
                PolicyName: 'MyUserDefaultPolicy7B897426',
                Users: [
                  {
                    Ref: 'MyUserDC45028B'
                  }
                ]
              }
            }
          }
        });

        test.done();
      }
    },
    'with no encryption': {
      'grantRead creates and associates a policy with read only access to Stream'(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream');

        const user = new iam.User(stack, 'MyUser');
        stream.grantRead(user);

        expect(stack).toMatch({
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
                      Ref: 'AWS::NoValue'
                    },
                    {
                      EncryptionType: 'KMS',
                      KeyId: 'alias/aws/kinesis'
                    }
                  ]
                }
              }
            },
            MyUserDC45028B: {
              Type: 'AWS::IAM::User'
            },
            MyUserDefaultPolicy7B897426: {
              Type: 'AWS::IAM::Policy',
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: ['kinesis:DescribeStream', 'kinesis:GetRecords', 'kinesis:GetShardIterator', 'kinesis:ListShards'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
                      }
                    }
                  ],
                  Version: '2012-10-17'
                },
                PolicyName: 'MyUserDefaultPolicy7B897426',
                Users: [
                  {
                    Ref: 'MyUserDC45028B'
                  }
                ]
              }
            }
          },
          Conditions: {
            AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
              'Fn::Or': [
                {
                  'Fn::Equals': [
                    {
                      Ref: 'AWS::Region'
                    },
                    'cn-north-1'
                  ]
                },
                {
                  'Fn::Equals': [
                    {
                      Ref: 'AWS::Region'
                    },
                    'cn-northwest-1'
                  ]
                }
              ]
            }
          }
        });

        test.done();
      },
      'grantWrite creates and attaches a policy with write only access to Stream'(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream');

        const user = new iam.User(stack, 'MyUser');
        stream.grantWrite(user);

        expect(stack).toMatch({
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
                      Ref: 'AWS::NoValue'
                    },
                    {
                      EncryptionType: 'KMS',
                      KeyId: 'alias/aws/kinesis'
                    }
                  ]
                }
              }
            },
            MyUserDC45028B: {
              Type: 'AWS::IAM::User'
            },
            MyUserDefaultPolicy7B897426: {
              Type: 'AWS::IAM::Policy',
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: ['kinesis:DescribeStream', 'kinesis:PutRecord', 'kinesis:PutRecords'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
                      }
                    }
                  ],
                  Version: '2012-10-17'
                },
                PolicyName: 'MyUserDefaultPolicy7B897426',
                Users: [
                  {
                    Ref: 'MyUserDC45028B'
                  }
                ]
              }
            }
          },
          Conditions: {
            AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
              'Fn::Or': [
                {
                  'Fn::Equals': [
                    {
                      Ref: 'AWS::Region'
                    },
                    'cn-north-1'
                  ]
                },
                {
                  'Fn::Equals': [
                    {
                      Ref: 'AWS::Region'
                    },
                    'cn-northwest-1'
                  ]
                }
              ]
            }
          }
        });

        test.done();
      },
      'greatReadWrite creates and attaches a policy with write only access to Stream'(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream');

        const user = new iam.User(stack, 'MyUser');
        stream.grantReadWrite(user);

        expect(stack).toMatch({
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
                      Ref: 'AWS::NoValue'
                    },
                    {
                      EncryptionType: 'KMS',
                      KeyId: 'alias/aws/kinesis'
                    }
                  ]
                }
              }
            },
            MyUserDC45028B: {
              Type: 'AWS::IAM::User'
            },
            MyUserDefaultPolicy7B897426: {
              Type: 'AWS::IAM::Policy',
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: [
                        'kinesis:DescribeStream',
                        'kinesis:GetRecords',
                        'kinesis:GetShardIterator',
                        'kinesis:ListShards',
                        'kinesis:PutRecord',
                        'kinesis:PutRecords'
                      ],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
                      }
                    }
                  ],
                  Version: '2012-10-17'
                },
                PolicyName: 'MyUserDefaultPolicy7B897426',
                Users: [
                  {
                    Ref: 'MyUserDC45028B'
                  }
                ]
              }
            }
          },
          Conditions: {
            AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
              'Fn::Or': [
                {
                  'Fn::Equals': [
                    {
                      Ref: 'AWS::Region'
                    },
                    'cn-north-1'
                  ]
                },
                {
                  'Fn::Equals': [
                    {
                      Ref: 'AWS::Region'
                    },
                    'cn-northwest-1'
                  ]
                }
              ]
            }
          }
        });

        test.done();
      }
    }
  },
  'cross-stack permissions': {
    'no encryption'(test: Test) {
      const app = new App();
      const stackA = new Stack(app, 'stackA');
      const streamFromStackA = new Stream(stackA, 'MyStream');

      const stackB = new Stack(app, 'stackB');
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      streamFromStackA.grantRead(user);

      expect(stackA).toMatch({
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
                    Ref: 'AWS::NoValue'
                  },
                  {
                    EncryptionType: 'KMS',
                    KeyId: 'alias/aws/kinesis'
                  }
                ]
              }
            }
          }
        },
        Conditions: {
          AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
            'Fn::Or': [
              {
                'Fn::Equals': [
                  {
                    Ref: 'AWS::Region'
                  },
                  'cn-north-1'
                ]
              },
              {
                'Fn::Equals': [
                  {
                    Ref: 'AWS::Region'
                  },
                  'cn-northwest-1'
                ]
              }
            ]
          }
        },
        Outputs: {
          ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD: {
            Value: {
              'Fn::GetAtt': ['MyStream5C050E93', 'Arn']
            },
            Export: {
              Name: 'stackA:ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD'
            }
          }
        }
      });

      test.done();
    },
    'fails with encryption due to cyclic dependency'(test: Test) {
      const app = new App();
      const stackA = new Stack(app, 'stackA');
      const streamFromStackA = new Stream(stackA, 'MyStream', {
        encryption: StreamEncryption.KMS
      });

      const stackB = new Stack(app, 'stackB');
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      streamFromStackA.grantRead(user);
      test.throws(() => app.synth(), /'stack.' depends on 'stack.'/);
      test.done();
    }
  }
};
